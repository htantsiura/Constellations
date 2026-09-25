import ConstellationData from '../../ConstellationsData.json' 
import * as THREE from 'three'

export function raDecToVector3(item, radius = 10) {

  const raRad = item.right_ascension * (Math.PI / 12)
  const decRad = item.declination * (Math.PI / 180)

  const x = radius * Math.cos(decRad) * Math.cos(raRad)
  const y = radius * Math.sin(decRad) 
  const z = -1 * radius * Math.cos(decRad) * Math.sin(raRad)

  return new THREE.Vector3(x, y, z)
}
