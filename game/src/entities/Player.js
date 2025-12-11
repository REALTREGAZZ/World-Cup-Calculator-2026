import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CharacterController } from './CharacterController.js';
import { CameraRig } from './CameraRig.js';

export class Player {
  constructor(scene, camera, collisionWorld, inputMapper, options = {}) {
    this.scene = scene;
    this.camera = camera;
    this.collisionWorld = collisionWorld;
    this.inputMapper = inputMapper;
    
    this.config = {
      modelPath: options.modelPath || '/game/assets/models/character.glb',
      scale: options.scale || 1.0,
      ...options
    };
    
    this.model = null;
    this.mixer = null;
    this.animations = {
      idle: null,
      walk: null,
      run: null,
      jump: null
    };
    this.currentAction = null;
    this.isLoaded = false;
    
    this.controller = new CharacterController(scene, collisionWorld, options.controller);
    this.cameraRig = new CameraRig(camera, scene, options.camera);
    
    this.debugUI = null;
    if (options.debug) {
      this.setupDebugUI();
    }
    
    this.loadModel();
  }
  
  loadModel() {
    const loader = new GLTFLoader();
    
    loader.load(
      this.config.modelPath,
      (gltf) => this.onModelLoaded(gltf),
      (progress) => this.onLoadProgress(progress),
      (error) => this.onLoadError(error)
    );
  }
  
