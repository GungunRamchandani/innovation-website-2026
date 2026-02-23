import { useEffect, useRef } from "react";
import * as THREE from "three";

function Globe() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

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

    const globe = new THREE.Group();
    scene.add(globe);

    const imageModules = import.meta.glob(
      "/src/assets/gallery/*.{jpg,JPG,png,jpeg,webp}",
      { eager: true }
    );

    const images = Object.values(imageModules).map(
      (mod) => mod.default
    );

    const loader = new THREE.TextureLoader();
    const textures = images.map(src => {
    const tex = loader.load(src);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
    });

    const segmentCount = images.length;
    const gapFactor = 0.9;
    const arcWidth = ((Math.PI * 2) / segmentCount) * gapFactor;

    const bands = [
      { lat: Math.PI / 2 + 0.45, arc: Math.PI / 9, opacity: 0.75 },
      { lat: Math.PI / 2, arc: Math.PI / 7, opacity: 1 },
      { lat: Math.PI / 2 - 0.45, arc: Math.PI / 9, opacity: 0.75 }
    ];

    let radius = 6.5;

    function buildGlobe() {
      //globe.clear();
      while (globe.children.length) {
        globe.remove(globe.children[0]);
       }

      // MAIN BANDS
      bands.forEach((band, bandIndex) => {
        for (let i = 0; i < segmentCount; i++) {

          const imgIndex =
            (i + bandIndex * 2) % images.length;

          //const texture = loader.load(images[imgIndex]);
          const texture = textures[imgIndex];
          texture.anisotropy =
            renderer.capabilities.getMaxAnisotropy();

          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.FrontSide,
            transparent: bandIndex !== 1,
            opacity: band.opacity
          });

          const theta =
            (i / segmentCount) * Math.PI * 2;

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
      createPolarRing(0.55);
      createPolarRing(Math.PI - 0.55);
    }
    globe.position.y = -0.5;
    camera.lookAt(0, 0, 0);

    globe.position.set(0, 0, 0);
    
    function createPolarRing(phiCenter) {
      const count = 6;
      const width = Math.PI / 16;
      const height = Math.PI / 6;

      for (let i = 0; i < count; i++) {

        //const texture = loader.load(
          //images[i % images.length]
        //);
        const texture = textures[i % textures.length];

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

    function handleResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const mobile = window.innerWidth < 768;

      radius = mobile ? 2.8 : 6.5;

      camera.fov = mobile ? 70 : 55;
      camera.position.z = mobile ? 8 : 16;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);

      buildGlobe();
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      globe.rotation.y += 0.0015;
      renderer.render(scene, camera);
    };

    animate();

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
        //height: "100vh",
        height: window.innerWidth < 768 ? "70vh" : "80vh",
        overflow: "hidden"
        
      }}
    />
  );
}



export default Globe;