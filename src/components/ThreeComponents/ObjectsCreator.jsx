import { createElement } from 'react'
import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { Vector3 } from 'three/webgpu'
import LinesData from '../../DataSources/LinesData_SnT_upd.json'


export function createConstellation(item, worldPos, onClickCallBack) {

  const group = new THREE.Group()
  group.position.copy(worldPos)

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

  container.appendChild(targetBtn)
  container.appendChild(constellName)

  const label = new CSS2DObject(container)
  label.center.set(0.5, 0.5)
  label.position.set(0, 0, 0)

  group.userData = {
    id: item.id,
    name: item.name,
    type: 'constellation',
    constellation: item.constellation,
    pivot: worldPos,
    isTargeted: false,
    state: 'default', // 'default', 'show-names', 'selected', 'targeted', 'pale'
    setState: (newState) => {
      container.classList.remove('default', 'show-names', 'selected', 'targeted', 'pale')
      group.userData.state = newState;
      container.classList.add(newState)
      
      if (newState === 'targeted') {
        group.userData.isTargeted = true;
      } else {
        group.userData.isTargeted = false;
      }

      const linesGroup = group.getObjectByName('linesGroup')
      if(linesGroup) {
        linesGroup.children.forEach((l) => {
          l.userData.setState(newState)
        })
      }
    }
  }

  container.addEventListener('click', () => {
    if (onClickCallBack) {
      onClickCallBack(group);
    }
  });
  
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
  label.center.set(0, 0.5)
  label.position.copy(localPos)
  label.userData = {
    id: item.id,
    hip: item.hip,
    name: item.name,
    constellation: item.constellation,
    type: 'star',
    pivot: worldPos,
    localPos: localPos,
    isTargeted: false,
    state: 'default', // 'default', 'show-names', 'selected', 'targeted', 'pale'
    setState: (newState) => {
      container.classList.remove('default', 'show-names', 'selected', 'targeted', 'pale')
      label.userData.state = newState;
      container.classList.add(newState)
      
      if (newState === 'selected' || newState === 'targeted' || newState === 'show-names') {
        starName.textContent = item.name;
        if (newState === 'targeted') {
          label.userData.isTargeted = true;
        } else {
          label.userData.isTargeted = false;
        }
      } else {
        starName.textContent = (item.name === item.bayer + ' ' + item.constellation_abbr) ? "" : item.name
        label.userData.isTargeted = false;
      }
    }
  }

  container.addEventListener('click', () => {
    if (onClickCallBack) {
      onClickCallBack(label)
    }
  })
  return(label)
}

export function createLines(c, constellationList, lineMaterial, lineMaterialSelected, i) {
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
      constellation: c.common_name.native,
      state: 'default', // 'default', 'show-names', 'selected', 'targeted', 'pale'
      setState: (newState) => {
        newLine.userData.state = newState;
        if (newState === 'selected' || newState === 'targeted') {
          newLine.material = lineMaterialSelected
        } else {
          newLine.material = lineMaterial
        }
      }
    }
    linesGroup.add(newLine)
    i++;
  })
  
  return(linesGroup)
}

export function createSun() {
  let sunScale = 0.5;
  let sunRatio = 8
  let sunMove = (sunRatio / 2 + 1) * sunScale

  const sunMat = new THREE.MeshBasicMaterial({ color: 'orange' , wireframe: true })
  const pyramid = new THREE.ConeGeometry(1 * sunScale, sunRatio * sunScale, 4)
  const sunPyramid = new THREE.Mesh(pyramid, sunMat)

  const sun = new THREE.Group()
  for (let i = 0; i < 6; i++) {
    const newPyramid = sunPyramid.clone()
    sun.add(newPyramid)
  }
  sun.children[0].rotateX(Math.PI * 0)
  sun.children[1].rotateX(Math.PI * 1)
  sun.children[2].rotateZ(Math.PI * 0.5)
  sun.children[3].rotateZ(Math.PI * -0.5)
  sun.children[2].rotateX(Math.PI * 0.5)
  sun.children[3].rotateX(Math.PI * -0.5)
  sun.children[4].rotateZ(Math.PI * 0.5)
  sun.children[5].rotateZ(Math.PI * -0.5)

  sun.children[1].position.set(0, -sunMove, 0)
  sun.children[0].position.set(0, sunMove, 0)
  sun.children[2].position.set(0, 0, sunMove)
  sun.children[3].position.set(0, 0, -sunMove)
  sun.children[4].position.set(-sunMove, 0, 0)
  sun.children[5].position.set(sunMove, 0, 0)

  return sun;
}