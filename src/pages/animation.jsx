import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import './Animation.css'

function Animation({ onComplete = null }) {
  const containerRef = useRef();

  useEffect(() => {
    // Ensure container is available
    if (!containerRef.current) return;

    // Scene, Camera, Renderer
let renderer = new THREE.WebGLRenderer();
let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1500);
let cameraRotation = 0;
let cameraRotationSpeed = 0.005;
let cameraAutoRotation = true;
let orbitControls = new OrbitControls(camera, renderer.domElement);

// Responsive Mode Detection (viewport-based)
// Responsive Mode Detection
let isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let devicePixelRatio = Math.min(window.devicePixelRatio, isMobileDevice ? 1.5 : 2);

// We'll determine segments based on current tier in createPlanet or similar if needed, 
// but for simplicity we keep them static or tier-based.
let sphereSegments = 32;
let sphereDetailSegments = 16;

// Responsive Configuration
function getResponsiveConfig() {
  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width <= 1024;
  const isDesktop = width > 1024;

  if (isMobile) {
    return {
      tier: 'mobile',
      earthBaseScale: 0.5,
      earthMaxScale: 1.8,
      cameraStartPos: new THREE.Vector3(5.7, -3.0, -3.1),
      cameraEndPos: new THREE.Vector3(0.3, 0.7, 1.2),
      cameraStartFov: 50,
      cameraEndFov: 25,
      textSize: 0.028,
      textHeight: 0.006,
      textYOffset: 0.32,
      subtitleSize: 0.011,
      subtitleHeight: 0.003,
      landingZoneScale: 1.0,
      startAlt: 0.0,
      peakAlt: 0.4,
      endAlt: 0.05,
      isStacked: true,
      stackMainTitle: true // Stack INNOVATION and 2026
    };
  } else if (isTablet) {
    return {
      tier: 'tablet',
      earthBaseScale: 1.0,
      earthMaxScale: 3.5,
      cameraStartPos: new THREE.Vector3(5.7, -3.0, -3.1),
      cameraEndPos: new THREE.Vector3(0.3, 0.7, 1.2),
      cameraStartFov: 50,
      cameraEndFov: 25,
      textSize: 0.04,
      textHeight: 0.008,
      textYOffset: 0.36,
      subtitleSize: 0.016,
      subtitleHeight: 0.003,
      landingZoneScale: 0.8,
      startAlt: 0.0,
      peakAlt: 1.2,
      endAlt: 0.05,
      isStacked: true,
      stackMainTitle: true // Stack INNOVATION and 2026
    };
  } else {
    // Desktop
    return {
      tier: 'desktop',
      earthBaseScale: 1.0,
      earthMaxScale: 3.5,
      cameraStartPos: new THREE.Vector3(5.7, -3.0, -3.1),
      cameraEndPos: new THREE.Vector3(0.3, 0.7, 1.2),
      cameraStartFov: 50,
      cameraEndFov: 25,
      textSize: 0.07,
      textHeight: 0.012,
      textYOffset: 0.38,
      subtitleSize: 0.035,
      subtitleHeight: 0.006,
      landingZoneScale: 1.0,
      startAlt: 0.0,
      peakAlt: 1.2,
      endAlt: 0.05,
      isStacked: false,
      stackMainTitle: false // Keep INNOVATION 2026 on one line
    };
  }
}

let responsiveConfig = getResponsiveConfig();

let spotLight = new THREE.SpotLight(0xffffff, 15, 0, 10, 2);
let ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Bright ambient light
let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5); // Sky and ground light

// Subtle light below launchpad
let launchpadLight = new THREE.PointLight(0x00ffff, 1.5, 0.5);
launchpadLight.position.set(0, 0.3, 0); // Below the launchpad

// Texture Loader
let textureLoader = new THREE.TextureLoader();

// Planet Proto
let planetProto = {
  sphere: function (size) {
    let sphere = new THREE.SphereGeometry(size, sphereSegments, sphereSegments);

    return sphere;
  },
  material: function (options) {
    let material = new THREE.MeshPhongMaterial();
    if (options) {
      for (var property in options) {
        material[property] = options[property];
      }
    }

    return material;
  },
  glowMaterial: function (intensity, fade, color) {
    // Custom glow shader from https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js
    let glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        'c': {
          value: intensity
        },
        'p': {
          value: fade
        },
        glowColor: {
          value: new THREE.Color(color)
        },
        viewVector: {
          value: camera.position
        }
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
    
        void main() {
          vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * viewVector );
          intensity = pow( c - dot(vNormal, vNormel), p );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`
      ,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() 
        {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, 1.0 );
        }`
      ,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    return glowMaterial;
  },
  texture: function (material, property, uri) {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = true;
    textureLoader.load(
      uri,
      function (texture) {
        material[property] = texture;
        material.needsUpdate = true;
      }
    );
  }
};

let createPlanet = function (options) {
  // Create the planet's Surface
  let surfaceGeometry = planetProto.sphere(options.surface.size);
  let surfaceMaterial = planetProto.material(options.surface.material);
  let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

  // Create the planet's Atmosphere
  let atmosphereGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size);
  let atmosphereMaterialDefaults = {
    side: THREE.DoubleSide,
    transparent: true
  }
  let atmosphereMaterialOptions = Object.assign(atmosphereMaterialDefaults, options.atmosphere.material);
  let atmosphereMaterial = planetProto.material(atmosphereMaterialOptions);
  let atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

  // Create the planet's Atmospheric glow
  let atmosphericGlowGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size + options.atmosphere.glow.size);
  let atmosphericGlowMaterial = planetProto.glowMaterial(options.atmosphere.glow.intensity, options.atmosphere.glow.fade, options.atmosphere.glow.color);
  let atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);

  // Nest the planet's Surface and Atmosphere into a planet object
  let planet = new THREE.Object3D();
  surface.name = 'surface';
  atmosphere.name = 'atmosphere';
  atmosphericGlow.name = 'atmosphericGlow';
  planet.add(surface);
  planet.add(atmosphere);
  planet.add(atmosphericGlow);

  // Load the Surface's textures
  for (let textureProperty in options.surface.textures) {
    planetProto.texture(
      surfaceMaterial,
      textureProperty,
      options.surface.textures[textureProperty]
    );
  }

  // Load the Atmosphere's texture
  for (let textureProperty in options.atmosphere.textures) {
    planetProto.texture(
      atmosphereMaterial,
      textureProperty,
      options.atmosphere.textures[textureProperty]
    );
  }

  return planet;
};

