/**
 * Engine.js
 * Core render and update loop manager for the 3D world.
 * Handles frame timing, performance, and focus state management.
 */

export class Engine {
    constructor(canvas, scene, camera) {
        this.canvas = canvas;
        this.scene = scene;
        this.camera = camera;
        this.renderer = null;
        this.clock = null;
        this.isRunning = false;
        this.isFocused = true;

        // Performance tracking
        this.frameCount = 0;
        this.fps = 60;
        this.deltaTime = 0;
        this.lastFrameTime = performance.now();

        // Update callbacks
        this.updateCallbacks = [];
        this.renderCallbacks = [];

        // Document focus handlers
        this.setupFocusHandlers();

        console.log('[Engine] Initialized');
    }

    /**
     * Initialize the Three.js renderer
     */
    initRenderer(options = {}) {
        const {
            antialias = true,
            alpha = false,
            powerPreference = 'high-performance'
        } = options;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias,
            alpha,
            powerPreference
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

        this.clock = new THREE.Clock();

        console.log('[Engine] Renderer initialized with size:', {
            width: window.innerWidth,
            height: window.innerHeight,
            dpr: window.devicePixelRatio
        });

        return this.renderer;
    }

    /**
     * Register an update callback (called every frame)
     */
    onUpdate(callback) {
        this.updateCallbacks.push(callback);
    }

    /**
     * Register a render callback (called after update)
     */
    onRender(callback) {
        this.renderCallbacks.push(callback);
    }

    /**
     * Start the render loop
     */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.clock.start();
        console.log('[Engine] Render loop started');

        this.animate();
    }

    /**
     * Stop the render loop
     */
    stop() {
        this.isRunning = false;
        console.log('[Engine] Render loop stopped');
    }

    /**
     * Main animation loop
     */
    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.animate());

        // Skip rendering if page is not focused (performance optimization)
        if (!this.isFocused) {
            return;
        }

        // Calculate delta time
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Update FPS counter
        this.frameCount++;
        if (this.frameCount % 30 === 0) {
            this.fps = Math.round(1 / this.deltaTime);
        }

        // Execute update callbacks
        for (const callback of this.updateCallbacks) {
            callback(this.deltaTime, this.clock.getElapsedTime());
        }

        // Execute render callbacks
        for (const callback of this.renderCallbacks) {
            callback(this.deltaTime);
        }

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);

        console.log('[Engine] Resized to:', { width, height });
    }

    /**
     * Setup document focus/blur handlers
     */
    setupFocusHandlers() {
        window.addEventListener('focus', () => {
            this.isFocused = true;
            console.log('[Engine] Window focused - resuming render loop');
        });

        window.addEventListener('blur', () => {
            this.isFocused = false;
            console.log('[Engine] Window blurred - pausing render loop');
        });
    }

    /**
     * Get current FPS
     */
    getFPS() {
        return this.fps;
    }

    /**
     * Get current delta time
     */
    getDeltaTime() {
        return this.deltaTime;
    }
}
