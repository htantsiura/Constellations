import gsap from "gsap";

export function changeCameraTarget(pivot, controlsRef) {
  if (!controlsRef.current) return;

  

  gsap.to(controlsRef.current.target, {
    x: pivot.x,
    y: pivot.y,
    z: pivot.z,
    duration: 1.0, 
    ease: "power2.inOut",
    onUpdate: () => {
      controlsRef.current.update();
    }
  });

  


  //controlsRef.current.update();
  /* controlsRef.current.target.copy(pivot)
  controlsRef.current.update() */
}

export function changeCameraSelectFromZero(pivot, cameraRef, controlsRef) {
  if(!controlsRef.current || !cameraRef.current) return;

  //controlsRef.current.target.set(0, 0, 0);
  /*const direction = pivot.clone().normalize();
  const CAMERA_DISTANCE = -1;
  const newCameraPos = direction.multiplyScalar(CAMERA_DISTANCE);
  cameraRef.current.position.copy(newCameraPos); */

  const direction = pivot.clone().normalize();
  const CAMERA_DISTANCE = -20;
  const newCameraPos = direction.multiplyScalar(CAMERA_DISTANCE);
  //cameraRef.current.position.copy(newCameraPos);

  gsap.to(cameraRef.current.position, {
    x: newCameraPos.x,
    y: newCameraPos.y,
    z: newCameraPos.z,
    duration: 1.0, 
    ease: "power2.inOut",
    onUpdate: () => {
      controlsRef.current.update();
    }
  });

  gsap.to(controlsRef.current.target, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1.0, 
    ease: "power2.inOut"
  });

  //controlsRef.current.update();
}

export function cameraZoom(camera, value) {
  gsap.to( camera, {
    fov: value,
    duration: 0.5, 
    ease: "power2.Out",
    repeat: 0,
    yoyo: false,
    onUpdate: () => {
      camera.updateProjectionMatrix()
    }
  })
}

