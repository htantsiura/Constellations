import { createElement } from 'react'
import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { Vector3 } from 'three/webgpu'
import LinesData from '../../DataSources/LinesData_SnT_upd.json'

export function createConstellation(item, 
                                    position, 
                                    onClickCallBack, 
                                    onTargetToggle) {
  const group = new THREE.Group()
  group.position.copy(position)

  const container = document.createElement('div')
  container.className = 'constellation-label-container'

  const targetBtn = document.createElement('div')
  targetBtn.className = 'constellation-btn-container'

  const targetOffIcon = document.createElement('div')
  targetOffIcon.className = 'icon-off'
  targetBtn.appendChild(targetOffIcon)

  const targetOnIcon = document.createElement('div')
  targetOnIcon.className = 'icon-on'
  targetBtn.appendChild(targetOnIcon)

  const constellName = document.createElement('div')
  constellName.className = 'constellation-label-text'
  constellName.textContent = item.name
  
  constellName.addEventListener('click', () => {
    if (onClickCallBack) {
      onClickCallBack(group);
    }
  });

  targetBtn.addEventListener('click', (e) => {
    e.stopPropagation() 

    const isTargeted = group.userData.isTargeted || false
    group.userData.isTargeted = !isTargeted
    
    if (group.userData.isTargeted) {
      targetBtn.classList.add('targeted');
    } else {
      targetBtn.classList.remove('targeted');
    }
    if (onTargetToggle) {
      onTargetToggle(group.userData.pivot, group.userData.isTargeted, false) 
    }
  })

  container.appendChild(targetBtn)
  container.appendChild(constellName)

  group.userData = {
    id: item.id,
    name: item.name,
    type: 'constellation',
    pivot: position,
    state: 'default',
    isTargeted: false,
    setState: (newState) => {
      container.classList.remove('default', 'active', 'pale');
      container.classList.add(newState);
      group.userData.state = newState;
      if (newState === 'active') {
        constellName.classList.add('active');
      } else {
        constellName.classList.remove('active');
        if (group.userData.isTargeted) {
            group.userData.isTargeted = false;
            targetBtn.classList.remove('targeted'); 
            if (onTargetToggle) onTargetToggle(position, false, true);
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

export function createStar(item, localPos, worldPos, onClickCallBack) {

  const container = document.createElement('div')
  container.className = 'star-label-container'

  const targetBtn = document.createElement('div')
  targetBtn.className = 'star-btn-container'

  const iconOff = document.createElement('div')
  iconOff.className = 'icon-off'
  targetBtn.appendChild(iconOff)

  const iconOn = document.createElement('div')
  iconOn.className = 'icon-on'
  targetBtn.appendChild(iconOn)

  const starName = document.createElement('div')
  starName.className = 'star-label-text'
  starName.textContent = (item.name === item.bayer + ' ' + item.constellation_abbr) ? "" : item.name
  
  container.appendChild(targetBtn)
  container.appendChild(starName)

  const label = new CSS2DObject(container)
  label.userData = {
    id: item.id,
    hip: item.hip,
    name: item.name,
    constellation: item.constellation,
    type: 'star',
    pivot: worldPos,
    localPos: localPos,
    state: 'default', // 'default', 'show-names', 'selected', 'targeted', 'pale'
    setState: (newState) => {
      container.classList.remove('default', 'show-names', 'selected', 'targeted', 'pale')
      label.userData.state = newState;
      container.classList.add(newState)
      
      if (newState === 'selected' || newState === 'targeted' || newState === 'show-names')
        starName.textContent = item.name;
      else
        starName.textContent = (item.name === item.bayer + ' ' + item.constellation_abbr) ? "" : item.name
     }
  }

  label.center.set(0, 0.5)
  label.position.copy(localPos)
 
  container.addEventListener('click', () => {
    if (label.userData.state === ('selected' || 'targeted' )) {
      if (onClickCallBack) {
        onClickCallBack(label)
      }
    } else {
        if (onClickCallBack) {
        onClickCallBack(label)
      }
    }
  })

  return(label)
}

export function createLines(c, constellationList, lineMaterial, i) {
  let linesGroup = new THREE.Group()
  c.lines.map((line) => {
    const points = []
    line.map((e) => {
      const neededStar = constellationList[c.common_name.native].children.find(child => child.userData?.hip === e)
      neededStar ? points.push(neededStar.userData.localPos) : null
    })
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const newLine = new THREE.Line(lineGeometry, lineMaterial)
    newLine.userData = {
      index: i,
      hips: line,
      type: 'line',
      constellation: c.common_name.native
    }
    linesGroup.add(newLine)
    i++;
  })
  return(linesGroup)
}



/* export function createLines((item) => {
  item.lines.forEach((line) => {
    line.forEach((element) => {

    })

  })
  
}) */

/* {
      "common_name": {"english": "Andromeda"},
      "iau": "And",
      "id": "CON western_SnT And",
      "lines": [[677, 3092, 5447, 9640], [113726, 116631, 116805, 116584], [116631, 1473, 2912, 3092], [2912, 5447, 4436, 3881, 5434, 7607], ["thin", 3092, 3031, 3693, 4463]]
    }, */