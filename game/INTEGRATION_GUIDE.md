# Player Movement System - Integration Guide

This guide explains how to integrate the Player Movement System into your game project.

## Overview

The player movement system consists of three main components:
- **Player.js** - Main player entity with model, animations, and integration
- **CharacterController.js** - Physics-based capsule movement controller
- **CameraRig.js** - Third-person camera with smooth follow and collision avoidance

## Prerequisites

### Required Dependencies

```bash
npm install three
# or
yarn add three
```

### Required Assets

1. **Character Model** (optional, fallback capsule used if not found)
   - Format: GLTF (.glb or .gltf)
   - Recommended location: `/game/assets/models/character.glb`
   - Should include animations: Idle, Walk, Run (optional), Jump (optional)

2. **Collision Geometry**
   - Ground plane or terrain mesh
   - Building/obstacle meshes with proper tags

## Quick Start

### 1. Basic Setup

```javascript
import * as THREE from 'three';
import { Player } from './game/src/entities/Player.js';

// Create scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create ground (required for collision)
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228822 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.userData.isCollider = true; // Important!
ground.name = 'ground';
scene.add(ground);

// Setup lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 100, 50);
scene.add(directionalLight);
```

### 2. Create Input Mapper

```javascript
class InputMapper {
  constructor() {
    this.keys = {};
    this.mouseMovement = { x: 0, y: 0 };
    this.pointerLocked = false;
    
    window.addEventListener('keydown', (e) => this.keys[e.code] = true);
    window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement !== null;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.pointerLocked) {
        this.mouseMovement.x = e.movementX;
        this.mouseMovement.y = e.movementY;
      }
    });
    
    // Request pointer lock
    document.addEventListener('click', () => {
      if (!this.pointerLocked) {
        document.body.requestPointerLock();
      }
    });
  }
  
  getAxis(name) {
    switch(name) {
      case 'MoveForward':
        return (this.keys['KeyW'] || this.keys['ArrowUp'] ? 1 : 0) +
               (this.keys['KeyS'] || this.keys['ArrowDown'] ? -1 : 0);
      case 'MoveRight':
        return (this.keys['KeyD'] || this.keys['ArrowRight'] ? 1 : 0) +
               (this.keys['KeyA'] || this.keys['ArrowLeft'] ? -1 : 0);
      default:
        return 0;
    }
  }
  
  getButton(name) {
    switch(name) {
      case 'Sprint':
        return this.keys['ShiftLeft'] || this.keys['ShiftRight'];
      case 'Jump':
        return this.keys['Space'];
      default:
        return false;
    }
  }
  
  getMouseDelta() {
    const delta = { ...this.mouseMovement };
    this.mouseMovement.x = 0;
    this.mouseMovement.y = 0;
    return delta;
  }
}

const inputMapper = new InputMapper();
```

### 3. Create Collision World

```javascript
const collisionWorld = {
  getColliders: () => {
    return scene.children.filter(obj => 
      obj.isMesh && obj.userData.isCollider
    );
  }
};
```

### 4. Create Player Instance

```javascript
const player = new Player(scene, camera, collisionWorld, inputMapper, {
  modelPath: '/game/assets/models/character.glb',
  scale: 1.0,
  debug: true, // Enable debug UI
  controller: {
    walkSpeed: 3.5,
    runSpeed: 7.0,
    jumpForce: 8.0,
    gravity: 25.0
  },
  camera: {
    distance: 5.0,
    height: 2.0,
    smoothSpeed: 8.0
  }
});

// Set initial position
player.setPosition(0, 10, 0);
```

### 5. Animation Loop

```javascript
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();
  player.update(deltaTime);
  player.updateDebugUI();
  
  renderer.render(scene, camera);
}

animate();
```

## Integration with Existing Projects

### With WorldBuilder

If you have a WorldBuilder class that generates collision geometry:

```javascript
class WorldBuilder {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
  }
  
  addBuilding(x, y, z, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const building = new THREE.Mesh(geometry, material);
    building.position.set(x, y, z);
    building.userData.isCollider = true;
    building.name = 'building';
    building.castShadow = true;
    building.receiveShadow = true;
    this.scene.add(building);
    this.colliders.push(building);
    return building;
  }
  
  getColliders() {
    return this.colliders;
  }
}

const worldBuilder = new WorldBuilder(scene);
worldBuilder.addBuilding(10, 5, 10, 8, 10, 8);
worldBuilder.addBuilding(-15, 4, -15, 6, 8, 6);

// Use WorldBuilder as collision world
const player = new Player(scene, camera, worldBuilder, inputMapper, options);
```

### With Custom InputMapper

If you already have an input system:

```javascript
class MyGameInputSystem {
  // Your existing input handling
  
  // Add these methods for Player compatibility
  getAxis(name) {
    if (name === 'MoveForward') return this.getVerticalInput();
    if (name === 'MoveRight') return this.getHorizontalInput();
    if (name === 'LookX') return this.getLookHorizontal();
    if (name === 'LookY') return this.getLookVertical();
    if (name === 'Zoom') return this.getZoomInput();
    return 0;
  }
  
  getButton(name) {
    if (name === 'Sprint') return this.isSprintPressed();
    if (name === 'Jump') return this.isJumpPressed();
    return false;
  }
  
  getMouseDelta() {
    return this.getMouseMovement();
  }
}
```

### Without GLTF Model

If you don't have a character model, the system will automatically create a fallback capsule:

```javascript
const player = new Player(scene, camera, collisionWorld, inputMapper, {
  modelPath: '/nonexistent/path.glb', // Will trigger fallback
  // ... other options
});
```

Or manually create a fallback:

```javascript
// The Player class has a createFallbackModel() method that's automatically
// called if the GLTF fails to load. The fallback is a blue capsule mesh.
```

## Advanced Configuration

### Custom Movement Parameters

```javascript
const player = new Player(scene, camera, collisionWorld, inputMapper, {
  controller: {
    capsuleRadius: 0.4,          // Wider collision
    capsuleHeight: 2.0,           // Taller character
    walkSpeed: 4.0,               // Faster walk
    runSpeed: 9.0,                // Much faster sprint
    acceleration: 25.0,           // Snappier movement
    deceleration: 20.0,           // Quicker stops
    jumpForce: 10.0,              // Higher jumps
    gravity: 30.0,                // Heavier feel
    maxSlopeAngle: 50,            // Steeper slopes
    stepHeight: 0.5               // Bigger steps
  }
});
```

### Custom Camera Settings

```javascript
const player = new Player(scene, camera, collisionWorld, inputMapper, {
  camera: {
    distance: 7.0,                // Further from character
    height: 3.0,                  // Higher camera
    targetHeight: 1.8,            // Look at head level
    minDistance: 3.0,             // Minimum zoom
    maxDistance: 15.0,            // Maximum zoom
    smoothSpeed: 10.0,            // Faster camera
    mouseSensitivity: 0.003,      // More sensitive
    minPolarAngle: Math.PI * 0.05, // Lower angle
    maxPolarAngle: Math.PI * 0.4,  // Higher angle
    collisionRadius: 0.5          // Bigger collision buffer
  }
});
```

## Collision Setup Guide

### Proper Collision Tags

For objects to be detected as colliders, they must have one of:

1. **userData.isCollider = true** (recommended)
2. Name containing: "collider", "building", "ground", "wall"

```javascript
// Method 1: Using userData (recommended)
mesh.userData.isCollider = true;

// Method 2: Using naming convention
mesh.name = 'building_01';
mesh.name = 'ground_plane';
mesh.name = 'wall_segment';
```

### Ground Setup

```javascript
const groundGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x228822,
  roughness: 0.8
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
ground.userData.isCollider = true;
ground.name = 'ground';
scene.add(ground);
```

### Building Obstacles

```javascript
function createBuilding(x, y, z, width, height, depth) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x666666,
    roughness: 0.7
  });
  const building = new THREE.Mesh(geometry, material);
  building.position.set(x, y, z);
  building.castShadow = true;
  building.receiveShadow = true;
  building.userData.isCollider = true;
  building.name = 'building';
  scene.add(building);
  return building;
}

createBuilding(15, 5, 15, 8, 10, 8);
createBuilding(-20, 4, 20, 6, 8, 6);
```

### Slopes and Ramps

```javascript
const rampGeometry = new THREE.BoxGeometry(10, 0.5, 15);
const rampMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
ramp.position.set(-30, 2, 0);
ramp.rotation.z = Math.PI / 12; // 15 degree slope
ramp.userData.isCollider = true;
ramp.name = 'ramp';
scene.add(ramp);
```

## Animation Setup

### Required Animation Clips

The system looks for these animation names (case-insensitive):

- **Idle**: "Idle", "idle", "IDLE", "Armature|Idle"
- **Walk**: "Walk", "walk", "WALK", "Walking", "Armature|Walk"
- **Run**: "Run", "run", "RUN", "Running", "Armature|Run"
- **Jump**: "Jump", "jump", "JUMP", "Jumping", "Armature|Jump"

### Animation State Logic

```javascript
// Automatic state transitions:
// - Not grounded + Jump animation = Play Jump
// - Moving + Sprinting + Run animation = Play Run
// - Moving + Walk animation = Play Walk
// - Otherwise = Play Idle
```

