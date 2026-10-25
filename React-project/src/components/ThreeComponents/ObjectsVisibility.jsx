import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { objectGroup } from "three/tsl";
import { Vector3 } from "three/webgpu";

export function updateStarsVisibility(obj, allLabelsRef) {

  if (!obj || !obj.userData) return;

  const isTargeted = obj.userData.isTargeted;
  const objType = obj.userData.type 

  if (!isTargeted) {
    allLabelsRef.current.forEach((item) => {
      if(item.userData.state !== 'selected')
        item.userData.setState('default');
      if(objType === 'constellation') {
        if (item.parent === obj) //.parent && item !== obj)
            item.userData.setState('show-names');
      }
    })
    
  }
  else // isTargeted: true
  {
    if(objType === 'star') {
      allLabelsRef.current.forEach((item) => {
        if (item.parent === obj.parent && item !== obj)
          item.userData.setState('show-names');
        else if (item.parent !== obj.parent && item !== obj)
          item.userData.setState('pale')
      })
      //obj.parent.userData.setState('selected')
    }

    if(objType === 'constellation') {
      allLabelsRef.current.forEach((item) => {
        if (item.parent === obj) //.parent && item !== obj)
          item.userData.setState('show-names');
        else
          item.userData.setState('pale')
      })
      obj.userData.setState('targeted')
    }
  }
}

export function updateLinesVisibility(obj, cList) {

  if (obj.userData.type === 'constellation') {
    Object.values(cList).forEach((item) => {
      const linesGroup = item.children.find(child => child.userData?.type === 'linesGroup')
      if (linesGroup) {
        if (obj.userData.isTargeted) {
          (item === obj) ? linesGroup.visible = true : linesGroup.visible = false;
        } else {
          linesGroup.visible = true 
        }
      }
    })
  }

  if (obj.userData.type === 'star') {
    Object.values(cList).forEach((item) => {
      const linesGroup = item.children.find(child => child.userData?.type === 'linesGroup')
      if (linesGroup) {
        if (obj.userData.isTargeted) {
          (linesGroup.parent === obj.parent) ? linesGroup.visible = true : linesGroup.visible = false;
        } else {
          linesGroup.visible = true 
        }
      }
    })
  }
}

export function updateSunVisibility(camera, sun) {

  if(!camera) return;
  const zero = new Vector3(0, 0, 0)
  const pos = new Vector3()
  camera.getWorldPosition(pos)
  const distance = pos.distanceTo(zero)
  distance < 5 ? sun.visible = false : sun.visible = true;
}