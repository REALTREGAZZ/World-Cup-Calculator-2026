/**
 * InputMapper.js
 * Handles configurable key bindings and input management.
 * Supports customizable WASD/arrow key bindings via JSON config.
 */

export class InputMapper {
    constructor(config = null) {
        this.config = config || this.getDefaultConfig();
        this.keyState = {};
        this.inputCallbacks = {};

        // Initialize key state
        this.initializeKeyState();

        // Setup keyboard listeners
        this.setupKeyboardListeners();

        // Setup mouse listeners
        this.setupMouseListeners();

        console.log('[InputMapper] Initialized with config:', this.config);
    }

    /**
     * Get default key bindings configuration
     */
    getDefaultConfig() {
        return {
            moveForward: ['w', 'arrowup'],
            moveBackward: ['s', 'arrowdown'],
            moveLeft: ['a', 'arrowleft'],
            moveRight: ['d', 'arrowright'],
            jump: [' '],
            sprint: ['shift']
        };
    }

    /**
     * Initialize key state for all bound keys
     */
    initializeKeyState() {
        Object.values(this.config).forEach(keys => {
            keys.forEach(key => {
                this.keyState[key.toLowerCase()] = false;
            });
        });
    }

    /**
     * Setup keyboard event listeners
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keyState[key] = true;

            // Trigger action callbacks
            this.triggerActionForKey(key, true);
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keyState[key] = false;

            // Trigger action callbacks
            this.triggerActionForKey(key, false);
        });
    }

    /**
     * Setup mouse event listeners
     */
    setupMouseListeners() {
        document.addEventListener('mousemove', (e) => {
            this.triggerCallback('mousemove', {
                movementX: e.movementX,
                movementY: e.movementY,
                clientX: e.clientX,
                clientY: e.clientY
            });
        });

        document.addEventListener('click', (e) => {
            this.triggerCallback('click', {
                clientX: e.clientX,
                clientY: e.clientY
            });
        });
    }

    /**
     * Trigger callbacks for a given key press
     */
    triggerActionForKey(key, isPressed) {
        for (const [action, keys] of Object.entries(this.config)) {
            if (keys.includes(key.toLowerCase())) {
                this.triggerCallback(action, { pressed: isPressed, key });
            }
        }
    }

    /**
     * Register a callback for a specific action/input
     */
    registerCallback(action, callback) {
        if (!this.inputCallbacks[action]) {
            this.inputCallbacks[action] = [];
        }
        this.inputCallbacks[action].push(callback);
    }

    /**
     * Unregister a callback
     */
    unregisterCallback(action, callback) {
        if (this.inputCallbacks[action]) {
            const index = this.inputCallbacks[action].indexOf(callback);
            if (index > -1) {
                this.inputCallbacks[action].splice(index, 1);
            }
        }
    }

    /**
     * Trigger all callbacks for an action
     */
    triggerCallback(action, data) {
        if (this.inputCallbacks[action]) {
            this.inputCallbacks[action].forEach(callback => {
                callback(data);
            });
        }
    }

    /**
     * Check if a key is currently pressed
     */
    isKeyPressed(key) {
        return this.keyState[key.toLowerCase()] || false;
    }

    /**
     * Check if any key for an action is pressed
     */
    isActionPressed(action) {
        const keys = this.config[action];
        if (!keys) return false;
        return keys.some(key => this.isKeyPressed(key));
    }

    /**
     * Get all currently pressed keys
     */
    getPressedKeys() {
        return Object.keys(this.keyState).filter(key => this.keyState[key]);
    }

    /**
     * Rebind a key for an action
     */
    rebindKey(action, newKeys) {
        if (Array.isArray(newKeys)) {
            this.config[action] = newKeys.map(k => k.toLowerCase());
        } else {
            this.config[action] = [newKeys.toLowerCase()];
        }
        console.log('[InputMapper] Rebound action:', action, 'to', this.config[action]);
    }

    /**
     * Load config from JSON
     */
    loadConfig(jsonConfig) {
        try {
            const parsed = typeof jsonConfig === 'string' ? JSON.parse(jsonConfig) : jsonConfig;
            this.config = parsed;
            this.initializeKeyState();
            console.log('[InputMapper] Config loaded:', this.config);
        } catch (e) {
            console.error('[InputMapper] Failed to load config:', e);
        }
    }

    /**
     * Export current config as JSON
     */
    exportConfig() {
        return JSON.stringify(this.config, null, 2);
    }

    /**
     * Reset to default config
     */
    resetToDefault() {
        this.config = this.getDefaultConfig();
        this.initializeKeyState();
        console.log('[InputMapper] Reset to default config');
    }
}