let earth = createPlanet({
  surface: {
    size: 0.5,
    material: {
      bumpScale: 0.05,
      specular: new THREE.Color('grey'),
      shininess: 10
    },
    textures: {
      map: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg',
      bumpMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthbump1k.jpg',
      specularMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthspec1k.jpg'
    }
  },
  atmosphere: {
    size: 0.003,
    material: {
      opacity: 0.8
    },
    textures: {
      map: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmap.jpg',
      alphaMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmaptrans.jpg'
    },
    glow: {
      size: 0.05, // Enhanced for a soft halo
      intensity: 0.6, // Increased intensity
      fade: 5,
      color: 0x93cfef
    }
  },
});

// Create a subtle glow sphere around Earth
let earthGlowGeometry = new THREE.SphereGeometry(0.48, 32, 32); // Reduced radius for glow
let earthGlowMaterial = new THREE.MeshBasicMaterial({
  color: 0x93cfef,
  transparent: true,
  opacity: 0.45, // Increased opacity for stronger glow
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending
});
let earthGlow = new THREE.Mesh(earthGlowGeometry, earthGlowMaterial);
earthGlow.renderOrder = 1;
earth.add(earthGlow);

// Marker Proto
let markerProto = {
  latLongToVector3: function latLongToVector3(latitude, longitude, radius, height) {
    var phi = (latitude) * Math.PI / 180;
    var theta = (longitude - 180) * Math.PI / 180;

    var x = -(radius + height) * Math.cos(phi) * Math.cos(theta);
    var y = (radius + height) * Math.sin(phi);
    var z = (radius + height) * Math.cos(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  },
  marker: function marker(size, color, vector3Position) {
    let markerGeometry = new THREE.SphereGeometry(size);
    let markerMaterial = new THREE.MeshLambertMaterial({
      color: color
    });
    let markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
    markerMesh.position.copy(vector3Position);

    return markerMesh;
  }
}

// Place Marker
let placeMarker = function (object, options) {
  let position = markerProto.latLongToVector3(options.latitude, options.longitude, options.radius, options.height);
  let marker = markerProto.marker(options.size, options.color, position);
  object.add(marker);
}

// Place Marker At Address
let placeMarkerAtAddress = function (address, color) {
  let encodedLocation = address.replace(/\s/g, '+');
  let httpRequest = new XMLHttpRequest();

  httpRequest.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedLocation);
  httpRequest.send(null);
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      let result = JSON.parse(httpRequest.responseText);

      if (result.results.length > 0) {
        let latitude = result.results[0].geometry.location.lat;
        let longitude = result.results[0].geometry.location.lng;

        placeMarker(earth.getObjectByName('surface'), {
          latitude: latitude,
          longitude: longitude,
          radius: 0.5,
          height: 0,
          size: 0.01,
          color: color,
        });
      }
    }
  };
}

