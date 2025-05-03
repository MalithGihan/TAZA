/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Reload } from "../../components/Reload/Reload";
import { motion } from "framer-motion";

export const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);

  const [countryMarkers, setCountryMarkers] = useState({});

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeRef = useRef(null);
  const controlsRef = useRef(null);
  const frameRef = useRef(null);
  const markersGroupRef = useRef(null);

  const textureLoader = new THREE.TextureLoader();

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x121f36);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current.children.length > 0) {
      mountRef.current.removeChild(mountRef.current.children[0]);
    }

    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const radius = 2;
    const segments = 64;

    const earthGeometry = new THREE.SphereGeometry(radius, segments, segments);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x9295aa,
      shininess: 100,
    });

    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;
    scene.add(markersGroup);

    textureLoader.load(
      "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg",
      function (texture) {
        earthMaterial.map = texture;
        earthMaterial.needsUpdate = true;
      }
    );

    textureLoader.load(
      "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-normal.jpg",
      function (texture) {
        earthMaterial.normalMap = texture;
        earthMaterial.normalScale.set(6, 6);
        earthMaterial.needsUpdate = true;
      }
    );

    textureLoader.load(
      "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-specular.jpg",
      function (texture) {
        earthMaterial.specularMap = texture;
        earthMaterial.specular = new THREE.Color(0x555555);
        earthMaterial.needsUpdate = true;
      }
    );

    const globe = new THREE.Mesh(earthGeometry, earthMaterial);
    globeRef.current = globe;
    scene.add(globe);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
    });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = THREE.MathUtils.randFloatSpread(200);
      const y = THREE.MathUtils.randFloatSpread(200);
      const z = THREE.MathUtils.randFloatSpread(200);
      if (Math.sqrt(x * x + y * y + z * z) > 20) {
        starsVertices.push(x, y, z);
      }
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.3;

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && mountRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();

        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (!selectedCountry && globeRef.current) {
        globeRef.current.rotation.y += 0.001;
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (globeRef.current) {
        globeRef.current.geometry.dispose();
        globeRef.current.material.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    if (countries.length > 0 && markersGroupRef.current) {
      createCountryMarkers();
    }
  }, [countries]);

  const createCountryMarkers = () => {
    if (!markersGroupRef.current) return;

    while (markersGroupRef.current.children.length > 0) {
      const child = markersGroupRef.current.children[0];
      markersGroupRef.current.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    }

    const newMarkers = {};

    countries.forEach((country) => {
      if (country.latlng && country.latlng.length === 2) {
        const [lat, lng] = country.latlng;

        const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: 0xff4444,
          transparent: true,
          opacity: 0.8,
        });

        const marker = new THREE.Mesh(markerGeometry, markerMaterial);

        const position = latLongToVector3(lat, lng, 2.02);
        marker.position.copy(position);

        markersGroupRef.current.add(marker);

        newMarkers[country.cca3] = marker;

        marker.visible = false;
      }
    });

    setCountryMarkers(newMarkers);
  };

  const latLongToVector3 = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  };

  if (error) {
    return <Reload />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute left-12 top-36 transform -translate-y-1/4"
      >
        <div className="flex flex-col mb-2">
          <h1 className="font-lora text-[80px] text-white font-bold">
            {Array.from("Discover").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
          <h1 className="font-inter text-md text-white font-regular">
            {Array.from("A Journey Through the Nations").map(
              (letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.05, duration: 0.3 }}
                >
                  {letter}
                </motion.span>
              )
            )}
          </h1>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute right-12 bottom-2/4 transform -translate-y-1/2 my-8"
      >
        <div className="flex flex-col mb-4 text-right">
          <h1 className="text-2xl text-white font-bold mb-4">
            Creative & Travel-Inspired
          </h1>
          <p className="text-white text-md font-regular mb-2">
            <span className="font-serif font-bold">Merriweather</span> / Great
            for serif headings with a traditional, trustworthy feel.
          </p>
          <p className="text-white text-md font-regular mb-2">
            <span className="font-serif font-bold">Playfair Display</span> /
            Stylish serif, good for impactful headlines.
          </p>
          <p className="text-white text-md font-regular mb-2">
            <span className="font-serif font-bold">Lora</span> / A serif with a
            modern twist, perfect for both titles and body text
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute right-12 bottom-5 transform -translate-y-1/2 my-8"
      >
        <div className="flex flex-col mb-4 text-right">
          <h1 className="text-2xl text-white font-bold mb-4">
            Explore countries, cultures, and continents in one place
          </h1>
          <p className="text-white text-md font-regular mb-2">
            <span>
              {" "}
              Uncover fascinating facts about every country from population,
              geography, and languages to history, culture, and more.
            </span>{" "}
            Whether you're a traveler, student, or curious explorer, start your
            global journey here.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
