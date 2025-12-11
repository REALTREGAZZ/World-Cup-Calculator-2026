/**
 * DayNightCycle.js
 * Manages dynamic lighting and sky colors throughout a 24-hour game day.
 * 5 real minutes = 1 game hour, providing smooth transitions.
 */

export class DayNightCycle {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.ambientLight = null;
        this.directionalLight = null;
        this.skyColor = new THREE.Color();
        this.groundColor = new THREE.Color();

        // Configuration
        this.gameHoursPerRealMinute = config.gameHoursPerRealMinute || 12; // 5 real mins = 60 game mins
        this.currentGameHour = config.startHour || 12; // Start at noon
        this.currentGameMinute = config.startMinute || 0;

        // Start time in real seconds
        this.startTime = performance.now() / 1000;
        this.elapsedTime = 0;

        // Callbacks
        this.callbacks = [];

        // Color palettes for different times of day
        this.createLightingPalette();

        // Create lights
        this.createLights();

        console.log('[DayNightCycle] Initialized. Start time: ' + this.formatGameTime());
    }

    /**
     * Create lighting palette for different times of day
     */
    createLightingPalette() {
        // Define color and intensity for each hour
        this.palette = {
            0: { // Midnight
                skyColor: new THREE.Color(0x0a0e27),
                groundColor: new THREE.Color(0x0f1130),
                ambientIntensity: 0.2,
                directionalIntensity: 0.1,
                directionalColor: 0x1a3a52,
                fogColor: 0x0a0e27,
                fogDensity: 0.008
            },
            3: { // Early morning (dark)
                skyColor: new THREE.Color(0x1a2a4a),
                groundColor: new THREE.Color(0x1a2540),
                ambientIntensity: 0.25,
                directionalIntensity: 0.15,
                directionalColor: 0x2a4a6a,
                fogColor: 0x1a2a4a,
                fogDensity: 0.006
            },
            6: { // Dawn
                skyColor: new THREE.Color(0x2a5a8a),
                groundColor: new THREE.Color(0x4a6a8a),
                ambientIntensity: 0.4,
                directionalIntensity: 0.5,
                directionalColor: 0xffaa44,
                fogColor: 0x5a7a9a,
                fogDensity: 0.004
            },
            9: { // Morning
                skyColor: new THREE.Color(0x6ba3d5),
                groundColor: new THREE.Color(0x8abcd5),
                ambientIntensity: 0.7,
                directionalIntensity: 0.8,
                directionalColor: 0xffffff,
                fogColor: 0x7ab5d5,
                fogDensity: 0.0
            },
            12: { // Noon (brightest)
                skyColor: new THREE.Color(0x87ceeb),
                groundColor: new THREE.Color(0xb0d5e8),
                ambientIntensity: 0.9,
                directionalIntensity: 1.0,
                directionalColor: 0xffffff,
                fogColor: 0x87ceeb,
                fogDensity: 0.0
            },
            15: { // Afternoon
                skyColor: new THREE.Color(0x87ceeb),
                groundColor: new THREE.Color(0xb0d5e8),
                ambientIntensity: 0.8,
                directionalIntensity: 0.85,
                directionalColor: 0xffffff,
                fogColor: 0x87ceeb,
                fogDensity: 0.0
            },
            18: { // Evening (sunset)
                skyColor: new THREE.Color(0xd5744a),
                groundColor: new THREE.Color(0xd5865a),
                ambientIntensity: 0.5,
                directionalIntensity: 0.6,
                directionalColor: 0xff8844,
                fogColor: 0xc5654a,
                fogDensity: 0.003
            },
            21: { // Night (early)
                skyColor: new THREE.Color(0x1a2a5a),
                groundColor: new THREE.Color(0x0f1a3a),
                ambientIntensity: 0.3,
                directionalIntensity: 0.2,
                directionalColor: 0x3a5a9a,
                fogColor: 0x1a2a5a,
                fogDensity: 0.007
            }
        };
    }

    /**
     * Create lights in the scene
     */
    createLights() {
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(this.ambientLight);

        // Directional light (sun/moon)
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(100, 150, 50);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.far = 500;
        this.directionalLight.shadow.camera.left = -250;
        this.directionalLight.shadow.camera.right = 250;
        this.directionalLight.shadow.camera.top = 250;
        this.directionalLight.shadow.camera.bottom = -250;
        this.directionalLight.shadow.bias = -0.0001;
        this.scene.add(this.directionalLight);

        console.log('[DayNightCycle] Lights created');
    }

    /**
     * Update the day-night cycle based on elapsed time
     */
    update(deltaTime) {
        this.elapsedTime += deltaTime;

        // Calculate game hours based on elapsed real time
        const realMinutesElapsed = this.elapsedTime / 60;
        const gameHoursElapsed = realMinutesElapsed * this.gameHoursPerRealMinute;

        this.currentGameHour = (12 + Math.floor(gameHoursElapsed)) % 24;
        this.currentGameMinute = Math.floor((gameHoursElapsed % 1) * 60);

        // Update lighting
        this.updateLighting();
    }

    /**
     * Update lighting based on current game time
     */
    updateLighting() {
        const hour = this.currentGameHour;
        const minute = this.currentGameMinute;
        const timeProgress = (hour + minute / 60) / 24; // 0 to 1

        // Find surrounding palette times
        const paletteHours = Object.keys(this.palette).map(Number).sort((a, b) => a - b);
        let hour1, hour2, t;

        // Find the two hours we're between
        for (let i = 0; i < paletteHours.length - 1; i++) {
            const h1 = paletteHours[i];
            const h2 = paletteHours[i + 1];

            if (hour >= h1 && hour < h2) {
                hour1 = h1;
                hour2 = h2;
                t = (hour + minute / 60 - h1) / (h2 - h1);
                break;
            }
        }

        // If we're past the last palette hour, wrap to the first
        if (hour1 === undefined) {
            const lastHour = paletteHours[paletteHours.length - 1];
            const firstHour = paletteHours[0];
            hour1 = lastHour;
            hour2 = firstHour + 24;
            t = (hour + minute / 60 - hour1) / (hour2 - hour1);
        }

        const palette1 = this.palette[hour1];
        const palette2 = this.palette[hour2 % 24] || this.palette[paletteHours[0]];

        // Interpolate lighting values
        const interpolate = (color1, color2, factor) => {
            const c1 = new THREE.Color(color1);
            const c2 = new THREE.Color(color2);
            return c1.lerp(c2, factor);
        };

        const interpolateValue = (v1, v2, factor) => {
            return v1 + (v2 - v1) * factor;
        };

        // Apply interpolated values
        this.ambientLight.intensity = interpolateValue(
            palette1.ambientIntensity,
            palette2.ambientIntensity,
            t
        );

        this.directionalLight.intensity = interpolateValue(
            palette1.directionalIntensity,
            palette2.directionalIntensity,
            t
        );

        this.directionalLight.color = interpolate(
            palette1.directionalColor,
            palette2.directionalColor,
            t
        );

        this.skyColor = interpolate(
            palette1.skyColor,
            palette2.skyColor,
            t
        );

        this.groundColor = interpolate(
            palette1.groundColor,
            palette2.groundColor,
            t
        );

        // Update sun/moon position based on time of day
        const sunAngle = (timeProgress * Math.PI * 2) - Math.PI / 2;
        const sunDistance = 150;
        this.directionalLight.position.x = Math.cos(sunAngle) * sunDistance;
        this.directionalLight.position.y = Math.sin(sunAngle) * sunDistance + 100;

        // Trigger callbacks
        this.triggerCallbacks();
    }

    /**
     * Trigger all registered callbacks with current state
     */
    triggerCallbacks() {
        this.callbacks.forEach(callback => {
            callback({
                hour: this.currentGameHour,
                minute: this.currentGameMinute,
                skyColor: this.skyColor,
                groundColor: this.groundColor,
                ambientIntensity: this.ambientLight.intensity,
                directionalIntensity: this.directionalLight.intensity
            });
        });
    }

    /**
     * Register a callback for time/lighting changes
     */
    onUpdate(callback) {
        this.callbacks.push(callback);
    }

    /**
     * Get current game time formatted as HH:MM
     */
    formatGameTime() {
        const h = String(this.currentGameHour).padStart(2, '0');
        const m = String(this.currentGameMinute).padStart(2, '0');
        return `${h}:${m}`;
    }

    /**
     * Set game time directly
     */
    setGameTime(hour, minute = 0) {
        this.currentGameHour = hour % 24;
        this.currentGameMinute = minute % 60;
        this.updateLighting();
    }

    /**
     * Get sky background color
     */
    getSkyColor() {
        return this.skyColor;
    }

    /**
     * Get ground color
     */
    getGroundColor() {
        return this.groundColor;
    }

    /**
     * Get current game hour
     */
    getHour() {
        return this.currentGameHour;
    }

    /**
     * Get current game minute
     */
    getMinute() {
        return this.currentGameMinute;
    }
}