  onModelLoaded(gltf) {
    this.model = gltf.scene;
    this.model.scale.setScalar(this.config.scale);
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData.isPlayer = true;
      }
    });
    
    this.scene.add(this.model);
    
    if (gltf.animations && gltf.animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.model);
      this.setupAnimations(gltf.animations);
    } else {
      this.createFallbackAnimations();
    }
    
    this.isLoaded = true;
    console.log('Player model loaded successfully');
  }
  
  setupAnimations(animations) {
    const animMap = {
      idle: ['Idle', 'idle', 'IDLE', 'Armature|Idle'],
      walk: ['Walk', 'walk', 'WALK', 'Walking', 'Armature|Walk'],
      run: ['Run', 'run', 'RUN', 'Running', 'Armature|Run'],
      jump: ['Jump', 'jump', 'JUMP', 'Jumping', 'Armature|Jump']
    };
    
    for (const [key, possibleNames] of Object.entries(animMap)) {
      const anim = animations.find(a => possibleNames.includes(a.name));
      if (anim) {
        this.animations[key] = this.mixer.clipAction(anim);
      }
    }
    
    if (this.animations.walk && !this.animations.run) {
      this.animations.run = this.animations.walk;
    }
    
    if (this.animations.idle) {
      this.currentAction = this.animations.idle;
      this.currentAction.play();
    }
  }
  
  createFallbackAnimations() {
    console.warn('No animations found in model, creating fallback mixer');
    this.mixer = new THREE.AnimationMixer(this.model);
  }
  
  onLoadProgress(progress) {
    const percent = (progress.loaded / progress.total) * 100;
    console.log(`Loading player model: ${percent.toFixed(0)}%`);
  }
  
  onLoadError(error) {
    console.error('Error loading player model:', error);
    this.createFallbackModel();
  }
  
  createFallbackModel() {
    const geometry = new THREE.CapsuleGeometry(0.35, 1.1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x4080ff });
    this.model = new THREE.Mesh(geometry, material);
    this.model.castShadow = true;
    this.model.receiveShadow = true;
    this.scene.add(this.model);
    this.isLoaded = true;
    console.log('Using fallback player model');
  }
  
  update(deltaTime) {
    if (!this.isLoaded) return;
    
    this.processInput(deltaTime);
    this.controller.update(deltaTime, this.cameraRig.getAzimuthAngle());
    this.updateModelTransform();
    this.updateAnimations(deltaTime);
    this.cameraRig.setTarget(this.controller.getPosition());
    this.cameraRig.update(deltaTime);
  }
  
  processInput(deltaTime) {
    let forward = 0;
    let right = 0;
    let sprint = false;
    let jump = false;
    
    if (this.inputMapper) {
      forward = this.inputMapper.getAxis('MoveForward') || 0;
      right = this.inputMapper.getAxis('MoveRight') || 0;
      sprint = this.inputMapper.getButton('Sprint') || false;
      jump = this.inputMapper.getButton('Jump') || false;
      
      const lookX = this.inputMapper.getAxis('LookX') || 0;
      const lookY = this.inputMapper.getAxis('LookY') || 0;
      
      if (Math.abs(lookX) > 0.01 || Math.abs(lookY) > 0.01) {
        this.cameraRig.setRightStickInput(lookX, lookY);
      }
      
      const mouseX = this.inputMapper.getMouseDelta?.()?.x || 0;
      const mouseY = this.inputMapper.getMouseDelta?.()?.y || 0;
      
      if (Math.abs(mouseX) > 0 || Math.abs(mouseY) > 0) {
        this.cameraRig.setMouseInput(mouseX, mouseY);
      }
      
      const zoom = this.inputMapper.getAxis('Zoom') || 0;
      if (Math.abs(zoom) > 0.01) {
        this.cameraRig.zoom(zoom * deltaTime * 5);
      }
    }
    
    this.controller.setInput(forward, right, sprint, jump);
  }
  
  updateModelTransform() {
    if (!this.model) return;
    
    const position = this.controller.getPosition();
    const rotation = this.controller.getRotation();
    
    this.model.position.copy(position);
    this.model.position.y -= this.controller.config.capsuleHeight * 0.5;
    this.model.rotation.y = rotation;
  }
  
  updateAnimations(deltaTime) {
    if (!this.mixer) return;
    
    this.mixer.update(deltaTime);
    
    const isMoving = this.controller.isMoving();
    const isGrounded = this.controller.isGrounded();
    const isSprinting = this.controller.isSprinting();
    const isJumping = this.controller.isJumping();
    
    let targetAction = null;
    
    if (!isGrounded && this.animations.jump) {
      targetAction = this.animations.jump;
    } else if (isMoving && isSprinting && this.animations.run) {
      targetAction = this.animations.run;
    } else if (isMoving && this.animations.walk) {
      targetAction = this.animations.walk;
    } else if (this.animations.idle) {
      targetAction = this.animations.idle;
    }
    
    if (targetAction && targetAction !== this.currentAction) {
      this.transitionToAction(targetAction, 0.2);
    }
    
    if (this.currentAction && (this.currentAction === this.animations.walk || this.currentAction === this.animations.run)) {
      const moveSpeed = this.controller.getMoveSpeed();
      const maxSpeed = isSprinting ? this.controller.config.runSpeed : this.controller.config.walkSpeed;
      const speedRatio = moveSpeed / maxSpeed;
      this.currentAction.timeScale = Math.max(0.5, speedRatio * 1.2);
    }
  }
  
  transitionToAction(toAction, duration = 0.2) {
    if (this.currentAction) {
      this.currentAction.fadeOut(duration);
    }
    
    toAction.reset();
    toAction.fadeIn(duration);
    toAction.play();
    
    this.currentAction = toAction;
  }
  
  setPosition(x, y, z) {
    this.controller.setPosition(x, y, z);
    if (this.model) {
      this.updateModelTransform();
    }
  }
  
  getPosition() {
    return this.controller.getPosition();
  }
  
  getRotation() {
    return this.controller.getRotation();
  }
  
  setupDebugUI() {
    try {
      if (typeof dat !== 'undefined' && dat.GUI) {
        this.debugUI = new dat.GUI({ name: 'Player Debug' });
        this.createDatGUIControls();
      } else {
        this.createCustomDebugPanel();
      }
    } catch (e) {
      console.warn('Debug UI not available:', e);
      this.createCustomDebugPanel();
    }
  }
  
  createDatGUIControls() {
    const controllerFolder = this.debugUI.addFolder('Controller');
    controllerFolder.add(this.controller.config, 'walkSpeed', 1, 10).name('Walk Speed');
    controllerFolder.add(this.controller.config, 'runSpeed', 3, 15).name('Run Speed');
    controllerFolder.add(this.controller.config, 'acceleration', 5, 50).name('Acceleration');
    controllerFolder.add(this.controller.config, 'jumpForce', 3, 15).name('Jump Force');
    controllerFolder.add(this.controller.config, 'gravity', 10, 50).name('Gravity');
    controllerFolder.add(this.controller.config, 'maxSlopeAngle', 0, 89).name('Max Slope Angle');
    controllerFolder.add({ showCollider: false }, 'showCollider')
      .name('Show Collider')
      .onChange((value) => this.controller.setDebugVisible(value));
    controllerFolder.open();
    
    const cameraFolder = this.debugUI.addFolder('Camera');
    cameraFolder.add(this.cameraRig.config, 'distance', 2, 15).name('Distance');
    cameraFolder.add(this.cameraRig.config, 'height', 0, 5).name('Height');
    cameraFolder.add(this.cameraRig.config, 'targetHeight', 0, 3).name('Target Height');
    cameraFolder.add(this.cameraRig.config, 'smoothSpeed', 1, 20).name('Smooth Speed');
    cameraFolder.add(this.cameraRig.config, 'mouseSensitivity', 0.0001, 0.01).name('Mouse Sensitivity');
    cameraFolder.open();
    
    const infoFolder = this.debugUI.addFolder('Info');
    const info = {
      isGrounded: false,
      moveSpeed: 0,
      isSprinting: false,
      animation: 'none'
    };
    
    const groundedController = infoFolder.add(info, 'isGrounded').name('Is Grounded').listen();
    const speedController = infoFolder.add(info, 'moveSpeed', 0, 10).name('Move Speed').listen();
    const sprintController = infoFolder.add(info, 'isSprinting').name('Is Sprinting').listen();
    const animController = infoFolder.add(info, 'animation').name('Animation').listen();
    
    this.debugUpdateCallbacks = () => {
      info.isGrounded = this.controller.isGrounded();
      info.moveSpeed = this.controller.getMoveSpeed();
      info.isSprinting = this.controller.isSprinting();
      info.animation = this.currentAction?.getClip()?.name || 'none';
    };
    
    infoFolder.open();
  }
  
  createCustomDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'player-debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 15px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      min-width: 250px;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    panel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">Player Debug</div>
      <div style="margin-bottom: 15px;">
        <div style="font-weight: bold; margin-bottom: 5px;">Controller</div>
        <label>Walk Speed: <input type="range" id="walkSpeed" min="1" max="10" step="0.1" value="${this.controller.config.walkSpeed}"></label>
        <span id="walkSpeedValue">${this.controller.config.walkSpeed}</span><br>
        <label>Run Speed: <input type="range" id="runSpeed" min="3" max="15" step="0.1" value="${this.controller.config.runSpeed}"></label>
        <span id="runSpeedValue">${this.controller.config.runSpeed}</span><br>
        <label>Jump Force: <input type="range" id="jumpForce" min="3" max="15" step="0.1" value="${this.controller.config.jumpForce}"></label>
        <span id="jumpForceValue">${this.controller.config.jumpForce}</span><br>
        <label>Gravity: <input type="range" id="gravity" min="10" max="50" step="1" value="${this.controller.config.gravity}"></label>
        <span id="gravityValue">${this.controller.config.gravity}</span><br>
        <label><input type="checkbox" id="showCollider"> Show Collider</label>
      </div>
      <div style="margin-bottom: 15px;">
        <div style="font-weight: bold; margin-bottom: 5px;">Camera</div>
        <label>Distance: <input type="range" id="cameraDistance" min="2" max="15" step="0.1" value="${this.cameraRig.config.distance}"></label>
        <span id="cameraDistanceValue">${this.cameraRig.config.distance}</span><br>
        <label>Height: <input type="range" id="cameraHeight" min="0" max="5" step="0.1" value="${this.cameraRig.config.height}"></label>
        <span id="cameraHeightValue">${this.cameraRig.config.height}</span><br>
        <label>Smooth Speed: <input type="range" id="smoothSpeed" min="1" max="20" step="0.1" value="${this.cameraRig.config.smoothSpeed}"></label>
        <span id="smoothSpeedValue">${this.cameraRig.config.smoothSpeed}</span><br>
      </div>
      <div>
        <div style="font-weight: bold; margin-bottom: 5px;">Info</div>
        <div>Grounded: <span id="isGrounded">-</span></div>
        <div>Move Speed: <span id="moveSpeed">-</span></div>
        <div>Sprinting: <span id="isSprinting">-</span></div>
        <div>Animation: <span id="currentAnim">-</span></div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    const setupSlider = (id, valueId, target, prop) => {
      const slider = panel.querySelector(`#${id}`);
      const valueSpan = panel.querySelector(`#${valueId}`);
      slider.addEventListener('input', (e) => {
        target[prop] = parseFloat(e.target.value);
        valueSpan.textContent = e.target.value;
      });
    };
    
    setupSlider('walkSpeed', 'walkSpeedValue', this.controller.config, 'walkSpeed');
    setupSlider('runSpeed', 'runSpeedValue', this.controller.config, 'runSpeed');
    setupSlider('jumpForce', 'jumpForceValue', this.controller.config, 'jumpForce');
    setupSlider('gravity', 'gravityValue', this.controller.config, 'gravity');
    setupSlider('cameraDistance', 'cameraDistanceValue', this.cameraRig.config, 'distance');
    setupSlider('cameraHeight', 'cameraHeightValue', this.cameraRig.config, 'height');
    setupSlider('smoothSpeed', 'smoothSpeedValue', this.cameraRig.config, 'smoothSpeed');
    
    panel.querySelector('#showCollider').addEventListener('change', (e) => {
      this.controller.setDebugVisible(e.target.checked);
    });
    
    this.debugUpdateCallbacks = () => {
      panel.querySelector('#isGrounded').textContent = this.controller.isGrounded() ? 'Yes' : 'No';
      panel.querySelector('#moveSpeed').textContent = this.controller.getMoveSpeed().toFixed(2);
      panel.querySelector('#isSprinting').textContent = this.controller.isSprinting() ? 'Yes' : 'No';
      panel.querySelector('#currentAnim').textContent = this.currentAction?.getClip()?.name || 'none';
    };
    
    this.debugUI = { panel };
  }
  
  updateDebugUI() {
    if (this.debugUpdateCallbacks) {
      this.debugUpdateCallbacks();
    }
  }
  
  dispose() {
    if (this.model) {
      this.scene.remove(this.model);
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
    }
    
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
    
    if (this.controller) {
      this.controller.dispose();
    }
    
    if (this.debugUI?.panel) {
      document.body.removeChild(this.debugUI.panel);
    } else if (this.debugUI?.destroy) {
      this.debugUI.destroy();
    }
  }
}