// Drone Creation
let createDrone = function () {
  let droneGroup = new THREE.Group();

  // Main body - more detailed and realistic, brighter colors
  let bodyGeometry = new THREE.BoxGeometry(0.1, 0.06, 0.14);
  let bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x3a3a5e, // Brighter blue-grey
    shininess: 80,
    emissive: 0x2a2a4e // Brighter emissive
  });
  let body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  droneGroup.add(body);

  // Cockpit/Camera module - brighter
  let cockpitGeometry = new THREE.SphereGeometry(0.025, 32, 32);
  let cockpitMaterial = new THREE.MeshPhongMaterial({
    color: 0x6633ff, // Brighter purple
    shininess: 120,
    emissive: 0x4422ff, // Brighter emissive
    wireframe: false
  });
  let cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
  cockpit.position.set(0, 0.035, 0);
  cockpit.castShadow = true;
  droneGroup.add(cockpit);

  // Camera ring - brighter cyan
  let cameraRingGeometry = new THREE.TorusGeometry(0.028, 0.003, 16, 32);
  let cameraRingMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffff, // Bright cyan
    emissive: 0x0088aa, // Add emissive glow
    shininess: 120
  });
  let cameraRing = new THREE.Mesh(cameraRingGeometry, cameraRingMaterial);
  cameraRing.rotation.x = Math.PI / 4;
  cameraRing.position.set(0, 0.035, 0);
  droneGroup.add(cameraRing);

  // Create 4 arms with motors and propellers
  let armPositions = [
    { x: 0.07, z: 0.1, name: 'FR' },   // Front-right
    { x: -0.07, z: 0.1, name: 'FL' },  // Front-left
    { x: 0.07, z: -0.1, name: 'BR' },  // Back-right
    { x: -0.07, z: -0.1, name: 'BL' }  // Back-left
  ];

  armPositions.forEach(function (pos, index) {
    // Arm - carbon fiber look
    let armGeometry = new THREE.BoxGeometry(0.012, 0.012, 0.1);
    let armMaterial = new THREE.MeshPhongMaterial({
      color: 0x444455,
      shininess: 80
    });
    let arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.set(pos.x, -0.005, pos.z * 0.5);
    arm.castShadow = true;
    droneGroup.add(arm);

    // Motor housing - more detailed
    let motorGeometry = new THREE.CylinderGeometry(0.022, 0.022, 0.015, 32);
    let motorMaterial = new THREE.MeshPhongMaterial({
      color: 0x2a2a3e,
      shininess: 60
    });
    let motor = new THREE.Mesh(motorGeometry, motorMaterial);
    motor.position.set(pos.x, -0.012, pos.z);
    motor.castShadow = true;
    droneGroup.add(motor);

    // Motor center
    let motorCenterGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.008, 16);
    let motorCenterMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
    let motorCenter = new THREE.Mesh(motorCenterGeometry, motorCenterMaterial);
    motorCenter.position.set(pos.x, -0.008, pos.z);
    motorCenter.castShadow = true;
    droneGroup.add(motorCenter);

    // Propeller - more realistic with 2 blades
    let propellerGroup = new THREE.Group();
    propellerGroup.position.set(pos.x, 0, pos.z);

    for (let i = 0; i < 2; i++) {
      let propellerGeometry = new THREE.BoxGeometry(0.08, 0.005, 0.016);
      let propellerMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ccff,
        opacity: 0.85,
        transparent: true,
        shininess: 100
      });
      let propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller.position.y = -0.002;
      propeller.rotation.z = (Math.PI / 2) * i;
      propeller.castShadow = true;
      propellerGroup.add(propeller);
    }
    propellerGroup.userData.isRotating = true;
    droneGroup.add(propellerGroup);
  });

  // Landing gear
  let gearPositions = [
    { x: 0.055, z: 0.065 },
    { x: -0.055, z: 0.065 },
    { x: 0.055, z: -0.065 },
    { x: -0.055, z: -0.065 }
  ];

  gearPositions.forEach(function (pos) {
    let gearGeometry = new THREE.BoxGeometry(0.01, 0.06, 0.01);
    let gearMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      shininess: 40
    });
    let gear = new THREE.Mesh(gearGeometry, gearMaterial);
    gear.position.set(pos.x, -0.07, pos.z);
    gear.castShadow = true;
    droneGroup.add(gear);

    // Gear pads
    let padGeometry = new THREE.SphereGeometry(0.015, 16, 16);
    let padMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      shininess: 20
    });
    let pad = new THREE.Mesh(padGeometry, padMaterial);
    pad.position.set(pos.x, -0.105, pos.z);
    pad.castShadow = true;
    droneGroup.add(pad);
  });

  return droneGroup;
};

let drone = createDrone();
drone.position.set(0, 3, -2); // Start from space, behind and above Earth
drone.userData.flightStarted = false;
drone.userData.flightTime = 200; // Skip first second (60 frames at 60fps)
drone.userData.flightDuration = 600; // Faster flight duration for quicker landing
drone.userData.isFlightComplete = false;

// Camera animation state (responsive)
let cameraAnimationState = {
  startPos: responsiveConfig.cameraStartPos.clone(),
  endPos: responsiveConfig.cameraEndPos.clone(),
  startFov: responsiveConfig.cameraStartFov,
  endFov: responsiveConfig.cameraEndFov
};

// Procedural Starfield
function createStars() {
  const starGeo = new THREE.BufferGeometry();
  const starCount = 160000; // Increased count for dense starfield
  const posArray = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i++) {
    // Random position in a large sphere (radius ~90-120)
    // Use spherical coords to avoid clumping at center
    const r = 90 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    posArray[i] = r * Math.sin(phi) * Math.cos(theta);
    posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    posArray[i + 2] = r * Math.cos(phi);
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Create a circular texture for points
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  const starTexture = new THREE.CanvasTexture(canvas);

  const starMat = new THREE.PointsMaterial({
    size: 0.35, // Slightly larger for better circle visibility
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    map: starTexture, // Apply circular texture
    blending: THREE.AdditiveBlending,
    depthWrite: false, // Prevents star squares from clipping each other
    sizeAttenuation: true
  });

  const stars = new THREE.Points(starGeo, starMat);
  return stars;
}

let starField = createStars();
scene.add(starField);

// Scene, Camera, Renderer Configuration
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.antialias = !isMobileDevice; // Disable antialiasing on mobile for better performance
renderer.shadowMap.enabled = !isMobileDevice; // Disable shadows on mobile
if (containerRef.current) {
  containerRef.current.appendChild(renderer.domElement);
}


camera.position.copy(cameraAnimationState.startPos); // Match cameraAnimationState.startPos



camera.position.copy(cameraAnimationState.startPos); // Match cameraAnimationState.startPos
orbitControls.enabled = !cameraAutoRotation;

scene.add(camera);
scene.add(spotLight);
scene.add(ambientLight);
scene.add(hemisphereLight);
scene.add(launchpadLight);
scene.add(earth);
// Don't add procedural drone to scene - wait for external model to load
// scene.add(drone);

// Load external drone model (OBJ + MTL) from src/Drone_Costum
let externalDrone = null;
let droneAnimationState = {
  flightStarted: drone.userData.flightStarted,
  flightTime: drone.userData.flightTime,
  flightDuration: drone.userData.flightDuration,
  isFlightComplete: drone.userData.isFlightComplete,
  isLanding: drone.userData.isLanding,
  hasTriggeredLandingEffects: false
};

