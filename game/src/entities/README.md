# Player Movement System

A complete third-person character controller system for Three.js with physics-based movement, animations, and camera controls.

## Components

### Player.js
The main player entity that integrates the character controller, camera rig, and animation system.

**Features:**
- GLTF model loading with fallback capsule model
- Animation mixer with idle, walk, run, and jump animations
- Automatic animation blending based on player state
- Debug UI for tweaking parameters
- Integration with InputMapper for controls

### CharacterController.js
Physics-based capsule character controller with collision detection and resolution.

**Features:**
- Capsule collision shape for smooth movement
- Acceleration and deceleration
- Sprint toggle for faster movement
- Gravity and jumping mechanics
- Slope handling with configurable max angle
- Ground detection with raycasting
- Collision resolution against building/ground colliders
- Step height for climbing small obstacles

### CameraRig.js
Third-person chase camera with smooth following and collision avoidance.

**Features:**
- Smooth camera following with lerp
- Mouse and gamepad (right stick) controls
- Zoom in/out functionality
- Collision avoidance with raycasting
- Configurable camera angles and distances
- Automatic look-at targeting

## Installation

```javascript
import { Player } from './game/src/entities/Player.js';
```

## Usage

### Basic Setup

```javascript
import * as THREE from 'three';
import { Player } from './game/src/entities/Player.js';

// Setup scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Create collision world (optional, or use your WorldBuilder)
const collisionWorld = {
  getColliders: () => {
    // Return array of mesh objects that should act as colliders
    return scene.children.filter(obj => 
      obj.isMesh && obj.userData.isCollider
    );
  }
};

// Create input mapper
const inputMapper = {
  getAxis: (name) => {
    // Return axis values for MoveForward, MoveRight, LookX, LookY, Zoom
    // Values should be between -1 and 1
  },
  getButton: (name) => {
    // Return boolean for Sprint, Jump buttons
  },
  getMouseDelta: () => {
    // Return { x, y } for mouse movement delta
  }
};

// Create player
const player = new Player(scene, camera, collisionWorld, inputMapper, {
  modelPath: '/game/assets/models/character.glb',
  scale: 1.0,
  debug: true, // Enable debug UI
  controller: {
    walkSpeed: 3.5,
    runSpeed: 7.0,
    jumpForce: 8.0,
    gravity: 25.0,
    capsuleRadius: 0.35,
    capsuleHeight: 1.8,
    maxSlopeAngle: 45
  },
  camera: {
    distance: 5.0,
    height: 2.0,
    targetHeight: 1.5,
    smoothSpeed: 8.0,
    mouseSensitivity: 0.002,
    minDistance: 2.0,
    maxDistance: 10.0
  }
});

// Set initial position
player.setPosition(0, 10, 0);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();
  player.update(deltaTime);
  player.updateDebugUI();
  
  renderer.render(scene, camera);
}

animate();
```

### InputMapper Example

Here's a complete example of an InputMapper implementation:

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
    
    // Request pointer lock on click
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
      case 'LookX':
        return 0; // Gamepad right stick X
      case 'LookY':
        return 0; // Gamepad right stick Y
      case 'Zoom':
        return 0; // Mouse wheel or gamepad triggers
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
```

### Character Model Requirements

The player system expects a GLTF model with the following:

**Animation Clips:**
- `Idle` - Character idle animation
- `Walk` - Walking animation
- `Run` - Running animation (optional, will use Walk if not present)
- `Jump` - Jumping animation (optional)

Animation clip names are case-insensitive and support variations like:
- Idle: "Idle", "idle", "IDLE", "Armature|Idle"
- Walk: "Walk", "walk", "WALK", "Walking", "Armature|Walk"
- Run: "Run", "run", "RUN", "Running", "Armature|Run"
- Jump: "Jump", "jump", "JUMP", "Jumping", "Armature|Jump"

If no model is found or fails to load, a fallback capsule mesh will be used.

### Collision Detection

The system detects collisions with meshes that have:
- `userData.isCollider = true`
- Names containing: "collider", "building", "ground", "wall"

Example of creating a collision mesh:

```javascript
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228822 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.userData.isCollider = true;
ground.name = 'ground';
ground.receiveShadow = true;
scene.add(ground);