### Custom Animation Handling

If you need custom animation logic, extend the Player class:

```javascript
import { Player } from './game/src/entities/Player.js';

class CustomPlayer extends Player {
  updateAnimations(deltaTime) {
    super.updateAnimations(deltaTime);
    
    // Add custom animation logic here
    if (this.isUnderWater) {
      this.transitionToAction(this.animations.swim, 0.2);
    }
  }
}
```

## Debugging

### Enable Debug UI

```javascript
const player = new Player(scene, camera, collisionWorld, inputMapper, {
  debug: true // Enables debug panel
});
```

### Debug Panel Features

- **Controller Section**: Adjust speeds, gravity, jump force
- **Camera Section**: Adjust distances, smoothing, sensitivity
- **Info Section**: Real-time state information

### Show Collision Capsule

```javascript
player.controller.setDebugVisible(true);
```

### Console Logging

```javascript
// In your animation loop
console.log('Position:', player.getPosition());
console.log('Is Grounded:', player.controller.isGrounded());
console.log('Move Speed:', player.controller.getMoveSpeed());
console.log('Animation:', player.currentAction?.getClip()?.name);
```

## Common Issues and Solutions

### Player Falls Through Ground

**Problem**: Player immediately falls through the ground mesh.

**Solution**: 
- Ensure ground mesh has `userData.isCollider = true`
- Verify ground mesh is added to the scene
- Check initial player position is above ground (y > 1)

```javascript
ground.userData.isCollider = true; // Add this!
player.setPosition(0, 10, 0); // Start above ground
```

### Camera Clips Through Walls

**Problem**: Camera can see through building walls.

**Solution**:
- Ensure building meshes have collision tags
- Adjust `collisionRadius` in camera config
- Check buildings are solid geometry (not just planes)

```javascript
building.userData.isCollider = true; // Add this!
// OR
building.name = 'building_01';
```

### Animations Don't Play

**Problem**: Character model loads but animations don't work.

**Solution**:
- Check GLTF file contains animation clips
- Verify animation names match expected format
- Check browser console for errors

```javascript
// The system will log animation loading:
// "Player model loaded successfully"
// If animations found, they'll be set up automatically
```

### Stuttering Movement

**Problem**: Character movement is jerky or stutters.

**Solution**:
- Use `requestAnimationFrame` for consistent timing
- Clamp deltaTime to prevent large jumps
- Check for performance bottlenecks

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  let deltaTime = clock.getDelta();
  deltaTime = Math.min(deltaTime, 0.1); // Clamp to max 100ms
  
  player.update(deltaTime);
  renderer.render(scene, camera);
}
```

### Mouse Look Not Working

**Problem**: Camera doesn't respond to mouse movement.

**Solution**:
- Check pointer lock is active
- Verify InputMapper.getMouseDelta() returns values
- Clear mouse delta each frame

```javascript
document.addEventListener('pointerlockchange', () => {
  const isLocked = document.pointerLockElement !== null;
  console.log('Pointer locked:', isLocked);
});
```

## Performance Optimization

### Reduce Collision Checks

```javascript
// Only check nearby colliders
const collisionWorld = {
  getColliders: () => {
    const playerPos = player.getPosition();
    const maxDistance = 20;
    
    return scene.children.filter(obj => {
      if (!obj.isMesh || !obj.userData.isCollider) return false;
      return obj.position.distanceTo(playerPos) < maxDistance;
    });
  }
};
```

### Simplify Collision Geometry

```javascript
// Create simple collision box separate from visual mesh
const visualMesh = loadDetailedBuilding();
scene.add(visualMesh);

const collisionBox = new THREE.Mesh(
  new THREE.BoxGeometry(8, 10, 8),
  new THREE.MeshBasicMaterial({ visible: false })
);
collisionBox.position.copy(visualMesh.position);
collisionBox.userData.isCollider = true;
scene.add(collisionBox);
```

### LOD for Models

```javascript
import { LOD } from 'three';

const lod = new LOD();
lod.addLevel(detailedMesh, 0);
lod.addLevel(mediumMesh, 20);
lod.addLevel(lowPolyMesh, 50);
scene.add(lod);
```

## API Reference

See [README.md](./src/entities/README.md) for complete API documentation.

## Examples

- **Basic Example**: See [example.html](./src/entities/example.html)
- **Test Import**: See [test-import.js](./src/entities/test-import.js)

## Support

For issues or questions:
1. Check the README.md for detailed API documentation
2. Review the example.html for a complete working example
3. Enable debug mode and check console logs
4. Verify collision setup and tags

## License

Part of the game/src/entities module.
