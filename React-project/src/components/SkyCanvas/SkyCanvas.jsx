import './SkyCanvas.css'
import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//import ConstellationData from '../../ConstellationsData.json' 
//import StarsData from '../../StarsData.json' 

import ConstellationData from '../../ConstellationDataNew.json' 
import StarsData from '../../StarsDataNew.json'
import LinesData from '../../LinesData_stellarium-skycultures-western.json'

import { raDecToVector3, raDecToVector3ForStars } from '../utilities/ThreeHelpers'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { vec3 } from 'three/tsl'
import { Vector3 } from 'three/webgpu'
import { createConstellation, createStar } from '../ThreeComponents/ObjectsCreator'
import {
  startTargetAnimation, 
  updateTargetAnimation, 
  startCameraAnimation, 
  updateCameraAnimation, 
  calculateRotatedTarget,
  updateStarsVisibility 
} from '../ThreeComponents/SmoothCameraTargeting'

export default function SkyCanvas({ onStarClick, onConstellationClick, expandedId }) {
  const containerRef = useRef(null)
  const allLabelsRef = useRef(new Map())
  const activeStarRef = useRef(null)

  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  const targetAnimRef = useRef(null); // Для плавного поворота (target)
  const cameraAnimRef = useRef(null); // Для плавного полета (camera.position)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0D001A')

    const width = container.clientWidth
    const height = container.clientHeight
    const camera = new THREE.PerspectiveCamera( 35, width / height, 1, 2500 )
    camera.position.set(0, 0, 0.1)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(width, height)
    labelRenderer.domElement.className = 'label-renderer-container'

    container.appendChild(renderer.domElement)
    container.appendChild(labelRenderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 0.1
    controls.maxDistance = 3000
    controls.target.set(0, 0, 0)
    controlsRef.current = controls

    // Main Code  ------------------------------------

    let currentActiveStar = null;
    const distanceScale = 1
    const isLogariphScale = false;
    const constellationList = {}

    const testMat = new THREE.MeshBasicMaterial({ color: 'blue' , wireframe: true })
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3F0080, });
    const testGeometry = new THREE.BoxGeometry()
    const testCube = new THREE.Mesh( testGeometry, testMat)
    const starScale = 0.5
    testCube.scale.set(starScale, starScale, starScale)
    scene.add(testCube)
/* 
    const starPlaneGeometry = new THREE.PlaneGeometry()
    const starMaterial = new THREE.MeshBasicMaterial({ color: 'yellow', side: THREE.DoubleSide })
    const star = new THREE.Mesh(new THREE.BoxGeometry(), starMaterial);
    //scene.add(star)
 */

    // creating objects on the scene ---------------------------------

  
    

    function setActiveStar(label) {
      if (currentActiveStar && currentActiveStar !== label) {
        currentActiveStar.userData.setState('default')
      }
      label.userData.setState('active')
      currentActiveStar = label;
      if (onStarClick) {
        // Обязательно передаем ID звезды, так как твоя функция openStar ищет именно по ID
        onStarClick(label.userData.id); 
      }
    }

    const handleTargetToggle = (constellationGroup, pivotPos, isTargeted, isAutoReset = false) => {
      if (!controlsRef.current || !cameraRef.current) return;

      if (isTargeted) {
        controlsRef.current.maxDistance = Infinity; 
        controlsRef.current.target.copy(pivotPos);  
        controlsRef.current.update();
      } else {
        if (isAutoReset) return;

        const centerPos = new THREE.Vector3(0, 0, 0);
        const currentDist = cameraRef.current.position.distanceTo(centerPos);
        controlsRef.current.maxDistance = Math.max(500, currentDist);
        
        const fakeCenterTarget = calculateRotatedTarget(cameraRef, controlsRef.current.target, centerPos);
        startTargetAnimation(controlsRef, fakeCenterTarget, targetAnimRef, () => {
          controlsRef.current.target.copy(centerPos);
          controlsRef.current.update();
        });
      }
      updateStarsVisibility(constellationGroup, isTargeted, allLabelsRef);
    };

    ConstellationData.forEach((item) => {
      const constellPos = raDecToVector3(item, distanceScale, isLogariphScale)
      const newConstellation = createConstellation(
        item, 
        constellPos, 
        (label) => {
          if (onConstellationClick) {
            onConstellationClick(label.userData.name);
          }
        },
        (pivotPos, isTargeted, isAutoReset) => {
          handleTargetToggle(newConstellation, pivotPos, isTargeted, isAutoReset)
        }
      )
      scene.add(newConstellation)
      constellationList[item.name] = newConstellation
      allLabelsRef.current.set(item.id, newConstellation)
    })

    StarsData.forEach((item) => {
      const parentGroup = constellationList[item.constellation]
      const absoluteStarPos = raDecToVector3ForStars(item, distanceScale, isLogariphScale)
      const relativeStarPos = absoluteStarPos.clone().sub(constellationList[item.constellation].userData.pivot)
      const newStar = createStar(item, relativeStarPos, absoluteStarPos, setActiveStar, 'default')
      allLabelsRef.current.set(item.id, newStar)
      parentGroup.add(newStar)
    })



    function createLines(data, constell_name) {

    }

    LinesData.constellations.forEach((c) => {
      const parentGroup = constellationList[c.common_name.native]
      if (parentGroup) {
        if(c.common_name.native === parentGroup.userData.name) {
          const linesGroup = new THREE.Group()
          let i = 0;
          linesGroup.name = "linesGroup"
          linesGroup.userData = {
            constellation: c.common_name.native,
            type: "linesGroup"
          }
          constellationList[c.common_name.native].add(linesGroup)
          linesGroup.position.set(0, 0, 0)

          c.lines.map((line) => {
            const points = []
            line.map((e) => {
              const neededStar = constellationList[c.common_name.native].children.find(child => child.userData?.hip === e)
              neededStar ? points.push(neededStar.userData.localPos) : null
            })
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
            const newLine = new THREE.Line(lineGeometry, lineMaterial)
            newLine.userData = {
              index: i,
              hips: line,
              type: 'line',
              constellation: c.common_name.native
            }
            linesGroup.add(newLine)
            i++;
          })
        }
      }
    })


    // ------------------------------------
    // Test Part  -------------------------

  
    // -----------------------------

    let animationFrameId

    function animate() {
      animationFrameId = requestAnimationFrame(animate)

      updateTargetAnimation(targetAnimRef, controlsRef);
      updateCameraAnimation(cameraAnimRef, cameraRef, controlsRef);
      
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return

      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      labelRenderer.setSize(w, h) // update 2D renderer
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      scene.clear()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      if (container.contains(labelRenderer.domElement)) {
        container.removeChild(labelRenderer.domElement)
      }

      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    if(!expandedId) return;
    const targetLabel = allLabelsRef.current.get(expandedId)
    
    if (targetLabel) {
      if (activeStarRef.current && activeStarRef.current !== targetLabel) {
        activeStarRef.current.userData.setState('default')
      }
      targetLabel.userData.setState('active')
      activeStarRef.current = targetLabel

      // Сценарий А: Плавный поворот камеры
      const worldPosition = new THREE.Vector3();
      targetLabel.getWorldPosition(worldPosition);

      // Вычисляем точку на орбите, чтобы не "срезать угол"
      const targetPos = calculateRotatedTarget(cameraRef, controlsRef.current.target, worldPosition);
      
      // Даем команду Аниматору Прицела начать плавный поворот
      startTargetAnimation(controlsRef, targetPos, targetAnimRef);
    }
  }, [expandedId])

  return (
    <div ref={containerRef} className="sky-canvas-container" />
  )
}