import ConstellationData from '../../ConstellationsData.json' 
import * as THREE from 'three'

export function raDecToVector3(item, scale, isLogariph) {
  const defaultRadius = 10
  let distance
  
  if (isLogariph) {
    // logariph distance
    distance = (Math.log10(item.avg_distance) * 99 + 1) * scale;
  } else {
    // linear distance
    distance = (item.avg_distance ?? defaultRadius) * scale;
  }

  const raRad = item.right_ascension * (Math.PI / 12);
  const decRad = item.declination * (Math.PI / 180);

  const x = distance * Math.cos(decRad) * Math.cos(raRad);
  const y = distance * Math.sin(decRad);
  const z = -1 * distance * Math.cos(decRad) * Math.sin(raRad);

  return new THREE.Vector3(x, y, z);
}

export function raDecToVector3ForStars(item, scale, isLogariph) {
  const defaultRadius = 10
  let distance
  
  if (isLogariph) {
    // logariph distance
    distance = (Math.log10(item.distance_light_year) * 99 + 1) * scale;
  } else {
    // linear distance
    distance = (item.distance_light_year ?? defaultRadius) * scale;
  }

  const raRad = item.right_ascension * (Math.PI / 12);
  const decRad = item.declination * (Math.PI / 180);

  const x = distance * Math.cos(decRad) * Math.cos(raRad);
  const y = distance * Math.sin(decRad);
  const z = -1 * distance * Math.cos(decRad) * Math.sin(raRad);

  return new THREE.Vector3(x, y, z);
}

