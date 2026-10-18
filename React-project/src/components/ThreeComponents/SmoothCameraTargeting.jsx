import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// to stars

export function smoothCameraMoving(targetAnimationRef, controlsRef, cameraRef) {
  if (targetAnimationRef.current && controlsRef.current && cameraRef.current) {
    targetAnimationRef.current.progress += 0.02; 
    
    if (targetAnimationRef.current.progress >= 1) {
      const finalTarget = cameraRef.current.position.clone().add(
        targetAnimationRef.current.endDir.clone().multiplyScalar(targetAnimationRef.current.endDistance)
      );
      controlsRef.current.target.copy(finalTarget);

      // === ДОБАВЛЯЕМ БЛОК ОТЛАДКИ ===
      const camPos = cameraRef.current.position;
      const tarPos = controlsRef.current.target;
      const distance = camPos.distanceTo(tarPos);
      const distToCenter = camPos.distanceTo(new THREE.Vector3(0,0,0));
      
      console.log('--- АНИМАЦИЯ ЗАВЕРШЕНА ---');
      console.log(`📍 Камера (X: ${camPos.x.toFixed(2)}, Y: ${camPos.y.toFixed(2)}, Z: ${camPos.z.toFixed(2)})`);
      console.log(`🎯 Таргет (X: ${tarPos.x.toFixed(2)}, Y: ${tarPos.y.toFixed(2)}, Z: ${tarPos.z.toFixed(2)})`);
      console.log(`📏 Расстояние Камера -> Таргет: ${distance.toFixed(2)}`);
      console.log(`🌐 Расстояние Камера -> Центр(0,0,0): ${distToCenter.toFixed(2)}`);
      // ===================================



      targetAnimationRef.current = null; 
      
    } else {
      const p = targetAnimationRef.current.progress;
      const easeOut = 1 - Math.pow(1 - p, 3); 

      const currentDir = targetAnimationRef.current.startDir.clone()
        .lerp(targetAnimationRef.current.endDir, easeOut)
        .normalize(); 
      
      const currentDistance = THREE.MathUtils.lerp(
        targetAnimationRef.current.startDistance,
        targetAnimationRef.current.endDistance,
        easeOut
      );
      
      const currentTarget = cameraRef.current.position.clone().add(
        currentDir.multiplyScalar(currentDistance)
      );
      
      controlsRef.current.target.copy(currentTarget);
    }
    
    controlsRef.current.update();
  }
}

export function smoothCameraNavigator(controlsRef, cameraRef, targetObject, targetAnimationRef, forceDistance = null) {
  if (controlsRef.current && cameraRef.current) {
    const worldPosition = new THREE.Vector3();
    
    if (targetObject.getWorldPosition) {
        targetObject.getWorldPosition(worldPosition);
    } else {
        worldPosition.copy(targetObject);
    }

    const currentTargetDistance = cameraRef.current.position.distanceTo(controlsRef.current.target);

    const startDir = new THREE.Vector3()
      .subVectors(controlsRef.current.target, cameraRef.current.position)
      .normalize();

    const endDir = new THREE.Vector3()
      .subVectors(worldPosition, cameraRef.current.position)
      .normalize();

    const endDistance = forceDistance !== null ? forceDistance : currentTargetDistance;

    targetAnimationRef.current = {
      startDir: startDir,
      endDir: endDir,
      startDistance: currentTargetDistance,
      endDistance: endDistance, 
      progress: 0
    };
  }
}

/* export function smoothCameraMoving(targetAnimationRef, controlsRef, cameraRef) {
  if (targetAnimationRef.current && controlsRef.current && cameraRef.current) {
    targetAnimationRef.current.progress += 0.01; // speed (2% per frame)
    
    if (targetAnimationRef.current.progress >= 1) {
      const finalTarget = cameraRef.current.position.clone().add(
        targetAnimationRef.current.endDir.clone().multiplyScalar(targetAnimationRef.current.distance)
      );
      controlsRef.current.target.copy(finalTarget);
      targetAnimationRef.current = null;
    } else {
      const p = targetAnimationRef.current.progress;
      const easeOut = 1 - Math.pow(1 - p, 3); 

      const currentDir = targetAnimationRef.current.startDir.clone()
        .lerp(targetAnimationRef.current.endDir, easeOut)
        .normalize(); 
      
      const currentTarget = cameraRef.current.position.clone().add(
        currentDir.multiplyScalar(targetAnimationRef.current.distance)
      );
      controlsRef.current.target.copy(currentTarget);
    }
    controlsRef.current.update();
  }
}

export function smoothCameraNavigator(controlsRef, cameraRef, targetLabel, targetAnimationRef) {
  if (controlsRef.current && cameraRef.current) {
    const worldPosition = new THREE.Vector3();
    targetLabel.getWorldPosition(worldPosition);

    const currentTargetDistance = cameraRef.current.position.distanceTo(controlsRef.current.target);

    const startDir = new THREE.Vector3()
      .subVectors(controlsRef.current.target, cameraRef.current.position)
      .normalize();

    const endDir = new THREE.Vector3()
      .subVectors(worldPosition, cameraRef.current.position)
      .normalize();

    targetAnimationRef.current = {
      startDir: startDir,
      endDir: endDir,
      distance: currentTargetDistance,
      progress: 0
    };
  }
} */

/* 

//navigator to constellations
export function smoothTeleportNavigator(controlsRef, cameraRef, pivotPos, isTargeted, teleportAnimationRef) {
  if (!controlsRef.current || !cameraRef.current) return;

  const startTarget = controlsRef.current.target.clone();
  const startCameraPos = cameraRef.current.position.clone();

  const endTarget = new THREE.Vector3();
  const endCameraPos = new THREE.Vector3();

  if (isTargeted) {
    endTarget.copy(pivotPos);
    const currentDist = startCameraPos.distanceTo(startTarget); // keeping zoom
    const distanceToConstellation = pivotPos.length();
    endCameraPos.copy(pivotPos).normalize().multiplyScalar(distanceToConstellation + Math.max(currentDist, 200));
  } else {
    endTarget.set(0, 0, 0);
    endCameraPos.set(0, 0, 0.1); 
  }

  teleportAnimationRef.current = {
    startTarget,
    endTarget,
    startCameraPos,
    endCameraPos,
    progress: 0
  };
}

// pilot to constellation
export function smoothTeleportMoving(teleportAnimationRef, controlsRef, cameraRef) {
  if (teleportAnimationRef.current && controlsRef.current && cameraRef.current) {
    teleportAnimationRef.current.progress += 0.01; //speed
    
    if (teleportAnimationRef.current.progress >= 1) {
      controlsRef.current.target.copy(teleportAnimationRef.current.endTarget);
      cameraRef.current.position.copy(teleportAnimationRef.current.endCameraPos);
      teleportAnimationRef.current = null;
    } else {
      const p = teleportAnimationRef.current.progress;
      const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      controlsRef.current.target.copy(teleportAnimationRef.current.startTarget).lerp(teleportAnimationRef.current.endTarget, ease);
      cameraRef.current.position.copy(teleportAnimationRef.current.startCameraPos).lerp(teleportAnimationRef.current.endCameraPos, ease);
    }
    controlsRef.current.update();
  }
} */