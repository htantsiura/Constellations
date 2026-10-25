import './SkyCanvas.css'
import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

import ConstellationData from '../../DataSources/ConstellationData1.json' 
import StarsData from '../../DataSources/StarsData1.json'
import LinesData from '../../DataSources/LinesData_SnT_upd.json'

import { raDecToVector3, raDecToVector3ForStars } from '../utilities/ThreeHelpers'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { min, vec3 } from 'three/tsl'
import { Vector3 } from 'three/webgpu'
import { createConstellation, createStar, createLines, createSun } from '../ThreeComponents/ObjectsCreator'
import { startTargetAnimation, 
        updateTargetAnimation, 
        startCameraAnimation, 
        updateCameraAnimation, 
        calculateRotatedTarget,
        updateStarsVisibility,
        updateLinesVisibility, 
        updateSunVisibility } from '../ThreeComponents/SmoothCameraTargeting'
import { ImprovedNoise } from 'three/examples/jsm/Addons.js'

export default function SkyCanvas({ onStarClick, onConstellationClick, expandedId }) {
  
  const distanceScale = 1
  const isLogariphScale = true;
  const zeroPos = new THREE.Vector3(0, 0, 0)

  const containerRef = useRef(null)
  const allLabelsRef = useRef(new Map())
  const activeObjRef = useRef(null)
  const previousObjRef = useRef(null)
  const constellationList = {}

  const controlsRef = useRef(null);
  const cameraPosRef = useRef(null);

  const cameraRef = useRef(null); // for resizing

  const selectedObjectRef = useRef(null);
  const targetedObjectRef = useRef(null);

  const targetAnimRef = useRef(null); // Для плавного поворота (target)
  const cameraAnimRef = useRef(null); // Для плавного полета (camera.position)

  useEffect(() => {

    // CREATING SCENE, CAMERA, LAYERS, CONTROLS ------------------------------------------------

    const container = containerRef.current
    if (!container) return
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0D001A)

    const camera = new THREE.PerspectiveCamera( 35, width / height, 10, 2500 )
    camera.position.set(0, 0, 0)
    cameraRef.current = camera
    console.log(camera)
    const cameraPos = new THREE.Vector3();
    const cameraRot = new THREE.Quaternion()

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
    controls.target.copy(zeroPos)
    controlsRef.current = controls
    controlsRef.current.update()

    // functions  ------------------------------------

    //controlsRef.current.update()


    function changeCameraTarget(pivot) {

      if (!controlsRef.current) return;
      controlsRef.current.target.copy(pivot)
      controlsRef.current.update()
    }

    function changeCameraSelectFromZero(pivot) {
      if(!controlsRef.current || !cameraRef.current) return;

      controlsRef.current.target.set(0, 0, 0);
      const direction = pivot.clone().normalize();
      const CAMERA_DISTANCE = -1;
      const newCameraPos = direction.multiplyScalar(CAMERA_DISTANCE);
      cameraRef.current.position.copy(newCameraPos);
      controlsRef.current.update();

    }

    function cameraZoom(camera, value) {
      gsap.to( camera, {
        fov: value,
        duration: 0.5, 
        ease: "power3.Out",
        repeat: 0,
        yoyo: false,
        onUpdate: () => {
          camera.updateProjectionMatrix()
        }
      })
    }


    function setActiveObject (obj) {
      // if smth was selected, then make it default
      if (activeObjRef.current && activeObjRef.current !== obj) {
        activeObjRef.current.userData.setState('default')
      }
      if(obj.userData.state === 'selected') {
        obj.userData.setState('targeted')
        //changeCameraTarget(obj.userData.pivot)
        cameraZoom(camera, 30)
        
      } else {
        obj.userData.setState('selected')
        //changeCameraTarget(zeroPos)
        //changeCameraSelectFromZero(obj.userData.pivot)
        cameraZoom(camera, 35)
      }
      changeCameraTarget(obj.userData.pivot)
      //changeCameraTarget(obj.userData.pivot)
      activeObjRef.current = obj;

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

      /* const handleTargetToggle = (constellationGroup, pivotPos, isTargeted, isAutoReset = false) => {
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
      
    }; */

    // CREATING OBJECTS ON THE SCENE ------------------------------------------------

    /* 
    const testMat = new THREE.MeshBasicMaterial({ color: 'blue' , wireframe: true })
    const darkPlaneMat = new THREE.MeshBasicMaterial({ color: 'brown', side: THREE.DoubleSide, wireframe: false})

    const testGeometry = new THREE.BoxGeometry()
    const darkPlaneGeometry = new THREE.PlaneGeometry();

    const darkPlane = new THREE.Mesh(darkPlaneGeometry, darkPlaneMat);
    camera.add(darkPlane)
    scene.add(camera)
    darkPlane.scale.set(1, 1, 1)
    darkPlane.position.set(0, 0, -5)

    const darkPlaneContainer = document.createElement('div')
    darkPlaneContainer.className = 'dark-plane-container'
    const darkScreen = new CSS2DObject(darkPlaneContainer)
    camera.add(darkScreen)
    darkScreen.position.set(0, 0, -1) */
   
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3F0080, });
    const lineMaterialSelected = new THREE.LineBasicMaterial({ color: 0x7E00FF});
    
    const sun = createSun();
    scene.add(sun)

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
        },*/,
        (pivotPos, isTargeted, isAutoReset) => {
          handleTargetToggle(newConstellation, pivotPos, isTargeted, isAutoReset)
        } 
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
          const newLinesGroup = createLines(c, constellationList, lineMaterial, lineMaterialSelected, i)
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

    let animationFrameId

    function animate() {
      animationFrameId = requestAnimationFrame(animate)


      /* const pos = new Vector3()
      console.log(camera.getWorldPosition(pos)) */

      /* updateTargetAnimation(targetAnimRef, controlsRef);
      updateCameraAnimation(cameraAnimRef, cameraRef, controlsRef); */
      
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

  let prevExpandedId = null;

  useEffect(() => {
    if(!expandedId) return;

    const targetLabel = allLabelsRef.current.get(expandedId)

    if (targetLabel) {
      if (activeObjRef.current && activeObjRef.current !== targetLabel) {
        activeObjRef.current.userData.setState('default')
      }
      targetLabel.userData.setState('selected')
      activeObjRef.current = targetLabel

      
/* 
      // Сценарий А: Плавный поворот камеры
      const worldPosition = new THREE.Vector3();
      targetLabel.getWorldPosition(worldPosition);
      // Вычисляем точку на орбите, чтобы не "срезать угол"
      const targetPos = calculateRotatedTarget(cameraRef, controlsRef.current.target, worldPosition);
      
      // Даем команду Аниматору Прицела начать плавный поворот
      startTargetAnimation(controlsRef, targetPos, targetAnimRef); */
    }
  }, [expandedId])

  return (
    <div ref={containerRef} className="sky-canvas-container" />
  )
}