const mtlLoader = new MTLLoader();
mtlLoader.setResourcePath('/src/components/Animation/Drone_Costum/Material/');
mtlLoader.setPath('/src/components/Animation/Drone_Costum/Material/');
mtlLoader.load('drone_costum.mtl', function (materials) {
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/src/components/Animation/Drone_Costum/Material/');
  objLoader.load('drone_costum.obj', function (obj) {
    // scale and orient model to match scene units
    obj.scale.set(0.025, 0.025, 0.025);
    obj.rotation.x = Math.PI / 2;
    obj.position.copy(drone.position);

    // Transfer animation state to imported model
    obj.userData = droneAnimationState;

    // tag any propeller/blade meshes for rotation (names may vary)
    obj.traverse(function (child) {
      if (child.isMesh && /prop|blade|rotor|wing/i.test(child.name)) {
        child.userData.isRotating = true;
      }
    });

    // replace placeholder drone with imported model
    scene.remove(drone);
    drone = obj;
    scene.add(drone);
    externalDrone = obj;

    // Populate Launch Pad - Removed per user request
    if (landingZone) {
      // Custom drones loop removed
    }
  });
});

// Landing Zone Creation (Pad, Trees, Buildings)
let createLandingZone = function () {
  let zoneGroup = new THREE.Group();

  // 1. Main Platform/Pad (Reverted)
  let padGeometry = new THREE.CylinderGeometry(0.12, 0.1, 0.02, 32);
  let padMaterial = new THREE.MeshPhongMaterial({
    color: 0x444444,
    shininess: 30
  });
  let pad = new THREE.Mesh(padGeometry, padMaterial);
  pad.position.y = -0.005; // Relative to surface (r=0.5 -> 0.495)
  pad.receiveShadow = true;
  zoneGroup.add(pad);

  // Pad Ring (Emissive - Reverted)
  let ringGeometry = new THREE.TorusGeometry(0.08, 0.005, 16, 32);
  let ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  let ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.01; // Just above pad surface
  zoneGroup.add(ring);

  // Pad Glow Layer 1 (Inner glow)
  let padGlowGeo1 = new THREE.TorusGeometry(0.09, 0.01, 8, 32);
  let padGlowMat1 = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  let padGlow1 = new THREE.Mesh(padGlowGeo1, padGlowMat1);
  padGlow1.rotation.x = Math.PI / 2;
  padGlow1.position.y = -0.035;
  zoneGroup.add(padGlow1);

  // Pad Glow Layer 2 (Mid glow)
  let padGlowGeo2 = new THREE.TorusGeometry(0.125, 0.015, 8, 32);
  let padGlowMat2 = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  let padGlow2 = new THREE.Mesh(padGlowGeo2, padGlowMat2);
  padGlow2.rotation.x = Math.PI / 2;
  padGlow2.position.y = -0.05;
  zoneGroup.add(padGlow2);

  // Pad Glow Layer 3 (Outer glow - subtle)
  let padGlowGeo3 = new THREE.TorusGeometry(0.16, 0.02, 8, 32);
  let padGlowMat3 = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  let padGlow3 = new THREE.Mesh(padGlowGeo3, padGlowMat3);
  padGlow3.rotation.x = Math.PI / 2;
  padGlow3.position.y = -0.07;
  zoneGroup.add(padGlow3);

  // Side Glow Rings (Around the pad)
  // Ring 1 - Cyan glow ring
  let sideRing1Geo = new THREE.TorusGeometry(0.13, 0.008, 16, 32);
  let sideRing1Mat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  let sideRing1 = new THREE.Mesh(sideRing1Geo, sideRing1Mat);
  sideRing1.rotation.x = Math.PI / 2;
  sideRing1.position.y = -0.005;
  zoneGroup.add(sideRing1);

  // Ring 2 - Magenta accent ring (slightly larger)
  let sideRing2Geo = new THREE.TorusGeometry(0.145, 0.006, 16, 32);
  let sideRing2Mat = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });
  let sideRing2 = new THREE.Mesh(sideRing2Geo, sideRing2Mat);
  sideRing2.rotation.x = Math.PI / 2;
  sideRing2.position.y = -0.005;
  zoneGroup.add(sideRing2);

  // Ring 3 - Cyan outer ring
  let sideRing3Geo = new THREE.TorusGeometry(0.16, 0.01, 16, 32);
  let sideRing3Mat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  let sideRing3 = new THREE.Mesh(sideRing3Geo, sideRing3Mat);
  sideRing3.rotation.x = Math.PI / 2;
  sideRing3.position.y = -0.005;
  zoneGroup.add(sideRing3);

  // Shockwave Ring (Expansion effect on touchdown)
  let shockGeo = new THREE.TorusGeometry(0.05, 0.005, 8, 32);
  let shockMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0, // Starts invisible
    blending: THREE.AdditiveBlending
  });
  let shockwave = new THREE.Mesh(shockGeo, shockMat);
  shockwave.rotation.x = Math.PI / 2;
  shockwave.position.y = 0.01; // Relative to surface
  shockwave.name = 'shockwaveRing';
  zoneGroup.add(shockwave);

  // Apply responsive scale
  let s = responsiveConfig.landingZoneScale;
  zoneGroup.scale.set(s, s, s);

  return zoneGroup;
};

// Add Landing Zone to Earth Surface
let landingZone = createLandingZone();
landingZone.position.y = 0.5; // Position at the North Pole surface
earth.getObjectByName('surface').add(landingZone);

// Light Configurations
spotLight.position.set(2, 3, 1); // Higher position for better coverage

// Mesh Configurations
earth.receiveShadow = true;
earth.castShadow = true;
earth.getObjectByName('surface').geometry.center();

// Text Animation Logic
let textMesh = null;
let textAnimationTime = 0;
let renderStartTime = Date.now(); // Track when animation started
let shockwaveStartTime = null; // Track when shockwave animation starts

// Modern Three.js FontLoader
const fontLoader = new FontLoader();

