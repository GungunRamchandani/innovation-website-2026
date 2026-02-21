import { useEffect, useRef } from "react";
import * as THREE from "three";

function Globe() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // SCENE
    const scene = new THREE.Scene();
   // scene.background = new THREE.Color(0xffffff);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 70 : 55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = isMobile ? 8 : 10;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true ,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // GLOBE
    const globe = new THREE.Group();
    scene.add(globe);

    const images = [
  "/assets/gallery/imagegallery1.jpg",
  "/assets/gallery/imagegallery2.jpg",
  "/assets/gallery/imagegallery3.jpg"
];

    const loader = new THREE.TextureLoader();

    // Responsive radius
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const radius = (minDimension / window.innerWidth) * (isMobile ? 3.2 : 4.5);

    const arcWidth = Math.PI / 8;

    // =========================
    // 3 MAIN BANDS
    // =========================
    const bands = [
      { lat: Math.PI / 2 + 0.45, arc: Math.PI / 9, opacity: 0.75 },
      { lat: Math.PI / 2, arc: Math.PI / 7, opacity: 1 },
      { lat: Math.PI / 2 - 0.45, arc: Math.PI / 9, opacity: 0.75 }
    ];

    bands.forEach((band, bandIndex) => {
      images.forEach((_, i) => {
        const imgIndex = (i + bandIndex * 2) % images.length;
        const texture = loader.load(images[imgIndex]);

        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.FrontSide,
          transparent: bandIndex !== 1,
          opacity: band.opacity
        });

        const theta = (i / images.length) * Math.PI * 2;

        const geometry = new THREE.SphereGeometry(
          radius,
          32,
          32,
          theta,
          arcWidth,
          band.lat - band.arc / 2,
          band.arc
        );

        globe.add(new THREE.Mesh(geometry, material));
      });
    });

    // =========================
    // POLAR RINGS (VISIBLE)
    // =========================
    function createPolarRing(phiCenter) {
      const count = 6;
      const width = Math.PI / 16;
      const height = Math.PI / 6;

      for (let i = 0; i < count; i++) {
        const texture = loader.load(images[i % images.length]);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.FrontSide,
          transparent: true,
          opacity: 0.8
        });

        const theta = (i / count) * Math.PI * 2;

        const geometry = new THREE.SphereGeometry(
          radius,
          32,
          32,
          theta,
          width,
          phiCenter - height / 2,
          height
        );

        globe.add(new THREE.Mesh(geometry, material));
      }
    }

    // Move away from exact poles
    createPolarRing(0.55);
    createPolarRing(Math.PI - 0.55);

    // =========================
    // ANIMATION
    // =========================
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.0015;
      renderer.render(scene, camera);
    };

    animate();

    // =========================
    // RESIZE
    // =========================
    const handleResize = () => {
      const mobile = window.innerWidth < 768;

      camera.fov = mobile ? 70 : 55;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100dvh",
        overflow: "hidden"
      }}
    />
  );
}

export default Globe;
