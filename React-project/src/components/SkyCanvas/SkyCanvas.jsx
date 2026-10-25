import './SkyCanvas.css'
import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import ConstellationData from '../../DataSources/ConstellationData1.json' 
import StarsData from '../../DataSources/StarsData1.json'
import LinesData from '../../DataSources/LinesData_SnT_upd.json'

import { raDecToVector3, raDecToVector3ForStars } from '../utilities/ThreeHelpers'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { min, vec3 } from 'three/tsl'
import { Vector3 } from 'three/webgpu'
import { createConstellation, createStar, createLines, createSun } from '../ThreeComponents/ObjectsCreator'
import { updateStarsVisibility,
        updateLinesVisibility } from '../ThreeComponents/ObjectsVisibility'
import { ImprovedNoise } from 'three/examples/jsm/Addons.js'

import { cameraZoom, changeCameraTarget, changeCameraSelectFromZero } from '../ThreeComponents/Navigation'

export default function SkyCanvas({ onStarClick, onConstellationClick, expandedId }) {
  
  const distanceScale = 1
  const isLogariphScale = true;
  const zeroPos = new THREE.Vector3(0, 0, 0)

  const containerRef = useRef(null)
  const allLabelsRef = useRef(new Map())
  const activeObjRef = useRef(null)
  const constellationList = {}
  const controlsRef = useRef(null);

  const cameraRef = useRef(null); // for resizing
  const cameraObj = useRef(null);

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
    cameraObj.current = camera;

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

    function setActiveObject (obj) {
      // if smth was selected, then make it default
      if (activeObjRef.current && activeObjRef.current !== obj) {
        activeObjRef.current.userData.setState('default')
      }
      if(obj.userData.state === 'selected') {
        obj.userData.setState('targeted')
        changeCameraTarget(obj.userData.pivot, controlsRef)
        cameraZoom(camera, 30)
        
      } else {
        obj.userData.setState('selected')
        changeCameraSelectFromZero(obj.userData.pivot, cameraRef, controlsRef)
        cameraZoom(camera, 35)
      }
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
    
    // CREATING OBJECTS ON THE SCENE ------------------------------------------------

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3F0080, });
    const lineMaterialSelected = new THREE.LineBasicMaterial({ color: 0x7E00FF});
    
    const sun = createSun();
    scene.add(sun)

    ConstellationData.forEach((item) => {
      const constellPos = raDecToVector3(item, distanceScale, isLogariphScale)
      const newConstellation = createConstellation( item, constellPos, setActiveObject )
      scene.add(newConstellation)
      constellationList[item.name] = newConstellation
      allLabelsRef.current.set(item.id, newConstellation)
    })

    StarsData.forEach((item) => {
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
      if (activeObjRef.current === targetLabel) return;

      if (activeObjRef.current && activeObjRef.current !== targetLabel) {
        activeObjRef.current.userData.setState('default')
      }
      targetLabel.userData.setState('selected')
      activeObjRef.current = targetLabel

      changeCameraSelectFromZero(targetLabel.userData.pivot, cameraRef, controlsRef);
      cameraZoom(cameraObj.current, 35);
    }
  }, [expandedId])

  return (
    <div ref={containerRef} className="sky-canvas-container" />
  )
}