// Load TT Supermolot Neue font
fontLoader.load(
  '/fonts/TT_Supermolot_Neue.json',
  function (font) {
    console.log('Font loaded successfully');

    const textGroup = new THREE.Group();
    
    if (responsiveConfig.stackMainTitle) {
      // Mobile/Tablet: 3 lines (INNOVATION, 2026, subtitle)
      // Create INNOVATION
      const geo1 = new TextGeometry('INNOVATION', {
        font: font,
        size: responsiveConfig.textSize,
        depth: responsiveConfig.textHeight,
        curveSegments: 8,
        bevelEnabled: false
      });
      geo1.center();
      
      const mat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0
      });
      
      const mesh1 = new THREE.Mesh(geo1, mat1);
      mesh1.position.y = responsiveConfig.textSize * 0.65;
      
      // Create 2026
      const geo2 = new TextGeometry('2026', {
        font: font,
        size: responsiveConfig.textSize,
        depth: responsiveConfig.textHeight,
        curveSegments: 8,
        bevelEnabled: false
      });
      geo2.center();
      
      const mat2 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0
      });
      
      const mesh2 = new THREE.Mesh(geo2, mat2);
      mesh2.position.y = -responsiveConfig.textSize * 0.55;
      
      // Create EQUINOX: POWERED BY PURPOSE
      const geo3 = new TextGeometry('EQUINOX: POWERED BY PURPOSE', {
        font: font,
        size: responsiveConfig.subtitleSize,
        depth: responsiveConfig.subtitleHeight,
        curveSegments: 8,
        bevelEnabled: false
      });
      geo3.center();
      
      const mat3 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0
      });
      
      const mesh3 = new THREE.Mesh(geo3, mat3);
      mesh3.position.y = -responsiveConfig.textSize * 1.5;
      
      textGroup.add(mesh1, mesh2, mesh3);
    } else {
      // Desktop: 2 lines (INNOVATION 2026, subtitle)
      // Create INNOVATION 2026 (single line)
      const geo1 = new TextGeometry('INNOVATION 2026', {
        font: font,
        size: responsiveConfig.textSize,
        depth: responsiveConfig.textHeight,
        curveSegments: 8,
        bevelEnabled: false
      });
      geo1.center();
      
      const mat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0
      });
      
      const mesh1 = new THREE.Mesh(geo1, mat1);
      mesh1.position.y = responsiveConfig.textSize * 0.6;
      
      // Create EQUINOX: POWERED BY PURPOSE
      const geo2 = new TextGeometry('EQUINOX: POWERED BY PURPOSE', {
        font: font,
        size: responsiveConfig.subtitleSize,
        depth: responsiveConfig.subtitleHeight,
        curveSegments: 8,
        bevelEnabled: false
      });
      geo2.center();
      
      const mat2 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0
      });
      
      const mesh2 = new THREE.Mesh(geo2, mat2);
      mesh2.position.y = -responsiveConfig.textSize * 0.8;
      
      textGroup.add(mesh1, mesh2);
    }
    
    textMesh = textGroup;
    textMesh.isGroup = true;

    textMesh.position.set(0, 2, 0);
    textMesh.scale.set(0, 0, 0);
    scene.add(textMesh);
    console.log('Text added to scene');
  },
  undefined,
  function (error) {
    console.error('Font loading error:', error);
  }
);

