/**
 * main.js
 * Entry point for the Three.js game sub-app.
 * Initializes all core systems and bootstraps the 3D world.
 */

import { Engine } from './core/Engine.js';
import { InputMapper } from './core/InputMapper.js';
import { DayNightCycle } from './lighting/DayNightCycle.js';
import { WorldBuilder } from './world/WorldBuilder.js';
import { PlayerController } from './player/PlayerController.js';

// Global state
let engine;
let inputMapper;
let dayNightCycle;
let worldBuilder;
let playerController;
let lastFpsUpdate = 0;

/**
 * Initialize the game
 */
async function initializeGame() {
    console.log('[Game] Initializing...');

    // Get canvas
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('[Game] Canvas not found!');
        return;
    }

    // Create Three.js scene, camera, and engine
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 1500, 500);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    // Initialize engine
    engine = new Engine(canvas, scene, camera);
    engine.initRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
    });

    // Initialize input mapper
    inputMapper = new InputMapper();

    // Initialize world
    worldBuilder = new WorldBuilder(scene);
    worldBuilder.build();

    // Initialize day-night cycle
    dayNightCycle = new DayNightCycle(scene, {
        startHour: 12,
        startMinute: 0,
        gameHoursPerRealMinute: 12
    });

    // Integrate day-night cycle with world
    dayNightCycle.onUpdate((state) => {
        worldBuilder.updateSkyColor(state.skyColor);
    });

    // Initialize player controller
    playerController = new PlayerController(camera, inputMapper, worldBuilder);

    // Setup engine callbacks
    engine.onUpdate((deltaTime, elapsedTime) => {
        dayNightCycle.update(deltaTime);
        playerController.update(deltaTime);
    });

    engine.onRender((deltaTime) => {
        // Additional render-time updates can go here
    });

    // Setup window resize handler
    window.addEventListener('resize', () => {
        engine.onWindowResize();
    });

    // Setup HUD updates
    updateHUD();
    setInterval(updateHUD, 100);

    // Setup back button
    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    // Hide loading screen and start engine
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }

    engine.start();

    console.log('[Game] Initialization complete');
}

/**
 * Update HUD display
 */
function updateHUD() {
    // Update FPS counter
    const fpsCounter = document.getElementById('fps-counter');
    if (fpsCounter) {
        fpsCounter.textContent = engine.getFPS();
    }

    // Update time display
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = dayNightCycle.formatGameTime();
    }
}

/**
 * Handle page visibility change (pause when not visible)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('[Game] Page hidden');
    } else {
        console.log('[Game] Page visible');
    }
});

// Ensure Three.js is loaded before initializing
function waitForThreeJS(callback) {
    if (typeof THREE !== 'undefined') {
        callback();
    } else {
        setTimeout(() => waitForThreeJS(callback), 50);
    }
}

// Add script tag for Three.js if not already present
if (typeof THREE === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
        console.log('[Game] Three.js loaded');
        waitForThreeJS(initializeGame);
    };
    document.head.appendChild(script);
} else {
    waitForThreeJS(initializeGame);
}
