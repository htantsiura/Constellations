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
import { createConstellation, createStar } from '../ThreeComponents/ObjectsCreator'


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

    // creating objects on the scene ---------------------------------

    const constellationList = {}
    ConstellationData.forEach((item) => {
      const constellPos = raDecToVector3(item, 1)
      const newConstellation = createConstellation(item, constellPos)
      scene.add(newConstellation)
      constellationList[item.name] = newConstellation
    })

    StarsData.forEach((item) => {
      const parentGroup = constellationList[item.constellation]
      const absoluteStarPos = raDecToVector3ForStars(item, 1)
      const relativeStarPos = absoluteStarPos.sub(constellationList[item.constellation].userData.pivot)
      const newStar = createStar(item, relativeStarPos, 'default')
      parentGroup.add(newStar)
    })

    // ------------------------------------
    // Test Part  -------------------------

    function changeStateStar(item, state) {
      const targetStar = constellationList[item.constellation].children.find(child => child.userData?.name === item.name) 
      console.log('targetStar = ' + constellationList[item.constellation].children[2].userData.name)

      if (targetStar && targetStar.userData.state !== state) {
        targetStar.userData.setState(state)
      }
    }

    changeStateStar(StarsData[1], 'active')
    changeStateStar(StarsData[2], 'default')

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