import gsap from "gsap";

const CAMERA_DISTANCE = -0.1

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
}

export function changeCameraSelectFromZero(pivot, cameraRef, controlsRef) {
  
  if(!controlsRef.current || !cameraRef.current) return;

  const direction = pivot.clone().normalize();
  const newCameraPos = direction.multiplyScalar(CAMERA_DISTANCE);

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
