import { createElement } from 'react'
import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { Vector3 } from 'three/webgpu'

export function createConstellation(item, position) {
  const group = new THREE.Group()
  group.position.copy(position)
  group.useData = {
    id: item.id,
    name: item.name,
    type: 'constellation',
    pivot: position,
    state: 'default' // default, active, pale
  }
  
  const constellLabel = document.createElement('div')
  constellLabel.className = 'constellation-label-container'
  constellLabel.textContent = item.name

  const label = new CSS2DObject(constellLabel)
  label.center.set(0.5, 0.5)
  label.position.set(0, 0, 0)

  group.add(label)
  return group
}