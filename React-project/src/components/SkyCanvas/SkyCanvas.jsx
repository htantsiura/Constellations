import './SkyCanvas.css'
import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import ConstellationData from '../../DataSources/ConstellationData1.json' 
import StarsData from '../../DataSources/StarsData1.json'
import LinesData from '../../DataSources/LinesData_SnT_upd.json'

import { raDecToVector3, raDecToVector3ForStars } from '../utilities/ThreeHelpers'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { vec3 } from 'three/tsl'
import { Vector3 } from 'three/webgpu'
import { createConstellation, createStar, createLines } from '../ThreeComponents/ObjectsCreator'
import { startTargetAnimation, 
        updateTargetAnimation, 
        startCameraAnimation, 
        updateCameraAnimation, 
        calculateRotatedTarget,
        updateStarsVisibility,
        updateLinesVisibility } from '../ThreeComponents/SmoothCameraTargeting'

export default function SkyCanvas({ onStarClick, onConstellationClick, expandedId }) {
  
  const containerRef = useRef(null)
  const allLabelsRef = useRef(new Map())
  const activeStarRef = useRef(null)

  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  const selectedObjectRef = useRef(null);
  const targetedObjectRef = useRef(null);
  let currentActiveObj = null;

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
    const isLogariphScale = true;
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

    function setActiveObject (obj) {
      // if smth was selected, then make it default
      if (currentActiveObj && currentActiveObj !== obj) {
        currentActiveObj.userData.setState('default')
        console.log(currentActiveObj.userData.name, "?==", obj.userData.name)
      }
      
      if(obj.userData.state === 'selected') {
        obj.userData.setState('targeted')
      } else {
        obj.userData.setState('selected')
      }
      currentActiveObj = obj;
      //console.log("isTargeted:", currentActiveObj.userData.isTargeted)

      if (obj.userData.type === 'star' && onStarClick) {
        onStarClick(obj.userData.id)
        updateStarsVisibility(obj, allLabelsRef)
        updateLinesVisibility(obj, constellationList)
      }
      if (obj.userData.type === 'constellation' && onConstellationClick) {
        onConstellationClick(obj.userData.id)
        updateStarsVisibility(obj, allLabelsRef)
        updateLinesVisibility(obj, constellationList)
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
      
    };

    // Scene Objects creators ------------------------------------------------

    ConstellationData.forEach((item) => {
      const constellPos = raDecToVector3(item, distanceScale, isLogariphScale)
      const newConstellation = createConstellation(
        item, 
        constellPos, 
        setActiveObject
        /* (label) => {
          if (onConstellationClick) {
            onConstellationClick(label.userData.name);
          }
        },
        (pivotPos, isTargeted, isAutoReset) => {
          handleTargetToggle(newConstellation, pivotPos, isTargeted, isAutoReset)
        } */
      )
      scene.add(newConstellation)
      constellationList[item.name] = newConstellation
      allLabelsRef.current.set(item.id, newConstellation)
    })

    StarsData.forEach((item) => {
      //console.log('star.  ', constellationList[item.constellation].userData.name)
      const parentGroup = constellationList[item.constellation]
      const absoluteStarPos = raDecToVector3ForStars(item, distanceScale, isLogariphScale)
      const relativeStarPos = absoluteStarPos.clone().sub(constellationList[item.constellation].userData.pivot)
      const newStar = createStar(item, relativeStarPos, absoluteStarPos, setActiveObject)
      allLabelsRef.current.set(item.id, newStar)
      parentGroup.add(newStar)
    })

    LinesData.constellations.forEach((c) => {
      const parentGroup = constellationList[c.common_name.native]
      if (parentGroup) {
        if(c.common_name.native === parentGroup.userData.name) {
          let i = 0;
          const newLinesGroup = createLines(c, constellationList, lineMaterial, i)
          newLinesGroup.name = "linesGroup"
          newLinesGroup.userData = {
            constellation: c.common_name.native,
            type: "linesGroup"
          }
          constellationList[c.common_name.native].add(newLinesGroup)
          newLinesGroup.position.set(0, 0, 0)

          
        }
      }
    })

    // ------------------------------------------------------------------------
    // Test Part  -------------------------------------------------------------

  
    // ------------------------------------------------------------------------

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

  /* useEffect(() => {
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
  }, [expandedId]) */

  return (
    <div ref={containerRef} className="sky-canvas-container" />
  )
}