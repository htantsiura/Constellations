import './SkyCanvas.css'
import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ConstellationData from '../../ConstellationsData.json' 
import { raDecToVector3 } from '../utilities/ThreeHelpers'


export default function SkyCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0D001A')

    const width = innerWidth
    const height = innerHeight
    const camera = new THREE.PerspectiveCamera( 50, width / height, 1, 1000 )
    camera.position.set(0, 0, 2)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 0.1
    controls.maxDistance = 100
    controls.target.set(0, 0, 0)

    // Scene ------------------------------------

    const testMat = new THREE.MeshBasicMaterial({ color: 'blue' })
    const testGeometry = new THREE.BoxGeometry()

    const testCube = new THREE.Mesh( testGeometry, testMat)
    testCube.scale.set(0.2, 0.2, 0.2)
    scene.add(testCube)

    ConstellationData.forEach((item) => {
      const constellPos = raDecToVector3(item, 25)
      const cube = testCube.clone()
      cube.position.set(constellPos.x, constellPos.y, constellPos.z)
      cube.userData = { id: item.id, name: item.name }

      scene.add(cube)
    })

   

    // End of Scene ------------------------------------

    let animationFrameId

    function animate() {
      animationFrameId = requestAnimationFrame(animate)


      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])


  return (
    <div ref={containerRef} className="sky-canvas-container" />
  )
}