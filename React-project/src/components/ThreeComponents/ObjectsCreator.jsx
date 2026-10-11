import { createElement } from 'react'
import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { Vector3 } from 'three/webgpu'

export function createConstellation(item, position, state = 'default') {
  const group = new THREE.Group()
  group.position.copy(position)
  group.userData = {
    id: item.id,
    name: item.name,
    type: 'constellation',
    pivot: position,
    state: 'default', // default, active, pale
    setState: (state) => {
      label.userData.state = state;
      container.classList.toggle(state, state)
    }
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

export function createStar(item, position, onClickCallBack, state = 'default') {

  const container = document.createElement('div')
  container.className = 'star-label-container'

  const defIcon = document.createElement('div')
  defIcon.className = 'star-icon-default'
  container.appendChild(defIcon)

  const activeIcon = document.createElement('div')
  activeIcon.className = 'star-icon-active'
  container.appendChild(activeIcon)

  const starName = document.createElement('div')
  starName.className = 'star-label-text'
  starName.textContent = item.name
  container.appendChild(starName)

  const label = new CSS2DObject(container)
  label.userData = {
    id: item.id,
    name: item.name,
    constellation: item.constellation,
    type: 'star',
    pivot: position,
    state: 'default', // 'default', 'active', 'pale'
    setState: (newState) => {
      container.classList.remove('default', 'active', 'pale')
      label.userData.state = newState;
      container.classList.add(newState)
    }
  }
  label.center.set(0, 0.5)
  label.position.copy(position)
  container.addEventListener('click', () => {
    if (onClickCallBack) {
      onClickCallBack(label)
    }
  })

  return(label)
}