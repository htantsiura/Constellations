import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { objectGroup } from "three/tsl";

// 1. Animating target. Controls only that, where we look: controls.target)

export function startTargetAnimation(controlsRef, newTargetPos, targetAnimRef, onComplete = null) {
  if (!controlsRef.current) return;

  targetAnimRef.current = {
    start: controlsRef.current.target.clone(),
    end: newTargetPos.clone(),
    progress: 0,
    onComplete: onComplete
  };
}

export function updateTargetAnimation(targetAnimRef, controlsRef) {
  if (targetAnimRef.current && controlsRef.current) {
    targetAnimRef.current.progress += 0.02; 
    
    if (targetAnimRef.current.progress >= 1) {
      controlsRef.current.target.copy(targetAnimRef.current.end);
      
      if (typeof targetAnimRef.current.onComplete === 'function') {
        targetAnimRef.current.onComplete();
      }
      
      targetAnimRef.current = null;
    } else {
      const p = targetAnimRef.current.progress;
      const easeOut = 1 - Math.pow(1 - p, 3);
      
      const currentTarget = targetAnimRef.current.start.clone()
        .lerp(targetAnimRef.current.end, easeOut);
        
      controlsRef.current.target.copy(currentTarget);
    }
    controlsRef.current.update();
  }
}

// 2. Animating camera: camera.position

export function startCameraAnimation(cameraRef, newCameraPos, cameraAnimRef, onComplete = null) {
  if (!cameraRef.current) return;

  cameraAnimRef.current = {
    start: cameraRef.current.position.clone(),
    end: newCameraPos.clone(),
    progress: 0,
    onComplete: onComplete
  };
}

export function updateCameraAnimation(cameraAnimRef, cameraRef, controlsRef) {
  if (cameraAnimRef.current && cameraRef.current && controlsRef.current) {
    cameraAnimRef.current.progress += 0.02; // speed
    
    if (cameraAnimRef.current.progress >= 1) {
      cameraRef.current.position.copy(cameraAnimRef.current.end);
      
      if (typeof cameraAnimRef.current.onComplete === 'function') {
         cameraAnimRef.current.onComplete();
      }
      
      cameraAnimRef.current = null;
    } else {
      const p = cameraAnimRef.current.progress;
      const easeOut = 1 - Math.pow(1 - p, 3);
      
      const currentPos = cameraAnimRef.current.start.clone()
        .lerp(cameraAnimRef.current.end, easeOut);
        
      cameraRef.current.position.copy(currentPos);
    }
    controlsRef.current.update(); 
  }
}

// 3. Unility

export function calculateRotatedTarget(cameraRef, currentTarget, newObjectPos) {
  if (!cameraRef.current) return newObjectPos;
  
  const currentDistance = cameraRef.current.position.distanceTo(currentTarget);
  const directionToNewObject = new THREE.Vector3()
    .subVectors(newObjectPos, cameraRef.current.position)
    .normalize();
    
  return cameraRef.current.position.clone()
    .add(directionToNewObject.multiplyScalar(currentDistance));
}

export function updateStarsVisibility(obj, allLabelsRef) {

  if (!obj || !obj.userData) return;

  const isTargeted = obj.userData.isTargeted;
  const objType = obj.userData.type 

  console.log('isTargeted', isTargeted)

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