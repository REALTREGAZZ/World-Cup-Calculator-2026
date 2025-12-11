import * as THREE from 'three';

export class CharacterController {
  constructor(scene, collisionWorld, options = {}) {
    this.scene = scene;
    this.collisionWorld = collisionWorld;
    
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.rotation = 0;
    
    this.config = {
      capsuleRadius: options.capsuleRadius || 0.35,
      capsuleHeight: options.capsuleHeight || 1.8,
      walkSpeed: options.walkSpeed || 3.5,
      runSpeed: options.runSpeed || 7.0,
      acceleration: options.acceleration || 20.0,
      deceleration: options.deceleration || 15.0,
      rotationSpeed: options.rotationSpeed || 8.0,
      jumpForce: options.jumpForce || 8.0,
      gravity: options.gravity || 25.0,
      maxSlopeAngle: options.maxSlopeAngle || 45,
      stepHeight: options.stepHeight || 0.3,
      groundCheckDistance: options.groundCheckDistance || 0.1,
      ...options
    };
    
    this.state = {
      isGrounded: false,
      isSprinting: false,
      isJumping: false,
      canJump: true,
      moveSpeed: 0,
      targetSpeed: 0,
      groundNormal: new THREE.Vector3(0, 1, 0)
    };
    
    this.capsule = this.createCapsuleCollider();
    this.inputVector = new THREE.Vector2();
    
    this.raycaster = new THREE.Raycaster();
    this.tempVectors = {
      moveDir: new THREE.Vector3(),
      slideDir: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      tangent: new THREE.Vector3(),
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      groundCheck: new THREE.Vector3()
    };
  }
  
  createCapsuleCollider() {
    const geometry = new THREE.CapsuleGeometry(
      this.config.capsuleRadius, 
      this.config.capsuleHeight - this.config.capsuleRadius * 2, 
      4, 
      8
    );
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      wireframe: true,
      visible: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.isPlayerCollider = true;
    this.scene.add(mesh);
    return mesh;
  }
  
  setPosition(x, y, z) {
    this.position.set(x, y, z);
    this.capsule.position.copy(this.position);
  }
  
  setInput(forward, right, sprint, jump) {
    this.inputVector.set(right, forward).normalize();
    this.state.isSprinting = sprint;
    
    if (jump && this.state.isGrounded && this.state.canJump) {
      this.velocity.y = this.config.jumpForce;
      this.state.isJumping = true;
      this.state.canJump = false;
      this.state.isGrounded = false;
    }
    
    if (!jump) {
      this.state.canJump = true;
    }
  }
  
  update(deltaTime, cameraRotation) {
    deltaTime = Math.min(deltaTime, 0.1);
    
    this.checkGround();
    this.applyGravity(deltaTime);
    this.updateMovement(deltaTime, cameraRotation);
    this.resolveCollisions();
    this.updatePosition(deltaTime);
    
    this.capsule.position.copy(this.position);
  }
  
  checkGround() {
    const { groundCheck, end } = this.tempVectors;
    groundCheck.copy(this.position);
    groundCheck.y -= this.config.capsuleHeight * 0.5 - this.config.capsuleRadius;
    
    end.copy(groundCheck);
    end.y -= this.config.groundCheckDistance;
    
    this.raycaster.set(groundCheck, new THREE.Vector3(0, -1, 0));
    this.raycaster.far = this.config.groundCheckDistance + 0.05;
    
    const colliders = this.getColliders();
    const intersects = this.raycaster.intersectObjects(colliders, true);
    
    if (intersects.length > 0) {
      const hit = intersects[0];
      this.state.isGrounded = true;
      this.state.groundNormal.copy(hit.face.normal);
      
      if (this.velocity.y <= 0) {
        this.state.isJumping = false;
        this.velocity.y = 0;
        
        if (hit.distance < this.config.groundCheckDistance * 0.5) {
          this.position.y += (this.config.groundCheckDistance * 0.5 - hit.distance);
        }
      }
    } else {
      this.state.isGrounded = false;
      this.state.groundNormal.set(0, 1, 0);
    }
  }
  
  applyGravity(deltaTime) {
    if (!this.state.isGrounded) {
      this.velocity.y -= this.config.gravity * deltaTime;
      this.velocity.y = Math.max(this.velocity.y, -50);
    }
  }
  
  updateMovement(deltaTime, cameraRotation) {
    const hasInput = this.inputVector.lengthSq() > 0.01;
    
    if (hasInput) {
      const targetRotation = Math.atan2(this.inputVector.x, this.inputVector.y) + cameraRotation;
      this.rotation = this.lerpAngle(this.rotation, targetRotation, this.config.rotationSpeed * deltaTime);
      
      this.state.targetSpeed = this.state.isSprinting ? this.config.runSpeed : this.config.walkSpeed;
    } else {
      this.state.targetSpeed = 0;
    }
    
    const accelRate = hasInput ? this.config.acceleration : this.config.deceleration;
    this.state.moveSpeed = THREE.MathUtils.lerp(
      this.state.moveSpeed, 
      this.state.targetSpeed, 
      accelRate * deltaTime
    );
  }
  
