import ConstellationData from '../../ConstellationsData.json' 
import * as THREE from 'three'

export default function raDecToVector3(item, radius = 10) {

  const raRad = item.right_ascension * (Math.PI / 12)
  const decRad = item.declination * (Math.PI / 180)

  const x = radius * Math.cos(decRad) * Math.cos(raRad)
  const y = radius * Math.sin(decRad) 
  const z = -1 * radius * Math.cos(decRad) * Math.sin(raRad)

  return new THREE.Vector3(x, y, z)
}

/* export default function raDecToVector3(name, radius = 10) {

  
  
  for (let i = 0; i < ConstellationData.length; i++) {
    if(ConstellationData[i].name === name) {
      const raRad = ConstellationData[i].right_ascension * (Math.PI / 12)
      const decRad = ConstellationData[i].declination * (Math.PI / 180)

      const x = radius * Math.cos(decRad) * Math.cos(raRad)
      const y = radius * Math.sin(decRad) 
      const z = -1 * radius * Math.cos(decRad) * Math.sin(raRad)

      return new THREE.Vector3(x, y, z)
    }
    else if( i === ConstellationData.length) {
      alert("No such name")
    }
  }
} */
