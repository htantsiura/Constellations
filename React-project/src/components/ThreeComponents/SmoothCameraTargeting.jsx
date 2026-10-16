import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function smoothCameraMoving(targetAnimationRef, controlsRef, cameraRef) {
  if (targetAnimationRef.current && controlsRef.current && cameraRef.current) {
    targetAnimationRef.current.progress += 0.02; // Скорость полета (2% за кадр)
    
    if (targetAnimationRef.current.progress >= 1) {
      // 100% маршрута: ставим точную финальную цель
      const finalTarget = cameraRef.current.position.clone().add(
        targetAnimationRef.current.endDir.clone().multiplyScalar(targetAnimationRef.current.distance)
      );
      controlsRef.current.target.copy(finalTarget);
      targetAnimationRef.current = null; // Очищаем анимацию
      
    } else {
      // В процессе полета:
      const p = targetAnimationRef.current.progress;
      const easeOut = 1 - Math.pow(1 - p, 3); // Плавное торможение

      // Смешиваем направления и НОРМАЛИЗУЕМ (выталкиваем обратно на поверхность сферы)
      const currentDir = targetAnimationRef.current.startDir.clone()
        .lerp(targetAnimationRef.current.endDir, easeOut)
        .normalize(); 
      
      // Вычисляем текущую позицию target на орбите
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

    // Сохраняем вектор того, куда мы смотрим СЕЙЧАС
    const startDir = new THREE.Vector3()
      .subVectors(controlsRef.current.target, cameraRef.current.position)
      .normalize();

    // Сохраняем вектор того, куда ХОТИМ смотреть
    const endDir = new THREE.Vector3()
      .subVectors(worldPosition, cameraRef.current.position)
      .normalize();

    // Записываем маршрут
    targetAnimationRef.current = {
      startDir: startDir,
      endDir: endDir,
      distance: currentTargetDistance,
      progress: 0
    };
  }
}