// On window resize, adjust camera aspect ratio and renderer size
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main render function
let render = function () {
  earth.getObjectByName('surface').rotation.y += 1 / 128 * 0.015;
  earth.getObjectByName('atmosphere').rotation.y += 1 / 64 * 0.015;

  // Drone animation - orbital descent around Earth
  if (!drone.userData.isFlightComplete) {
    if (!drone.userData.flightStarted) {
      drone.userData.flightStarted = true;
      // Start from beginning - drone comes from behind earth
      // Set initial camera position
      camera.position.copy(cameraAnimationState.startPos);
      camera.fov = cameraAnimationState.startFov;
      camera.updateProjectionMatrix();
    }

    drone.userData.flightTime++;
    let progress = drone.userData.flightTime / drone.userData.flightDuration;

    // Trigger landing effects at 95% progress (touchdown)
    if (progress >= 0.95 && !drone.userData.hasTriggeredLandingEffects) {
      drone.userData.hasTriggeredLandingEffects = true;

      if (landingZone) {
        landingZone.traverse(function (obj) {
          // Identify glow meshes to pulse
          if (obj.isMesh && obj.material.blending === THREE.AdditiveBlending) {
            obj.userData.originalScale = obj.scale.clone();
            obj.userData.originalOpacity = obj.material.opacity;
            obj.userData.flashStartTime = Date.now();
          }
          // Reset shockwave
          if (obj.name === 'shockwaveRing') {
            obj.scale.set(1, 1, 1);
            obj.material.opacity = 0.8;
            obj.userData.shockStartTime = Date.now();
            shockwaveStartTime = Date.now(); // Track globally
          }
        });
      }
    }

    // Smoother and more balanced landing easing
    let t = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2; // Reduced power to 3 for a much slower, visible finish

    // Ensure a longer overall flight duration for slower motion
    drone.userData.flightDuration = 500;

    // Mark as complete when animation finishes (no break, just flag)
    if (progress >= 0.98) {
      drone.userData.isFlightComplete = true;
      console.log('Drone flight complete! Progress:', progress.toFixed(2));
    }
    if (progress >= 1.0) {
      t = 1; // Clamp to final position
    }

    // Orbital flight path - from bottom of Earth to center top pole
    // We want to land at (0, earthRadius, 0)

    // Calculate current Earth scale (responsive)
    // Start with massive earth (2.5x base), then scale up further during landing
    let initialEarthScale = responsiveConfig.earthBaseScale * 2.5;
    let currentEarthScale = initialEarthScale;
    if (t > 0.5) { // Start scaling earlier (was 0.6)
      let scaleProgress = (t - 0.5) / 0.5;
      let scaleEase = scaleProgress * scaleProgress;
      let scaleRange = responsiveConfig.earthMaxScale - initialEarthScale;
      currentEarthScale = initialEarthScale + (scaleEase * scaleRange);
    }
    let earthRadius = 0.5 * currentEarthScale; // Scaled earth radius

    // Spherical flight path - safer to avoid clipping through Earth
    // We orbit on a "shell" that shrinks from outer space to surface

    // 1. Calculate safe distance from center
    // Use responsive altitude settings
    let startAlt = responsiveConfig.startAlt;
    let peakAlt = responsiveConfig.peakAlt;
    let endAlt = responsiveConfig.endAlt;

    // Shape altitude so the drone has much more time for the final descent
    let altitude;
    let topPhase = 0.6; // Start descent even earlier (60% into flight) to show the landing clearly
    if (t < topPhase) {
      // From launch up to ~80% of the timeline, move from startAlt to peakAlt
      let nt = t / topPhase;
      altitude = startAlt + (peakAlt - startAlt) * nt;
    } else {
      // Final 20%: gentle ease-out from peakAlt down to endAlt
      let nt = (t - topPhase) / (1 - topPhase); // 0 -> 1
      let easeOut = 1 - Math.pow(1 - nt, 2); // quadratic ease-out
      altitude = peakAlt + (endAlt - peakAlt) * easeOut;
    }

    let droneDist = earthRadius + altitude;

    // 2. Spherical Coordinates - Vertical revolution
    // Phi: Polar angle from Y axis (0 = top, PI = bottom)
    // Start from behind (PI) and rotate to top pole (0)
    let startPhi = Math.PI; // Start at bottom/behind
    let endPhi = 0; // End at top pole (where launchpad is)
    let phi = startPhi - (t * startPhi); // Rotate from PI to 0 (bottom to top)

    // Theta: Azimuthal angle (fixed position for vertical orbit)
    // Keep theta constant so orbit is in a single vertical plane
    let theta = Math.PI; // Face forward, vertical plane

    // 3. Convert to Cartesian
    // y = r * cos(phi)
    // x = r * sin(phi) * cos(theta)
    // z = r * sin(phi) * sin(theta)

    drone.position.x = droneDist * Math.sin(phi) * Math.cos(theta); // Slight offset to align with pad
    drone.position.y = droneDist * Math.cos(phi);
    drone.position.z = droneDist * Math.sin(phi) * Math.sin(theta);

    // Compatibility variables for camera logic (needed for follow behavior)
    let angle = phi; // Use phi for vertical rotation
    let xzRadius = droneDist * Math.sin(phi);
    let yPos = drone.position.y;

    // Drone rotation 
    // Align with motion, then straighten up for landing
    drone.rotation.y = -angle;
    drone.rotation.x = 0;
    drone.rotation.z = 0;

    // Disable camera auto rotation during flight
    cameraAutoRotation = false;

    // Camera Positioning
    // Start the landing camera angle a bit earlier so we see more of the touchdown
    let landingPhaseStart = 0.50;
    if (t < landingPhaseStart) {
      // Orbit phase
      // Ease camera in from distance to create perspective (start far, end close)
      let approachDist = 4.0 * (1 - t);
      let camRadius = xzRadius + 1.5 + approachDist;
      let camAngle = angle - 0.5;
      camera.position.x = Math.cos(camAngle) * camRadius;
      camera.position.y = yPos + 0.5;
      camera.position.z = Math.sin(camAngle) * camRadius;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    } else {
      // Landing phase - Zoom to top
      // landT goes from 0 at landingPhaseStart to 1 by the end of the flight
      let landT = (t - landingPhaseStart) / (1 - landingPhaseStart);

      // Target camera position: slightly above and in front of landing spot
      let targetCamX = 0;
      let targetCamY = earthRadius + 0.3;
      let targetCamZ = 1.8; // Moved further back to frame text properly

      // Interpolate from "Orbit Path" to "Landing Spot"
      // Must match orbit path calculation at landingPhaseStart to avoid jump
      let approachDist = 4.0 * (1 - t);
      let virtualRadius = xzRadius + 1.5 + approachDist;

      let currentCamX = Math.cos(angle - 0.5) * virtualRadius;
      let currentCamY = yPos + 0.5;
      let currentCamZ = Math.sin(angle - 0.5) * virtualRadius;

      camera.position.x = currentCamX + (targetCamX - currentCamX) * landT;
      camera.position.y = currentCamY + (targetCamY - currentCamY) * landT;
      camera.position.z = currentCamZ + (targetCamZ - currentCamZ) * landT;

      // Smoothly interpolate lookAt target
      // From (0,0,0) [Orbit] to (0, earthRadius + 0.20, 0) [Landing Center]
      let currentLookAt = new THREE.Vector3(0, 0, 0);
      let finalLookAt = new THREE.Vector3(0, earthRadius + 0.20, 0); // Look higher to frame text
      let blendedLookAt = new THREE.Vector3().lerpVectors(currentLookAt, finalLookAt, landT);
      camera.lookAt(blendedLookAt);
    }

    // Camera FOV - Aggressive zoom (Less extreme to keep text in frame)
    // Start at 50, end at 30
    let fovT = t * t; // Ease in
    camera.fov = 50 - (20 * fovT);
    camera.updateProjectionMatrix();

    // Scale Earth BEFORE smoke calculation so world matrix is correct
    earth.scale.set(currentEarthScale, currentEarthScale, currentEarthScale);

    // Landing Zone Animation (Grow elements)
    if (t < 0.5) {
      landingZone.scale.set(0, 0, 0);
    } else if (t >= 0.5 && t < 0.7) {
      // Pad appears smoothly with easeOutCubic
      let zoneT = (t - 0.5) / 0.2;
      let s = 1 - Math.pow(1 - zoneT, 3); // Smooth easeOutCubic
      landingZone.scale.set(s, s, s);
    } else {
      landingZone.scale.set(1, 1, 1);

      // Grow buildings and trees individually
      landingZone.traverse(function (obj) {
        if (obj.userData.isGrowing) {
          // Delay growth based on userData
          // Spread growth between t=0.6 and t=0.9
          let growStart = 0.6 + (obj.userData.growDelay || 0) * 0.2;

          if (t > growStart) {
            let growT = Math.min((t - growStart) / 0.15, 1);
            // Elastic/Bouncy growth
            let p = 0.5;
            let s = Math.pow(2, -10 * growT) * Math.sin((growT - p / 4) * (2 * Math.PI) / p) + 1;
            if (growT === 1) s = 1;
            if (growT === 0) s = 0;

            // Use simple ease out if elastic is too unstable for small timestamp
            s = growT * (2 - growT);

            let target = obj.userData.targetScale;
            obj.scale.set(target.x * s, target.y * s, target.z * s);
          }
        }
      });
    }
  }

  // Keep landing zone visible after flight completes (with responsive scaling)
  if (drone.userData.isFlightComplete && landingZone) {
    landingZone.scale.set(
      responsiveConfig.landingZoneScale,
      responsiveConfig.landingZoneScale,
      responsiveConfig.landingZoneScale
    );

    // Animate landing pulse/flash
    landingZone.traverse(function (obj) {
      // 1. Pad Pulse/Shine
      if (obj.userData.flashStartTime) {
        let elapsedFlash = Date.now() - obj.userData.flashStartTime;
        let flashDuration = 1500; // Longer rhythmic pulse
        if (elapsedFlash < flashDuration) {
          let flashT = elapsedFlash / flashDuration;
          // Rhythmic pulse using Math.sin - more intense
          let pulse = Math.sin(flashT * Math.PI * 4); // 4 waves for more energy
          let pulseS = 1 + pulse * 0.4 * (1 - flashT); // Larger scale pulse
          let pulseO = obj.userData.originalOpacity + (1 - obj.userData.originalOpacity) * pulse * (1 - flashT);

          obj.scale.copy(obj.userData.originalScale).multiplyScalar(pulseS);
          obj.material.opacity = Math.max(0, pulseO);
        } else {
          // Reset after pulse
          obj.scale.copy(obj.userData.originalScale);
          obj.material.opacity = obj.userData.originalOpacity;
          delete obj.userData.flashStartTime;
        }
      }

      // 2. Shockwave expansion
      if (obj.name === 'shockwaveRing' && obj.userData.shockStartTime) {
        let elapsedShock = Date.now() - obj.userData.shockStartTime;
        let shockDuration = 1500; // Slower shockwave (2 seconds instead of 1)
        if (elapsedShock < shockDuration) {
          let shockT = elapsedShock / shockDuration;
          let scale = 1 + shockT * 12; // Expand much further (12x)
          let opacity = 1.0 * (1 - shockT); // Start fully opaque and fade
          obj.scale.set(scale, scale, scale);
          obj.material.opacity = opacity;
        } else {
          obj.material.opacity = 0;
          delete obj.userData.shockStartTime;
        }
      }
    });
  }

  // Rotate propellers smoothly throughout flight
  drone.traverse(function (child) {
    if (child.userData && child.userData.isRotating) {
      child.rotation.y += 0.35;
    }
  });

  // Text Animation - start early in the animation for better visibility
  let revealProgress = drone.userData.flightTime / drone.userData.flightDuration;
  
  // Always try to show text after 3 seconds, regardless of drone progress
  let timeBasedReveal = Date.now() > (renderStartTime + 3000); // Show after 3 seconds
  
  if ((revealProgress >= 0.60 || timeBasedReveal) && textMesh) {
    textAnimationTime += 0.016; // Slightly faster animation

    // Position text relative to current Earth scale
    let currentEarthScale = earth.scale.x;
    let currentEarthRadius = 0.5 * currentEarthScale;

    // Position text higher up and adjust for responsive design
    let floatY = Math.sin(Date.now() * 0.003) * 0.03;
    // Use responsiveConfig.textYOffset for Y position, and raise further for mobile
    let textYOffset = responsiveConfig.textYOffset;
    let textY = (currentEarthRadius + textYOffset) + floatY;
    textMesh.position.set(0, textY, 0);

    // Make text always face camera
    textMesh.lookAt(camera.position);

    // Debug logging
    console.log('Text visible:', textMesh.visible, 'Scale:', textMesh.scale, 'Position:', textMesh.position, 'Opacity:', textMesh.material ? textMesh.material.opacity : 'N/A');

    // Creative reveal with proper sizing for responsive design
    // Use a larger base scale for mobile to ensure visibility
    if (textAnimationTime < 2.0) {
      let t = Math.min(textAnimationTime / 2.0, 1);
      let baseScale = responsiveConfig.tier === 'mobile' ? 1.2 : 
                     responsiveConfig.tier === 'tablet' ? 1.0 : 1.2;
      let s = t * t * (3.0 - 2.0 * t) * baseScale;
      textMesh.scale.set(s, s, s);
      // Opacity fades in smoothly
      if (textMesh.isGroup) {
        textMesh.traverse(child => {
          if (child.material) child.material.opacity = t;
        });
      } else {
        textMesh.material.opacity = t;
      }
    } else {
      // Final scale based on device type
      let finalScale = responsiveConfig.tier === 'mobile' ? 1.2 : 
                      responsiveConfig.tier === 'tablet' ? 1.0 : 1.2;
      textMesh.scale.set(finalScale, finalScale, finalScale);
      // Flicker/Digital Reveal stabilized
      if (textMesh.isGroup) {
        textMesh.traverse(child => {
          if (child.material) child.material.opacity = 1;
        });
      } else {
        textMesh.material.opacity = 1;
      }

      // Subtle pulse after reveal
      let pulseScale = finalScale + Math.sin(Date.now() * 0.0005) * 0.05;
      textMesh.scale.set(pulseScale, pulseScale, pulseScale);
    }
  }

  // End animation after shockwave completes (2 seconds) plus brief display time
  const shockwaveDuration = 1500; // 2 seconds for shockwave expansion
  const additionalDisplayTime = 500; // Show text briefly after shockwave completes
  const totalAnimationDuration = shockwaveDuration + additionalDisplayTime;
  
  if (shockwaveStartTime && (Date.now() - shockwaveStartTime) > totalAnimationDuration) {
    console.log('Animation sequence complete - shockwave finished');
    renderer.render(scene, camera);
    // Trigger transition to App.jsx
    if (onComplete) {
      setTimeout(onComplete, 500); // Small delay before transition
    }
    return; // Stop the animation loop
  }

  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

// Handle window resize for responsive design
window.addEventListener('resize', function () {
  let width = window.innerWidth;
  let height = window.innerHeight;

  // Update camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  // Check if we need to switch responsive modes
  let oldTier = responsiveConfig.tier;
  responsiveConfig = getResponsiveConfig();

  // If mode changed (tier changed), update camera animation state and reload text
  if (oldTier !== responsiveConfig.tier) {
    cameraAnimationState.startPos = responsiveConfig.cameraStartPos.clone();
    cameraAnimationState.endPos = responsiveConfig.cameraEndPos.clone();
    cameraAnimationState.startFov = responsiveConfig.cameraStartFov;
    cameraAnimationState.endFov = responsiveConfig.cameraEndFov;

    // Update landing zone scale
    if (landingZone) {
      let s = responsiveConfig.landingZoneScale;
      landingZone.scale.set(s, s, s);
    }

    // Optional: Update camera directly if flight is in progress
    if (!drone.userData.isFlightComplete) {
      camera.fov = cameraAnimationState.startFov;
      camera.updateProjectionMatrix();
    }

    // Reload text with new size and layout if it exists
    if (textMesh) {
      scene.remove(textMesh);
      if (textMesh.isGroup) {
        textMesh.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      } else {
        if (textMesh.geometry) textMesh.geometry.dispose();
        if (textMesh.material) textMesh.material.dispose();
      }

      const fontLoader = new FontLoader();
      fontLoader.load('/fonts/TT_Supermolot_Neue.json', function (font) {
        const textGroup = new THREE.Group();
        
        if (responsiveConfig.stackMainTitle) {
          // Mobile/Tablet: 3 lines (INNOVATION, 2026, subtitle)
          // Create INNOVATION
          const geo1 = new TextGeometry('INNOVATION', {
            font: font,
            size: responsiveConfig.textSize,
            depth: responsiveConfig.textHeight,
            curveSegments: 8,
            bevelEnabled: false
          });
          geo1.center();
          
          const mat1 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
          });
          
          const mesh1 = new THREE.Mesh(geo1, mat1);
          mesh1.position.y = responsiveConfig.textSize * 0.65;
          
          // Create 2026
          const geo2 = new TextGeometry('2026', {
            font: font,
            size: responsiveConfig.textSize,
            depth: responsiveConfig.textHeight,
            curveSegments: 8,
            bevelEnabled: false
          });
          geo2.center();
          
          const mat2 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
          });
          
          const mesh2 = new THREE.Mesh(geo2, mat2);
          mesh2.position.y = -responsiveConfig.textSize * 0.55;
          
          // Create EQUINOX: POWERED BY PURPOSE
          const geo3 = new TextGeometry('EQUINOX: POWERED BY PURPOSE', {
            font: font,
            size: responsiveConfig.subtitleSize,
            depth: responsiveConfig.subtitleHeight,
            curveSegments: 8,
            bevelEnabled: false
          });
          geo3.center();
          
          const mat3 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
          });
          
          const mesh3 = new THREE.Mesh(geo3, mat3);
          mesh3.position.y = -responsiveConfig.textSize * 1.5;
          
          textGroup.add(mesh1, mesh2, mesh3);
        } else {
          // Desktop: 2 lines (INNOVATION 2026, subtitle)
          // Create INNOVATION 2026 (single line)
          const geo1 = new TextGeometry('INNOVATION 2026', {
            font: font,
            size: responsiveConfig.textSize,
            depth: responsiveConfig.textHeight,
            curveSegments: 8,
            bevelEnabled: false
          });
          geo1.center();
          
          const mat1 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
          });
          
          const mesh1 = new THREE.Mesh(geo1, mat1);
          mesh1.position.y = responsiveConfig.textSize * 0.6;
          
          // Create EQUINOX: POWERED BY PURPOSE
          const geo2 = new TextGeometry('EQUINOX: POWERED BY PURPOSE', {
            font: font,
            size: responsiveConfig.subtitleSize,
            depth: responsiveConfig.subtitleHeight,
            curveSegments: 8,
            bevelEnabled: false
          });
          geo2.center();
          
          const mat2 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
          });
          
          const mesh2 = new THREE.Mesh(geo2, mat2);
          mesh2.position.y = -responsiveConfig.textSize * 0.8;
          
          textGroup.add(mesh1, mesh2);
        }
        
        textMesh = textGroup;
        textMesh.isGroup = true;

        textMesh.position.set(0, 0.4, 0);
        scene.add(textMesh);
      });
    }
  }
});

// Prevent zooming on mobile
document.addEventListener('touchmove', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

render();

console.log('Animation started successfully');

    // Cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener('resize', () => {});
      document.removeEventListener('touchmove', () => {});
      
      // Cleanup THREE.js resources
      if (renderer) {
        renderer.dispose();
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (object.material.length) {
            for (let material of object.material) {
              material.dispose();
            }
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="animation-container"
    />
  );
}

export default Animation;
