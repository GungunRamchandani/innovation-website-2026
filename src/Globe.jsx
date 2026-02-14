import { useEffect, useRef } from "react"
import * as THREE from "three"




function Globe() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current

    // SCENE
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.z = 10

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // LIGHT
    scene.add(new THREE.AmbientLight(0xffffff, 1))

    // GLOBE
    const globe = new THREE.Group()
    scene.add(globe)

    const images = Object.values(
        import.meta.glob("./assets/*.{jpg,JPG,png,jpeg,webp}", { eager: true })
    ).map(mod => mod.default)


    const poleImages = images
    const loader = new THREE.TextureLoader()
    const radius = 4.8
    const arcWidth = Math.PI / 9;

    const bands = [
      { lat: Math.PI / 2 + 0.45, arc: Math.PI / 10, opacity: 0.75 },
      { lat: Math.PI / 2, arc: Math.PI / 9, opacity: 1.0 },
      { lat: Math.PI / 2 - 0.45, arc: Math.PI / 10, opacity: 0.75 }
    ]

    bands.forEach((band, bandIndex) => {
        images.forEach((_, i) => {

            const imgIndex = (i + bandIndex * 2) % images.length
            const src = images[imgIndex]
            const isMiddle = bandIndex === 1;
            const material = new THREE.MeshBasicMaterial({
                map: loader.load(src),
                side: THREE.DoubleSide,
                transparent: !isMiddle,
                opacity: isMiddle ? 1 : 0.55,
                depthWrite: isMiddle
            });

            const theta = (i / images.length) * Math.PI * 2;
            
            const geometry = new THREE.SphereGeometry(
                radius,
                64,
                64,
                theta,
                arcWidth,
                band.lat - band.arc / 2,
                band.arc
            );

            globe.add(new THREE.Mesh(geometry, material));
        });
    });


    function createPolarRing(phiCenter) {
      const count = 5
      const width = Math.PI / 24
      const height = Math.PI / 8

      for (let i = 0; i < count; i++) {
        const material = new THREE.MeshBasicMaterial({
          map: loader.load(poleImages[i % poleImages.length]),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45
        })

        const theta = (i / count) * Math.PI * 2

        const geometry = new THREE.SphereGeometry(
          radius,
          64,
          64,
          theta,
          width,
          phiCenter - height / 2,
          height
        )

        globe.add(new THREE.Mesh(geometry, material))
      }
    }

    createPolarRing(0.25)
    createPolarRing(Math.PI - 0.25)

    function animate() {
      requestAnimationFrame(animate)

      globe.rotation.y += 0.001;


      globe.children.forEach(mesh => {
        const pos = new THREE.Vector3()
        mesh.getWorldPosition(pos)
        mesh.visible = pos.z > -radius * 0.75
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />
}

export default Globe
