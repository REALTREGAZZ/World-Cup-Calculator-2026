# Character Model Assets

## Required Model

Place your character GLTF model here as `character.glb` or `character.gltf`.

## Model Requirements

### Format
- GLTF 2.0 (.glb or .gltf)
- Embedded textures recommended for .glb
- Maximum file size: ~10MB for web performance

### Scale
- Character should be approximately 1.8 units tall
- Alternatively, adjust the `scale` option when creating the Player

### Rigging
- Humanoid skeleton recommended
- Bone hierarchy should be clean and well-structured

### Animations

The model should include these animation clips:

1. **Idle** (required)
   - Looping animation
   - Duration: 1-3 seconds
   - Character standing in place with subtle movement

2. **Walk** (required)
   - Looping animation
   - Duration: 0.5-1 second
   - Natural walking cycle

3. **Run** (optional, will use Walk if not present)
   - Looping animation
   - Duration: 0.4-0.8 seconds
   - Faster running cycle

4. **Jump** (optional)
   - Non-looping animation
   - Duration: 0.5-1 second
   - Jump takeoff and landing

### Animation Naming

Acceptable animation clip names (case-insensitive):

- **Idle**: "Idle", "idle", "IDLE", "Armature|Idle"
- **Walk**: "Walk", "walk", "WALK", "Walking", "Armature|Walk"
- **Run**: "Run", "run", "RUN", "Running", "Armature|Run"
- **Jump**: "Jump", "jump", "JUMP", "Jumping", "Armature|Jump"

## Free Character Models

Here are some sources for free GLTF character models with animations:

### Mixamo
1. Go to https://www.mixamo.com/
2. Select a character
3. Download with animations (FBX format)
4. Convert FBX to GLTF using:
   - Online: https://github.com/facebookincubator/FBX2glTF
   - Blender: Import FBX → Export GLTF

### Sketchfab
- https://sketchfab.com/
- Filter by: Free, Downloadable, Animated
- Search for "rigged character animated"

### Ready Player Me
- https://readyplayer.me/
- Create custom avatar
- Export as GLTF with animations

### Quaternius
- https://quaternius.com/
- Free low-poly characters
- Multiple animation packs

## Converting Models

### Using Blender

1. Import your model (FBX, OBJ, etc.)
2. Ensure animations are in Action Editor
3. File → Export → glTF 2.0
4. Export settings:
   - Format: glTF Binary (.glb)
   - Include: Selected Objects, Animations
   - Geometry: Apply Modifiers, UVs, Normals
   - Animation: Always Sample Animations

### Using Online Tools

- **FBX to GLTF**: https://products.aspose.app/3d/conversion/fbx-to-gltf
- **OBJ to GLTF**: https://products.aspose.app/3d/conversion/obj-to-gltf

## Testing Your Model

Use the Three.js editor to test your model:
1. Go to https://threejs.org/editor/
2. File → Import → Select your .glb file
3. Check that:
   - Model displays correctly
   - Animations are listed in the sidebar
   - Animation names match expected format
   - Model scale is reasonable

## Fallback

If no model is provided or the model fails to load, the Player system will automatically create a simple blue capsule mesh as a fallback.

## Example Model Structure

```
character.glb
├── Meshes
│   ├── Body
│   ├── Head
│   └── Clothes
├── Skeleton
│   ├── Root
│   ├── Spine
│   ├── Head
│   ├── Arms (L/R)
│   └── Legs (L/R)
└── Animations
    ├── Idle
    ├── Walk
    ├── Run
    └── Jump
```

## Optimization Tips

1. **Reduce Polygon Count**: Keep models under 20k triangles
2. **Texture Size**: Use 1024x1024 or smaller textures
3. **Combine Materials**: Merge materials where possible
4. **Remove Hidden Geometry**: Delete faces inside the model
5. **Use glTF Binary**: .glb is more efficient than .gltf
6. **Compress Textures**: Use compressed texture formats

## Attribution

Remember to include proper attribution if using models with attribution requirements!
