import * as THREE from 'three';

export class CameraRig {
  constructor(camera, scene, options = {}) {
    this.camera = camera;
    this.scene = scene;
    
    this.config = {
      distance: options.distance || 5.0,
      height: options.height || 2.0,
      targetHeight: options.targetHeight || 1.5,
      minDistance: options.minDistance || 2.0,
      maxDistance: options.maxDistance || 10.0,
      smoothSpeed: options.smoothSpeed || 8.0,
      rotationSpeed: options.rotationSpeed || 3.0,
      mouseSensitivity: options.mouseSensitivity || 0.002,
      minPolarAngle: options.minPolarAngle || Math.PI * 0.1,
      maxPolarAngle: options.maxPolarAngle || Math.PI * 0.45,
      collisionRadius: options.collisionRadius || 0.3,
      zoomSpeed: options.zoomSpeed || 1.0,
      ...options
    };
    
    this.target = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();
    this.desiredPosition = new THREE.Vector3();
    
    this.azimuthAngle = 0;
    this.polarAngle = Math.PI * 0.25;
    
    this.mouseInput = new THREE.Vector2();
    this.rightStickInput = new THREE.Vector2();
    
    this.raycaster = new THREE.Raycaster();
    this.tempVectors = {
      targetToCamera: new THREE.Vector3(),
      collisionCheck: new THREE.Vector3()
    };
    
    this.isInitialized = false;
  }
  
  setTarget(position) {
    this.target.copy(position);
    this.target.y += this.config.targetHeight;
    
    if (!this.isInitialized) {
      this.currentPosition.copy(this.calculateDesiredPosition());
      this.camera.position.copy(this.currentPosition);
      this.isInitialized = true;
    }
  }
  
  setMouseInput(deltaX, deltaY) {
    this.mouseInput.set(deltaX, deltaY);
  }
  
  setRightStickInput(x, y) {
    this.rightStickInput.set(x, y);
  }
  
  zoom(delta) {
    this.config.distance = THREE.MathUtils.clamp(
      this.config.distance + delta * this.config.zoomSpeed,
      this.config.minDistance,
      this.config.maxDistance
    );
  }
  
  update(deltaTime) {
    deltaTime = Math.min(deltaTime, 0.1);
    
    this.updateRotation(deltaTime);
    this.calculateDesiredPosition();
    this.handleCollisionAvoidance();
    this.smoothFollow(deltaTime);
    
    this.camera.lookAt(this.target);
    
    this.mouseInput.set(0, 0);
  }
  
  updateRotation(deltaTime) {
    if (this.mouseInput.lengthSq() > 0) {
      this.azimuthAngle -= this.mouseInput.x * this.config.mouseSensitivity;
      this.polarAngle += this.mouseInput.y * this.config.mouseSensitivity;
    }
    
    if (this.rightStickInput.lengthSq() > 0.01) {
      this.azimuthAngle -= this.rightStickInput.x * this.config.rotationSpeed * deltaTime;
      this.polarAngle += this.rightStickInput.y * this.config.rotationSpeed * deltaTime;
    }
    
    this.azimuthAngle = this.azimuthAngle % (Math.PI * 2);
    if (this.azimuthAngle < 0) this.azimuthAngle += Math.PI * 2;
    
    this.polarAngle = THREE.MathUtils.clamp(
      this.polarAngle,
      this.config.minPolarAngle,
      this.config.maxPolarAngle
    );
  }
  
  calculateDesiredPosition() {
    const horizontalDistance = this.config.distance * Math.cos(this.polarAngle);
    const verticalDistance = this.config.distance * Math.sin(this.polarAngle);
    
    this.desiredPosition.set(
      this.target.x - horizontalDistance * Math.sin(this.azimuthAngle),
      this.target.y + verticalDistance,
      this.target.z - horizontalDistance * Math.cos(this.azimuthAngle)
    );
    
    return this.desiredPosition;
  }
  
  handleCollisionAvoidance() {
    const { targetToCamera } = this.tempVectors;
    targetToCamera.subVectors(this.desiredPosition, this.target);
    
    const distance = targetToCamera.length();
    const direction = targetToCamera.normalize();
    
    this.raycaster.set(this.target, direction);
    this.raycaster.far = distance;
    
    const colliders = this.getColliders();
    const intersects = this.raycaster.intersectObjects(colliders, true);
    
    if (intersects.length > 0) {
      const hit = intersects[0];
      const safeDistance = Math.max(hit.distance - this.config.collisionRadius, this.config.minDistance * 0.5);
      this.desiredPosition.copy(this.target).add(direction.multiplyScalar(safeDistance));
    }
  }
  
  smoothFollow(deltaTime) {
    const lerpFactor = 1 - Math.exp(-this.config.smoothSpeed * deltaTime);
    
    this.currentPosition.lerp(this.desiredPosition, lerpFactor);
    this.camera.position.copy(this.currentPosition);
  }
  
  getColliders() {
    const colliders = [];
    this.scene.traverse((obj) => {
      if (obj.isMesh && 
          !obj.userData.isPlayerCollider &&
          (obj.userData.isCollider || 
           obj.userData.blockCamera ||
           obj.name.includes('building') || 
           obj.name.includes('wall') ||
           obj.name.includes('collider'))) {
        colliders.push(obj);
      }
    });
    return colliders;
  }
  
  getAzimuthAngle() {
    return this.azimuthAngle;
  }
  
  getPolarAngle() {
    return this.polarAngle;
  }
  
  setAzimuthAngle(angle) {
    this.azimuthAngle = angle;
  }
  
  setPolarAngle(angle) {
    this.polarAngle = THREE.MathUtils.clamp(
      angle,
      this.config.minPolarAngle,
      this.config.maxPolarAngle
    );
  }
  
  getForwardDirection() {
    const forward = new THREE.Vector3();
    forward.set(
      -Math.sin(this.azimuthAngle),
      0,
      -Math.cos(this.azimuthAngle)
    );
    return forward;
  }
  
  getRightDirection() {
    const right = new THREE.Vector3();
    right.set(
      Math.cos(this.azimuthAngle),
      0,
      -Math.sin(this.azimuthAngle)
    );
    return right;
  }
  
  reset() {
    this.azimuthAngle = 0;
    this.polarAngle = Math.PI * 0.25;
    this.isInitialized = false;
  }
}
