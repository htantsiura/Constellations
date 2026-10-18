import ConstellationData from '../../ConstellationsData.json' 
import * as THREE from 'three'

export function raDecToVector3(item, scale) {
  const defaultRadius = 10
  // linear distance
  const distance = (item.avg_distance ?? defaultRadius) * scale;
  // logariph distance
  //const distance = Math.log(item.avg_distance + 1) * scale;

  const raRad = item.right_ascension * (Math.PI / 12);
  const decRad = item.declination * (Math.PI / 180);

  const x = distance * Math.cos(decRad) * Math.cos(raRad);
  const y = distance * Math.sin(decRad);
  const z = -1 * distance * Math.cos(decRad) * Math.sin(raRad);

  return new THREE.Vector3(x, y, z);
}

export function raDecToVector3ForStars(item, scale) {
  const defaultRadius = 10
  // linear distance
  const distance = (item.distance_light_year ?? defaultRadius) * scale;
  // log distance
  //const distance = Math.log(item.avg_distance + 1) * scale;

  const raRad = item.right_ascension * (Math.PI / 12);
  const decRad = item.declination * (Math.PI / 180);

  const x = distance * Math.cos(decRad) * Math.cos(raRad);
  const y = distance * Math.sin(decRad);
  const z = -1 * distance * Math.cos(decRad) * Math.sin(raRad);

  return new THREE.Vector3(x, y, z);
}

