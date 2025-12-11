/**
 * WorldBuilder.js
 * Generates a pre-authored city grid with streets, sidewalks, buildings, and colliders.
 * Creates a small world (~1-2 km²) with static geometry for a GTA-style sandbox.
 */

export class WorldBuilder {
    constructor(scene) {
        this.scene = scene;
        this.terrainGroup = new THREE.Group();
        this.buildingsGroup = new THREE.Group();
        this.colliders = [];

        this.scene.add(this.terrainGroup);
        this.scene.add(this.buildingsGroup);

        console.log('[WorldBuilder] Initialized');
    }

    /**
     * Build the complete world
     */
    build() {
        console.log('[WorldBuilder] Building world...');

        this.createTerrain();
        this.createStreetGrid();
        this.createBuildings();
        this.createSkybox();

        console.log('[WorldBuilder] World built. Total objects:', this.scene.children.length);
    }

    /**
     * Create base terrain (ground plane)
     */
    createTerrain() {
        const terrainSize = 2000; // 2km x 2km
        const groundGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize);
        const groundMaterial = new THREE.MeshLambertMaterial({
            color: 0x4a7c3c,
            flatShading: false
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.terrainGroup.add(ground);

        console.log('[WorldBuilder] Terrain created: ' + terrainSize + 'm x ' + terrainSize + 'm');
    }

    /**
     * Create a grid of streets and sidewalks
     */
    createStreetGrid() {
        const blockSize = 200; // 200m blocks
        const gridSize = 10; // 10x10 blocks
        const gridExtent = blockSize * gridSize;

        // Vertical streets
        for (let i = 0; i <= gridSize; i++) {
            const x = -gridExtent / 2 + (i * blockSize);
            this.createStreet(x, -gridExtent / 2, x, gridExtent / 2);
        }

        // Horizontal streets
        for (let i = 0; i <= gridSize; i++) {
            const z = -gridExtent / 2 + (i * blockSize);
            this.createStreet(-gridExtent / 2, z, gridExtent / 2, z);
        }

        console.log('[WorldBuilder] Street grid created: ' + (gridSize + 1) + ' x ' + (gridSize + 1));
    }

    /**
     * Create a single street segment
     */
    createStreet(x1, z1, x2, z2) {
        const streetWidth = 30;
        const sidewalkWidth = 4;

        // Main street surface
        const streetLength = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
        const streetGeometry = new THREE.PlaneGeometry(streetWidth, streetLength);
        const streetMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });

        const street = new THREE.Mesh(streetGeometry, streetMaterial);
        street.rotation.x = -Math.PI / 2;
        street.receiveShadow = true;

        // Position street at midpoint
        street.position.x = (x1 + x2) / 2;
        street.position.z = (z1 + z2) / 2;
        street.position.y = 0.01; // Slightly above ground to avoid z-fighting

        // Rotate to align with direction
        const angle = Math.atan2(z2 - z1, x2 - x1);
        street.rotation.z = -angle + Math.PI / 2;

        this.terrainGroup.add(street);

        // Left sidewalk
        const sidewalkGeometry = new THREE.PlaneGeometry(sidewalkWidth, streetLength);
        const sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });

        const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        leftSidewalk.rotation.x = -Math.PI / 2;
        leftSidewalk.position.x = (x1 + x2) / 2 + (streetWidth / 2 + sidewalkWidth / 2) * Math.cos(angle);
        leftSidewalk.position.z = (z1 + z2) / 2 + (streetWidth / 2 + sidewalkWidth / 2) * Math.sin(angle);
        leftSidewalk.position.y = 0.02;
        leftSidewalk.rotation.z = -angle + Math.PI / 2;
        leftSidewalk.receiveShadow = true;

        this.terrainGroup.add(leftSidewalk);

        // Right sidewalk
        const rightSidewalk = leftSidewalk.clone();
        rightSidewalk.position.x = (x1 + x2) / 2 - (streetWidth / 2 + sidewalkWidth / 2) * Math.cos(angle);
        rightSidewalk.position.z = (z1 + z2) / 2 - (streetWidth / 2 + sidewalkWidth / 2) * Math.sin(angle);

        this.terrainGroup.add(rightSidewalk);
    }

    /**
     * Create buildings in the world
     */
    createBuildings() {
        const blockSize = 200;
        const gridSize = 10;
        const gridExtent = blockSize * gridSize;
        const buildingPadding = 10;

        for (let bx = 0; bx < gridSize; bx++) {
            for (let bz = 0; bz < gridSize; bz++) {
                // Random decision to place building
                if (Math.random() > 0.3) {
                    const x = -gridExtent / 2 + bx * blockSize + blockSize / 2;
                    const z = -gridExtent / 2 + bz * blockSize + blockSize / 2;

                    // Vary building size
                    const width = 40 + Math.random() * 60;
                    const depth = 40 + Math.random() * 60;
                    const height = 30 + Math.random() * 100;

                    // Vary color slightly for visual interest
                    const colors = [0xcccccc, 0xdddddd, 0xbbbbbb, 0xb0b0b0, 0xc5c5c5];
                    const color = colors[Math.floor(Math.random() * colors.length)];

                    this.createBuilding(x, z, width, depth, height, color);
                }
            }
        }

        console.log('[WorldBuilder] Buildings created');
    }

    /**
     * Create a single building
     */
    createBuilding(x, z, width, depth, height, color) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshLambertMaterial({ color });

        const building = new THREE.Mesh(geometry, material);
        building.position.set(x, height / 2, z);
        building.castShadow = true;
        building.receiveShadow = true;

        this.buildingsGroup.add(building);

        // Add collider box (axis-aligned)
        const collider = {
            type: 'box',
            x: x,
            z: z,
            width: width,
            depth: depth,
            height: height
        };
        this.colliders.push(collider);
    }

    /**
     * Create a simple skybox
     */
    createSkybox() {
        // Create a large sphere as sky dome
        const skyGeometry = new THREE.SphereGeometry(1500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        sky.name = 'skybox';
        this.scene.add(sky);

        console.log('[WorldBuilder] Skybox created');
    }

    /**
     * Get all colliders
     */
    getColliders() {
        return this.colliders;
    }

    /**
     * Check collision with buildings (simplified AABB check)
     */
    checkCollision(position, radius = 10) {
        for (const collider of this.colliders) {
            if (this.aabbCollision(position, radius, collider)) {
                return collider;
            }
        }
        return null;
    }

    /**
     * Simple AABB (Axis-Aligned Bounding Box) collision check
     */
    aabbCollision(pos, radius, collider) {
        const halfWidth = collider.width / 2;
        const halfDepth = collider.depth / 2;

        return (
            pos.x + radius > collider.x - halfWidth &&
            pos.x - radius < collider.x + halfWidth &&
            pos.z + radius > collider.z - halfDepth &&
            pos.z - radius < collider.z + halfDepth &&
            pos.y < collider.height
        );
    }

    /**
     * Update sky color dynamically (called by DayNightCycle)
     */
    updateSkyColor(color) {
        const skybox = this.scene.getObjectByName('skybox');
        if (skybox) {
            skybox.material.color.copy(color);
        }
    }

    /**
     * Get all buildings for optimization/culling
     */
    getBuildings() {
        return this.buildingsGroup.children;
    }

    /**
     * Get terrain group
     */
    getTerrainGroup() {
        return this.terrainGroup;
    }

    /**
     * Get buildings group
     */
    getBuildingsGroup() {
        return this.buildingsGroup;
    }
}
