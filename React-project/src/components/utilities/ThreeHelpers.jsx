import ConstellationData from '../../ConstellationsData.json' 
import * as THREE from 'three'

export function raDecToVector3(item, defaultRadius = 10, scale = 1) {
  // Берём avg_distance из объекта; если поля нет — используем фоллбек defaultRadius
  const distance = (item.avg_distance ?? defaultRadius) * scale;

  const raRad = item.right_ascension * (Math.PI / 12);
  const decRad = item.declination * (Math.PI / 180);

  const x = distance * Math.cos(decRad) * Math.cos(raRad);
  const y = distance * Math.sin(decRad);
  const z = -1 * distance * Math.cos(decRad) * Math.sin(raRad);

  return new THREE.Vector3(x, y, z);
}

/* export function raDecToVector3(item, radius = 10) {

  const raRad = item.right_ascension * (Math.PI / 12)
  const decRad = item.declination * (Math.PI / 180)

  const x = radius * Math.cos(decRad) * Math.cos(raRad)
  const y = radius * Math.sin(decRad) 
  const z = -1 * radius * Math.cos(decRad) * Math.sin(raRad)

  return new THREE.Vector3(x, y, z)
} */
