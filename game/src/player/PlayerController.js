/**
 * PlayerController.js
 * Manages player character movement, camera control, and collision handling.
 */

export class PlayerController {
    constructor(camera, inputMapper, worldBuilder) {
        this.camera = camera;
        this.inputMapper = inputMapper;
        this.worldBuilder = worldBuilder;

        // Player state
        this.position = new THREE.Vector3(0, 1.6, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3(0, 0, -1);
        this.right = new THREE.Vector3(1, 0, 0);

        // Physics
        this.speed = 10; // m/s
        this.sprintMultiplier = 1.5;
        this.jumpForce = 8;
        this.gravity = 20;
        this.isOnGround = true;
        this.playerRadius = 0.5;

        // Camera
        this.pitch = 0;
        this.yaw = 0;
        this.mouseSensitivity = 0.005;

        // Input state
        this.setupInputHandlers();

        console.log('[PlayerController] Initialized');
    }

    /**
     * Setup input handlers
     */
    setupInputHandlers() {
        // Lock pointer on click
        document.addEventListener('click', () => {
            document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
            document.body.requestPointerLock();
        });

        // Mouse movement for camera
        this.inputMapper.registerCallback('mousemove', (data) => {
            if (document.pointerLockElement === document.body) {
                this.yaw -= data.movementX * this.mouseSensitivity;
                this.pitch -= data.movementY * this.mouseSensitivity;

                // Clamp pitch to prevent camera flipping
                this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));

                this.updateCameraRotation();
            }
        });

        // Jump on space
        this.inputMapper.registerCallback('jump', (data) => {
            if (data.pressed && this.isOnGround) {
                this.velocity.y = this.jumpForce;
                this.isOnGround = false;
            }
        });
    }

    /**
     * Update player state
     */
    update(deltaTime) {
        // Get movement input
        const moveForward = this.inputMapper.isActionPressed('moveForward') ? 1 : 0;
        const moveBackward = this.inputMapper.isActionPressed('moveBackward') ? 1 : 0;
        const moveLeft = this.inputMapper.isActionPressed('moveLeft') ? 1 : 0;
        const moveRight = this.inputMapper.isActionPressed('moveRight') ? 1 : 0;
        const isSprinting = this.inputMapper.isActionPressed('sprint') ? 1 : 0;

        // Calculate movement vector
        const moveDir = new THREE.Vector3(0, 0, 0);
        moveDir.add(this.direction.clone().multiplyScalar(moveForward - moveBackward));
        moveDir.add(this.right.clone().multiplyScalar(moveRight - moveLeft));

        // Normalize movement (prevent diagonal speed boost)
        if (moveDir.length() > 0) {
            moveDir.normalize();
        }

        // Apply speed and sprint
        let currentSpeed = this.speed;
        if (isSprinting) {
            currentSpeed *= this.sprintMultiplier;
        }

        // Update velocity (XZ plane only for movement)
        this.velocity.x = moveDir.x * currentSpeed;
        this.velocity.z = moveDir.z * currentSpeed;

        // Apply gravity
        if (!this.isOnGround) {
            this.velocity.y -= this.gravity * deltaTime;
        }

        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // Check ground collision
        const groundY = 1.6;
        if (this.position.y < groundY) {
            this.position.y = groundY;
            this.velocity.y = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }

        // Check world collision
        const collision = this.worldBuilder.checkCollision(
            new THREE.Vector3(this.position.x, this.position.y - 0.8, this.position.z),
            this.playerRadius
        );

        if (collision) {
            // Simple collision response - push player out of building
            this.resolveCollision(collision);
        }

        // Constrain player to world bounds
        const worldBound = 900;
        this.position.x = Math.max(-worldBound, Math.min(worldBound, this.position.x));
        this.position.z = Math.max(-worldBound, Math.min(worldBound, this.position.z));

        // Update camera
        this.updateCamera();
    }

    /**
     * Resolve collision with world objects
     */
    resolveCollision(collider) {
        // Simple push-out resolution
        const toPlayer = new THREE.Vector2(
            this.position.x - collider.x,
            this.position.z - collider.z
        );

        const halfWidth = collider.width / 2;
        const halfDepth = collider.depth / 2;

        // Find closest edge
        const overlapX = (halfWidth + this.playerRadius) - Math.abs(toPlayer.x);
        const overlapZ = (halfDepth + this.playerRadius) - Math.abs(toPlayer.z);

        if (overlapX > 0 && overlapZ > 0) {
            if (overlapX < overlapZ) {
                // Push on X axis
                this.position.x += toPlayer.x > 0 ? overlapX : -overlapX;
                this.velocity.x = 0;
            } else {
                // Push on Z axis
                this.position.z += toPlayer.y > 0 ? overlapZ : -overlapZ;
                this.velocity.z = 0;
            }
        }
    }

    /**
     * Update camera rotation
     */
    updateCameraRotation() {
        // Update direction based on yaw
        this.direction.x = Math.sin(this.yaw);
        this.direction.z = -Math.cos(this.yaw);
        this.direction.normalize();

        // Update right vector (perpendicular to direction)
        this.right.x = Math.sin(this.yaw + Math.PI / 2);
        this.right.z = -Math.cos(this.yaw + Math.PI / 2);
        this.right.normalize();
    }

    /**
     * Update camera position and rotation
     */
    updateCamera() {
        this.camera.position.copy(this.position);

        // Create camera look target
        const target = new THREE.Vector3(
            this.camera.position.x + this.direction.x,
            this.camera.position.y + Math.tan(this.pitch),
            this.camera.position.z + this.direction.z
        );

        this.camera.lookAt(target);
    }

    /**
     * Get player position
     */
    getPosition() {
        return this.position.clone();
    }

    /**
     * Set player position
     */
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        this.updateCamera();
    }

    /**
     * Get player velocity
     */
    getVelocity() {
        return this.velocity.clone();
    }
}
