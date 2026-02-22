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

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 70 : 55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = isMobile ? 8 : 16  ;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // GLOBE GROUP
    const globe = new THREE.Group();
    scene.add(globe);

    // IMAGE PATHS (must be inside public folder)
    const imageModules = import.meta.glob(
      "/src/assets/gallery/*.{jpg,JPG,png,jpeg,webp}",
      { eager: true }
    );

    const images = Object.values(imageModules).map(
      (mod) => mod.default
    );

    const loader = new THREE.TextureLoader();

    // RESPONSIVE RADIUS
    const minDimension = Math.min(
      container.clientWidth,
      container.clientHeight
    );
    const radius = isMobile ? 2 : 6.5;

    //const arcWidth = Math.PI / 8;
    const segmentCount = images.length; // use all images
    const gapFactor = 0.9; // 0.8 more gap, 1 = no gap
    const arcWidth = ((Math.PI * 2) / segmentCount) * gapFactor;

    // 3 MAIN BANDS
    const bands = [
      { lat: Math.PI / 2 + 0.45, arc: Math.PI / 9, opacity: 0.75 },
      { lat: Math.PI / 2, arc: Math.PI / 7, opacity: 1 },
      { lat: Math.PI / 2 - 0.45, arc: Math.PI / 9, opacity: 0.75 }
    ];

    bands.forEach((band, bandIndex) => {
      for (let i = 0; i < segmentCount; i++) {
        const imgIndex = (i + bandIndex * 2) % images.length;
        //const imgIndex = i % images.length;
        const texture = loader.load(images[imgIndex]);

        texture.anisotropy =
          renderer.capabilities.getMaxAnisotropy();

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.FrontSide,
          transparent: bandIndex !== 1,
          opacity: band.opacity
        });

        //const theta = (i / images.length) * Math.PI * 2;
        const theta = (i / segmentCount) * Math.PI * 2;
        
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
      }
    });

    // POLAR RINGS
    function createPolarRing(phiCenter) {
      const count = 6;
      const width = Math.PI / 16;
      const height = Math.PI / 6;

      for (let i = 0; i < count; i++) {
        const texture = loader.load(
          images[i % images.length]
        );

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

    createPolarRing(0.55);
    createPolarRing(Math.PI - 0.55);

    // ANIMATION
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      globe.rotation.y += 0.0015;
      renderer.render(scene, camera);
    };

    animate();

    // RESIZE
    const handleResize = () => {
      const mobile = window.innerWidth < 768;

      camera.fov = mobile ? 70 : 55;
      camera.aspect =
        container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
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
        height: "60vh",
        overflow: "hidden"
      }}
    />
  );
}

export default Globe; 
