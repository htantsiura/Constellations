import './SkyCanvas.css'
import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ConstellationData from '../../ConstellationsData.json' 
import StarsData from '../../StarsData.json' 
import { raDecToVector3, raDecToVector3ForStars } from '../utilities/ThreeHelpers'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { vec3 } from 'three/tsl'
import { Vector3 } from 'three/webgpu'
import { createConstellation } from '../ThreeComponents/CreateConstellation'


export default function SkyCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0D001A')

    const width = container.clientWidth
    const height = container.clientHeight
    const camera = new THREE.PerspectiveCamera( 35, width / height, 1, 2000 )
    camera.position.set(0, 0, 0.1)

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
    controls.maxDistance = 100
    controls.target.set(0, 0, 0)

    // Main Code  ------------------------------------

    const testMat = new THREE.MeshBasicMaterial({ color: 'blue' , wireframe: true })
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


  /*   const emptyGroup = new THREE.Group()

    function addStarsToConstellations(group, constellPos) {
      StarsData.forEach((item) => {
        if (item.constellation === group.userData.name) {
          const starPos = raDecToVector3ForStars(item, 1)
          const starLocalPos = starPos.clone().sub(constellPos)
          
          const newStar = starObj.clone()
          const scale = 200
          newStar.scale.set(item.distance_light_year / scale, item.distance_light_year / scale, item.distance_light_year / scale)
          //newStar.scale.set(0.2, 0.2, 0.2)
          newStar.position.set(starLocalPos.x, starLocalPos.y, starLocalPos.z)
          newStar.userData = { id: item.id, name: item.name, constellation: item.constellation }
          group.add(newStar)
          newStar.lookAt(camera.position)
          newStar.rotation.set(1, 1, 1) 
          
          addStarLabel(item, group, starLocalPos) 
        }
      })
    }

    function addConstellationLabel(item, group, isActive = false) {
      
      const div = document.createElement('div')
      div.className = `constellation-label-container ${isActive ? 'is-active' : ''}`
      div.textContent = item.name

      const label = new CSS2DObject(div)
      label.center.set(0.5, 0.5)
      label.position.set(0, 0, 0)

      label.userData = {
        id: item.id,
        name: item.name,
        isActive: isActive,
        setActive: (activeState) => {
          label.userData.isActive = activeState
          div.classList.toggle('is-active', activeState)
        }
      }

      group.add(label)
      return label
    }

    function addStarLabel(item, group, position, isActive = false) {
      
      const container = document.createElement('div')
      container.className = `star-label-container ${isActive ? 'is-active' : ''}`

      const defIcon = document.createElement('div')
      defIcon.className = 'star-icon-default'
      container.appendChild(defIcon)
      
      const activeIcon = document.createElement('div')
      activeIcon.className = 'star-icon-active'
      container.appendChild(activeIcon)

      const textDiv = document.createElement('div')
      textDiv.className = 'star-label-text'
      textDiv.textContent = item.name
      container.appendChild(textDiv)

      const label = new CSS2DObject(container)
      label.center.set(0, 0.5)
      label.position.copy(position)

      label.userData = {
        id: item.id,
        name: item.name,
        pivotPos: position,
        isActive: isActive,
        setActive: (activeState) => {
          label.userData.isActive = activeState
          container.classList.toggle('is-active', activeState)
        }
      }

      group.add(label)
      return label
    }

    ConstellationData.forEach((item) => {
      const constellPos = raDecToVector3(item, 1)
      const cstllGroup = emptyGroup.clone()
      cstllGroup.position.set(constellPos.x, constellPos.y, constellPos.z)
      cstllGroup.userData = { 
        id: item.id, 
        name: item.name, 
        pivotPos: constellPos, 
        type: 'constellation-group' 
      }
      addStarsToConstellations(cstllGroup, constellPos)
      addConstellationLabel(item, cstllGroup) 
      scene.add(cstllGroup)
    }) */


    ConstellationData.forEach((item) => {
      const constellPos = raDecToVector3(item, 1)
      const newConstellation = createConstellation(item, constellPos)
      scene.add(newConstellation)
    })

    // ------------------------------------
    // Test Part  ------------------------------------

    /* const activeStar = scene.children.find(child => child.userData?.id === 'bellatrix')
    if(activeStar && activeStar.userData.setActive) {
      activeStar.userData.setActive(true)
    }

    const activeConstell = scene.children.find(child => child.userData?.id === 'orion')
    const activeConstellLabel;
    if(activeConstell) {
      activeConstell.userData.setActive(true)
    }

    
    scene.children.forEach((item) => {
      if (item.userData.name === "Orion")
        console.log("name: " + item.userData.name)
    }) */

    console.log("number of children " + scene.children.length) 

    // -----------------------------

    let animationFrameId

    function animate() {
      animationFrameId = requestAnimationFrame(animate)

      controls.update()
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


  return (
    <div ref={containerRef} className="sky-canvas-container" />
  )
}