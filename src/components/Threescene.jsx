import React, { useRef, useEffect } from 'react';
import * as Three from 'three';
import space from '../assets/bg.jpg';
import mercury from '../assets/mercury.webp';
import eris from '../assets/eris_fictional.webp';
import haumea from '../assets/haumea_fictional.webp';
import ceres from '../assets/ceres_fictional.webp';


const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new Three.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    let mountNode = mountRef.current; // Capture mountRef.current in a local variable

    // Lights
    const ambientLight = new Three.AmbientLight(0x6A20FF); 
    scene.add(ambientLight);

    // Directional light for reflections
    const directionalLight = new Three.DirectionalLight(0xffffff, 0.9); // Color, Intensity
    directionalLight.position.set(0, 1000, -500); // Top-right direction
    scene.add(directionalLight);
    
    // Background
    const spaceTexture = new Three.TextureLoader().load(space);
    scene.background = spaceTexture;

    // Planets
    const textureLoader = new Three.TextureLoader();
    const planetGeometry = new Three.SphereGeometry(8, 28, 28);

    const createPlanet = (texture, scale = 1) => {
      const planetMaterial = new Three.MeshStandardMaterial({ map: textureLoader.load(texture) });
      const planet = new Three.Mesh(planetGeometry, planetMaterial);
      planet.scale.setScalar(scale);
      return planet;
    };

    const Planet1 = createPlanet(haumea, 1.0625);
    const Planet2 = createPlanet(ceres);
    const Planet3 = createPlanet(eris);
    const Planet4 = createPlanet(mercury);
    
    const planets = [Planet1, Planet2, Planet3, Planet4];
    planets.forEach((planet, index) => {
      planet.rotation.y = index * 2;
      scene.add(planet);
    });

    const screenEdge = window.innerWidth / 70;

    function positionPlanets() {
      Planet1.position.set(1.68*screenEdge, 7.5, -38);
      Planet2.position.set(-2.9*screenEdge, 0, -70);
      Planet3.position.set(-0.3*screenEdge, -3, -120);
      Planet4.position.set(-2*screenEdge, -8, -180);
    }

    positionPlanets();

    // Camera position
    camera.position.z = 15;

    // Animation loop
    let lastTime = 0;
    const animate = (time) => {
      requestAnimationFrame(animate);

      const delta = (time - lastTime) / 1000; // time in seconds
      lastTime = time;

      planets.forEach((planet, index) => {
        planet.rotation.y += (0.001 + index * 0.0005) * delta * 60;
        planet.rotation.x += (0.001 + index * 0.0005) * delta * 60;
      });

      renderer.render(scene, camera);
    };
    animate(0);

    // Handle window resize 
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      positionPlanets();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mountNode.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} style={{ 
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: -1
  }} />;
};

export default ThreeScene;
