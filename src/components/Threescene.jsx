import React, { useRef, useEffect } from 'react';
import * as Three from 'three';
import space from '../assets/bg.jpg';
import mercury from '../assets/mercury.png';
import eris from '../assets/eris_fictional.jpg';
import haumea from '../assets/haumea_fictional.jpg';
import ceres from '../assets/ceres_fictional.jpg';


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
    const ambientLight = new Three.AmbientLight(0x9F0000);
    const ambientLight2 = new Three.AmbientLight(0x005FFF);
    scene.add(ambientLight, ambientLight2);

    // Directional light for reflections
    const directionalLight = new Three.DirectionalLight(0x006fff, 1); // Color, Intensity
    const directionalLight2 = new Three.DirectionalLight(0x006fff, 1); // Color, Intensity
    directionalLight.position.set(0, 2000, -500); // Top-right direction
      directionalLight2.position.set(0, 2000, -1500); // Top-right direction
    scene.add(directionalLight, directionalLight2);
    
    // Background
    const spaceTexture = new Three.TextureLoader().load(space);
    scene.background = spaceTexture;

    // Planets
    const mercuryTexture = new Three.TextureLoader().load(mercury);
    const erisTexture = new Three.TextureLoader().load(eris);
    const haumeaTexture = new Three.TextureLoader().load(haumea);
    const ceresTexture = new Three.TextureLoader().load(ceres);
    
    const Planet1 = new Three.Mesh(
      new Three.SphereGeometry(8.5, 32, 32),
      new Three.MeshStandardMaterial({
        map: haumeaTexture,
      })
    );

    const Planet2 = new Three.Mesh(
      new Three.SphereGeometry(8, 32, 32),
      new Three.MeshStandardMaterial({
        map: ceresTexture,
      })
    );

    const Planet3 = new Three.Mesh(
      new Three.SphereGeometry(8, 32, 32),
      new Three.MeshStandardMaterial({
        map: erisTexture,
      })
    );

    const Planet4 = new Three.Mesh(
      new Three.SphereGeometry(8, 32, 32),
      new Three.MeshStandardMaterial({
        map: mercuryTexture,
      })
    );
    
    Planet1.rotation.y = 4;
    Planet2.rotation.y = 4;
    Planet3.rotation.y = 2;
    Planet4.rotation.y = 0;
    

    function positionMoon() {
      Planet1.position.x = 1.68*screenEdge;
      Planet1.position.z = -38;
      Planet1.position.y = 7.5;
      Planet2.position.x = -2.9*screenEdge;
      Planet2.position.z = -70;
      Planet3.position.y = -4;
      Planet3.position.x = -0.3*screenEdge;
      Planet3.position.z = -120;
      Planet4.position.y = -9;
      Planet4.position.x = -2*screenEdge;
      Planet4.position.z = -180;
    }

    scene.add(Planet1, Planet2, Planet3, Planet4);

    const screenEdge = window.innerWidth / 70;

    // Camera position
    camera.position.setZ(15);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      positionMoon();
      Planet1.rotation.y += 0.0010;
      Planet1.rotation.x += 0.0010;
      Planet2.rotation.y += 0.0015;
      Planet2.rotation.x += 0.0015;
      Planet3.rotation.y += 0.0020;
      Planet3.rotation.x += 0.0020;
      Planet4.rotation.y += 0.0025;
      Planet4.rotation.x += 0.0025;            
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize 
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    mountNode.removeChild(renderer.domElement); // Use the local variable here
    window.removeEventListener('resize', handleResize);
  };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1 }} />;
};

export default ThreeScene;