const buildingGeometry = new THREE.BoxGeometry(5, 10, 5);
const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
building.position.set(10, 5, 10);
building.userData.isCollider = true;
building.name = 'building_1';
building.castShadow = true;
building.receiveShadow = true;
scene.add(building);
```

## Configuration Options

### Player Options

```javascript
{
  modelPath: '/path/to/model.glb',  // Path to GLTF model
  scale: 1.0,                        // Model scale
  debug: true,                       // Enable debug UI
  controller: { ... },               // CharacterController options
  camera: { ... }                    // CameraRig options
}
```

### CharacterController Options

```javascript
{
  capsuleRadius: 0.35,        // Collision capsule radius
  capsuleHeight: 1.8,         // Collision capsule height
  walkSpeed: 3.5,             // Walk speed (m/s)
  runSpeed: 7.0,              // Run/sprint speed (m/s)
  acceleration: 20.0,         // Acceleration rate
  deceleration: 15.0,         // Deceleration rate
  rotationSpeed: 8.0,         // Turn speed
  jumpForce: 8.0,             // Jump velocity
  gravity: 25.0,              // Gravity acceleration
  maxSlopeAngle: 45,          // Maximum walkable slope (degrees)
  stepHeight: 0.3,            // Step height for climbing
  groundCheckDistance: 0.1    // Ground detection distance
}
```

### CameraRig Options

```javascript
{
  distance: 5.0,              // Camera distance from target
  height: 2.0,                // Camera height offset
  targetHeight: 1.5,          // Target point height offset
  minDistance: 2.0,           // Minimum zoom distance
  maxDistance: 10.0,          // Maximum zoom distance
  smoothSpeed: 8.0,           // Camera lerp speed
  rotationSpeed: 3.0,         // Gamepad rotation speed
  mouseSensitivity: 0.002,    // Mouse sensitivity
  minPolarAngle: 0.314,       // Min vertical angle (radians)
  maxPolarAngle: 1.414,       // Max vertical angle (radians)
  collisionRadius: 0.3,       // Camera collision buffer
  zoomSpeed: 1.0              // Zoom speed multiplier
}
```

## Debug UI

When `debug: true` is set, a debug panel will be created (using dat.GUI if available, otherwise a custom HTML panel).

**Controller Section:**
- Walk Speed, Run Speed, Acceleration
- Jump Force, Gravity
- Max Slope Angle
- Show Collider (toggle collision capsule visibility)

**Camera Section:**
- Distance, Height, Target Height
- Smooth Speed, Mouse Sensitivity

**Info Section:**
- Is Grounded, Move Speed
- Is Sprinting, Current Animation

## API Reference

### Player

#### Methods

- `update(deltaTime)` - Update player (call every frame)
- `updateDebugUI()` - Update debug UI values
- `setPosition(x, y, z)` - Set player position
- `getPosition()` - Get current position (Vector3)
- `getRotation()` - Get current rotation (radians)
- `dispose()` - Clean up resources

### CharacterController

#### Methods

- `setInput(forward, right, sprint, jump)` - Set movement input
- `update(deltaTime, cameraRotation)` - Update physics and movement
- `setPosition(x, y, z)` - Set controller position
- `getPosition()` - Get position (Vector3)
- `getRotation()` - Get rotation (radians)
- `isMoving()` - Check if character is moving
- `isGrounded()` - Check if character is on ground
- `isSprinting()` - Check if character is sprinting
- `isJumping()` - Check if character is jumping
- `getMoveSpeed()` - Get current movement speed
- `setDebugVisible(visible)` - Show/hide collision capsule
- `dispose()` - Clean up resources

### CameraRig

#### Methods

- `setTarget(position)` - Set camera follow target
- `setMouseInput(deltaX, deltaY)` - Set mouse movement
- `setRightStickInput(x, y)` - Set gamepad stick input
- `zoom(delta)` - Adjust camera distance
- `update(deltaTime)` - Update camera (call every frame)
- `getAzimuthAngle()` - Get horizontal rotation (radians)
- `getPolarAngle()` - Get vertical rotation (radians)
- `setAzimuthAngle(angle)` - Set horizontal rotation
- `setPolarAngle(angle)` - Set vertical rotation
- `getForwardDirection()` - Get camera forward vector
- `getRightDirection()` - Get camera right vector
- `reset()` - Reset camera rotation

## Controls

### Keyboard
- **WASD** or **Arrow Keys** - Move
- **Space** - Jump
- **Shift** - Sprint/Run
- **Mouse** - Look around (with pointer lock)

### Gamepad
- **Left Stick** - Move
- **Right Stick** - Look around
- **A/Cross** - Jump
- **Left Stick Click** - Sprint

## Performance Tips

1. **Model Optimization**: Use low-poly models with LOD for better performance
2. **Animation Optimization**: Limit animation updates to visible players
3. **Collision Simplification**: Use simple collision meshes (boxes, capsules) instead of detailed geometry
4. **Raycasting**: Limit the number of colliders checked each frame
5. **Update Rate**: Consider fixed timestep for physics updates

## Troubleshooting

**Player falls through ground:**
- Ensure ground mesh has `userData.isCollider = true`
- Check ground mesh is in the scene
- Verify initial player position is above ground

**Animations not working:**
- Check GLTF model has animation clips
- Verify animation names match expected format
- Check console for animation loading errors

**Camera clipping through walls:**
- Ensure wall meshes have proper collision tags
- Adjust `collisionRadius` in camera config
- Verify raycasting is working (check `getColliders()`)

**Stuttering movement:**
- Use `requestAnimationFrame` for consistent frame timing
- Clamp deltaTime to prevent large jumps
- Check for performance bottlenecks

## License

Part of the game/src/entities module.
