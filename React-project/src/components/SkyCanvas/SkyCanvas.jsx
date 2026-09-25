import './SkyCanvas.css'
import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ConstellationData from '../../ConstellationsData.json' 
import { raDecToVector3 } from '../utilities/ThreeHelpers'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'


export default function SkyCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0D001A')

    const width = container.clientWidth
    const height = container.clientHeight
    const camera = new THREE.PerspectiveCamera( 40, width / height, 1, 1000 )
    camera.position.set(0, 0, 2)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(width, height)
    labelRenderer.setSize(width, height) // 👈 ИСПРАВЛЕНО: setSize вместо getSize
    labelRenderer.domElement.style.position = 'absolute' // 👈 Накладываем сверху
    labelRenderer.domElement.style.top = '0px'
    labelRenderer.domElement.style.left = '0px'
    labelRenderer.domElement.style.pointerEvents = 'none' // 👈 Клики пролетают к OrbitControls

    container.appendChild(renderer.domElement)
    container.appendChild(labelRenderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 0.1
    controls.maxDistance = 100
    controls.target.set(0, 0, 0)

    // Scene ------------------------------------

    const testMat = new THREE.MeshBasicMaterial({ color: 'blue' , wireframe: true })
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

      const div = document.createElement('div')
      div.className = 'constellation-label'
      div.textContent = item.name

      const label = new CSS2DObject(div)
      label.position.copy(constellPos)
      scene.add(label)
    })

   

    // End of Scene ------------------------------------

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
    container.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)

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