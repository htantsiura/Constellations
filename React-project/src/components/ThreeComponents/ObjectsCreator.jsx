import { createElement } from 'react'
import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { Vector3 } from 'three/webgpu'

export function createConstellation(item, position, onClickCallBack, state = 'default') {
  const group = new THREE.Group()
  group.position.copy(position)

  const container = document.createElement('div')
  container.className = 'constellation-label-container'

  const constellName = document.createElement('div')
  constellName.className = 'constellation-label-text'
  constellName.textContent = item.name
  container.appendChild(constellName)

  const targetBtn = document.createElement('div')
  targetBtn.className = 'target-btn-container'

  const targetOffIcon = document.createElement('div')
  targetOffIcon.className = 'target-icon-off'
  targetBtn.appendChild(targetOffIcon)

  const targetOnIcon = document.createElement('div')
  targetOnIcon.className = 'target-icon-on'
  targetBtn.appendChild(targetOnIcon)

  container.appendChild(targetBtn)

  constellName.addEventListener('click', () => {
    if (onClickCallBack) {
      onClickCallBack(group);
    }
  });

  targetBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Блокируем клик, чтобы не сработало нажатие на само созвездие
    
    const isTargeted = group.userData.isTargeted || false;
    group.userData.isTargeted = !isTargeted;
    
    if (group.userData.isTargeted) {
      targetBtn.classList.add('targeted');
    } else {
      targetBtn.classList.remove('targeted');
    }

    if (onTargetToggle) {
      onTargetToggle(group.userData.pivot, group.userData.isTargeted);
    }
  });

  group.userData = {
    id: item.id,
    name: item.name,
    type: 'constellation',
    pivot: position,
    state: 'default', // default, active, pale
    isTargeted: false, // храним состояние фокуса
    setState: (newState) => {
      container.classList.remove('default', 'active', 'pale');
      group.userData.state = newState; // Исправлено с label на group
      container.classList.add(newState);
      
      if (newState === 'active') {
        constellName.classList.add('active');
      } else {
        constellName.classList.remove('active');
        
        // Если созвездие закрыли, автоматически сбрасываем таргет
        if (group.userData.isTargeted) {
          group.userData.isTargeted = false;
          targetBtn.classList.remove('targeted');
          if (onTargetToggle) onTargetToggle(position, false);
        }
      }
    }
  }

  const label = new CSS2DObject(container)
  label.center.set(0.5, 0.5)
  label.position.set(0, 0, 0)

  group.add(label)
  return group
}

export function createStar(item, localPos, worldPos, onClickCallBack, state = 'default') {

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
    pivot: worldPos,
    state: 'default', // 'default', 'active', 'pale'
    setState: (newState) => {
      container.classList.remove('default', 'active', 'pale')
      label.userData.state = newState;
      container.classList.add(newState)
    }
  }

  label.center.set(0, 0.5)
  label.position.copy(localPos)
  container.addEventListener('click', () => {
    if (onClickCallBack) {
      onClickCallBack(label)
    }
  })

  return(label)
}