  resolveCollisions() {
    const colliders = this.getColliders();
    const capsuleBottom = this.position.y - (this.config.capsuleHeight * 0.5 - this.config.capsuleRadius);
    const capsuleTop = this.position.y + (this.config.capsuleHeight * 0.5 - this.config.capsuleRadius);
    
    const directions = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1)
    ];
    
    for (const dir of directions) {
      const start = this.position.clone();
      const end = start.clone().add(dir.clone().multiplyScalar(this.config.capsuleRadius + 0.1));
      
      this.raycaster.set(start, dir);
      this.raycaster.far = this.config.capsuleRadius + 0.1;
      
      const intersects = this.raycaster.intersectObjects(colliders, true);
      
      if (intersects.length > 0) {
        const hit = intersects[0];
        const penetration = this.config.capsuleRadius - hit.distance;
        
        if (penetration > 0) {
          const pushBack = hit.face.normal.clone().multiplyScalar(penetration + 0.01);
          this.position.add(pushBack);
          
          const slopeAngle = Math.acos(hit.face.normal.y) * (180 / Math.PI);
          if (slopeAngle > this.config.maxSlopeAngle) {
            const tangent = new THREE.Vector3();
            tangent.crossVectors(hit.face.normal, new THREE.Vector3(0, 1, 0)).normalize();
            tangent.crossVectors(tangent, hit.face.normal).normalize();
            
            const velocityDir = new THREE.Vector3(
              Math.sin(this.rotation),
              0,
              Math.cos(this.rotation)
            );
            const slideAmount = velocityDir.dot(tangent);
            this.position.add(tangent.multiplyScalar(slideAmount * 0.1));
          }
        }
      }
    }
  }
  
  updatePosition(deltaTime) {
    const { moveDir } = this.tempVectors;
    
    moveDir.set(
      Math.sin(this.rotation),
      0,
      Math.cos(this.rotation)
    ).multiplyScalar(this.state.moveSpeed * deltaTime);
    
    if (this.state.isGrounded && this.state.groundNormal.y < 0.999) {
      const slopeAngle = Math.acos(this.state.groundNormal.y) * (180 / Math.PI);
      
      if (slopeAngle <= this.config.maxSlopeAngle) {
        const tangent = new THREE.Vector3();
        tangent.crossVectors(this.state.groundNormal, new THREE.Vector3(0, 0, 1)).normalize();
        tangent.crossVectors(this.state.groundNormal, tangent).normalize();
        
        const forward = new THREE.Vector3(Math.sin(this.rotation), 0, Math.cos(this.rotation));
        const alignment = forward.dot(tangent);
        moveDir.copy(tangent).multiplyScalar(alignment * this.state.moveSpeed * deltaTime);
      }
    }
    
    this.position.add(moveDir);
    this.position.y += this.velocity.y * deltaTime;
  }
  
  getColliders() {
    if (this.collisionWorld && typeof this.collisionWorld.getColliders === 'function') {
      return this.collisionWorld.getColliders();
    }
    
    const colliders = [];
    this.scene.traverse((obj) => {
      if (obj.isMesh && 
          !obj.userData.isPlayerCollider && 
          (obj.userData.isCollider || obj.name.includes('collider') || obj.name.includes('building') || obj.name.includes('ground'))) {
        colliders.push(obj);
      }
    });
    return colliders;
  }
  
  lerpAngle(a, b, t) {
    let delta = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (delta < -Math.PI) delta += Math.PI * 2;
    return a + delta * t;
  }
  
  getPosition() {
    return this.position.clone();
  }
  
  getRotation() {
    return this.rotation;
  }
  
  isMoving() {
    return this.state.moveSpeed > 0.1;
  }
  
  isGrounded() {
    return this.state.isGrounded;
  }
  
  isSprinting() {
    return this.state.isSprinting && this.isMoving();
  }
  
  isJumping() {
    return this.state.isJumping;
  }
  
  getVelocity() {
    return this.velocity.clone();
  }
  
  getMoveSpeed() {
    return this.state.moveSpeed;
  }
  
  setDebugVisible(visible) {
    this.capsule.material.visible = visible;
  }
  
  dispose() {
    if (this.capsule) {
      this.scene.remove(this.capsule);
      this.capsule.geometry.dispose();
      this.capsule.material.dispose();
    }
  }
}
