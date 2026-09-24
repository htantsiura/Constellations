import './SkyCanvas.css'
import { useRef, useEffect } from "react"
import * as THREE from 'three'

export default function SkyCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0D001A')

    const width = window.innerWidth
    const height = window.innerHeight
    const camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 )
    camera.position.set(0, 0, 15)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    container.appendChild(renderer.domElement)

    // Scene ------------------------------------

    const testMat = new THREE.MeshBasicMaterial({ color: 'red' })
    const testGeometry = new THREE.BoxGeometry()

    const testCube = new THREE.Mesh( testGeometry, testMat)
    scene.add(testCube)




    // End of Scene ------------------------------------

    let animationFrameId

    function animate() {
      animationFrameId = requestAnimationFrame(animate)

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