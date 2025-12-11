# 3D World Sandbox - Three.js Game Sub-App

A modular Three.js-based GTA-style sandbox game featuring dynamic day-night cycles, configurable controls, and a procedurally generated city environment.

## Architecture

### Core Systems

#### `core/Engine.js`
Manages the main render loop and update cycle with:
- Three.js renderer initialization and management
- Frame timing and FPS tracking
- Automatic pause/resume on window focus/blur
- Delta time calculations
- Callback-based update and render systems

**Key Methods:**
- `initRenderer(options)` - Initialize WebGL renderer with optional config
- `onUpdate(callback)` - Register frame update callbacks
- `onRender(callback)` - Register render callbacks
- `start()` / `stop()` - Control the render loop
- `getFPS()` - Get current frames per second
- `getDeltaTime()` - Get frame delta time

#### `core/InputMapper.js`
Configurable keyboard and mouse input handling:
- WASD and arrow key bindings with support for remapping
- JSON-based configuration loading/export
- Callback-based input system
- Mouse movement tracking for camera control

**Default Bindings:**
- `moveForward` - W / Up Arrow
- `moveBackward` - S / Down Arrow
- `moveLeft` - A / Left Arrow
- `moveRight` - D / Right Arrow
- `jump` - Spacebar
- `sprint` - Shift

**Key Methods:**
- `registerCallback(action, callback)` - Listen for input events
- `isActionPressed(action)` - Check if action is active
- `rebindKey(action, newKeys)` - Dynamically rebind controls
- `loadConfig(jsonConfig)` - Load config from JSON
- `exportConfig()` - Export current config

### World Systems

#### `world/WorldBuilder.js`
Procedurally generates a ~2km² city environment with:
- Flat terrain base (2000x2000m)
- 10x10 block grid with streets and sidewalks
- Procedurally varied buildings with randomized heights/colors
- Collision detection via AABB bounding boxes
- Skybox dome for atmospheric effect

**Features:**
- 100+ procedurally generated buildings
- Street and sidewalk meshes
- Collision checking for player physics
- Dynamic sky color updates from day-night cycle

**Key Methods:**
- `build()` - Generate the complete world
- `checkCollision(position, radius)` - AABB collision detection
- `updateSkyColor(color)` - Update sky based on time of day
- `getColliders()` - Access building colliders

### Lighting Systems

#### `lighting/DayNightCycle.js`
Dynamic lighting and environmental effects with:
- 24-hour game day cycle (5 real minutes = 1 game hour)
- Smooth color/intensity interpolation between 8 time-of-day presets
- Directional light rotation following sun path
- Ambient light intensity variation
- Fog color and density adjustment

**Time Presets:**
- 0:00 (Midnight) - Dark blue, low light
- 3:00 (Early Morning) - Very dark, minimal light
- 6:00 (Dawn) - Orange/yellow directional light
- 9:00 (Morning) - Full brightness
- 12:00 (Noon) - Peak brightness, white light
- 15:00 (Afternoon) - High brightness, white light
- 18:00 (Evening) - Sunset orange/red
- 21:00 (Night) - Dark blue, low ambient

**Key Methods:**
- `update(deltaTime)` - Update cycle and lighting
- `onUpdate(callback)` - Listen for time/lighting changes
- `setGameTime(hour, minute)` - Set time directly
- `formatGameTime()` - Get formatted HH:MM time
- `getHour()` / `getMinute()` - Query current time
- `getSkyColor()` / `getGroundColor()` - Get current colors

### Player Systems

#### `player/PlayerController.js`
First-person player character with:
- WASD movement with configurable speed
- Sprint multiplier via shift key
- Jump physics with gravity
- Pointer lock mouse look with pitch/yaw
- AABB collision with world geometry
- World boundary constraints

**Physics:**
- Movement speed: 10 m/s
- Sprint multiplier: 1.5x
- Jump force: 8 units
- Gravity: 20 units/s²
- Player radius: 0.5 units

**Key Methods:**
- `update(deltaTime)` - Update player position/rotation
- `getPosition()` / `setPosition()` - Query/set player location
- `getVelocity()` - Get current velocity

## Entry Point

### `src/main.js`
Bootstrap module that:
1. Loads Three.js from CDN (if not present)
2. Creates scene, camera, and engine
3. Initializes all subsystems in correct order
4. Wires up callbacks and integration points
5. Shows loading screen until world is ready
6. Updates HUD with FPS and game time

## Usage

Access the game at: `/game/index.html`

### Controls
- **WASD** - Move
- **Mouse** - Look around (click to lock pointer)
- **Shift** - Sprint
- **Space** - Jump
- **Esc** - Unlock mouse (browser dependent)
- **← Back** - Return to main simulator

### HUD Elements
- **Top-Left**: FPS counter (updated every 30 frames)
- **Top-Right**: Current game time (HH:MM)
- **Bottom-Left**: Control hints
- **Bottom-Right**: Navigation button

## Performance Optimization

- Render loop pauses when window loses focus
- Three.js renderer uses `high-performance` power preference
- Shadow maps enabled for realistic lighting
- Static meshes for buildings (no per-frame updates)
- Efficient AABB collision checking
- Fog culling reduces draw calls

## Configuration

### Rebinding Controls
```javascript
// From browser console or game code
inputMapper.rebindKey('moveForward', ['w', 'arrowup']);
inputMapper.rebindKey('sprint', ['ctrl']);
```

### Loading Custom Config
```javascript
const config = {
    moveForward: ['w', 'z'],
    moveBackward: ['s'],
    moveLeft: ['q'],
    moveRight: ['d'],
    jump: [' '],
    sprint: ['shift']
};
inputMapper.loadConfig(config);
```

### Adjusting Day-Night Cycle Speed
```javascript
// In main.js, change gameHoursPerRealMinute
dayNightCycle = new DayNightCycle(scene, {
    startHour: 12,
    startMinute: 0,
    gameHoursPerRealMinute: 12  // Adjust this value
});
// Higher = faster time progression
```

## Extending the System

### Adding New Features

1. **New Input Actions:**
   - Register in InputMapper default config
   - Add callback in PlayerController or new system

2. **New World Objects:**
   - Add mesh creation to WorldBuilder
   - Register colliders in `this.colliders` array
   - Integrate with day-night cycle if needed

3. **New UI Elements:**
   - Add HTML to game/index.html
   - Style in game.css
   - Update in main.js updateHUD() function

## Technical Details

- **Resolution**: Dynamic, updates on window resize
- **Target FPS**: 60fps (uncapped)
- **Renderer**: Three.js WebGL
- **Lighting**: Phong/Lambert materials with shadows
- **Physics**: Simplified AABB-based collision
- **Module System**: ES6 modules

## Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Requires WebGL 2.0 and ES6 module support.
