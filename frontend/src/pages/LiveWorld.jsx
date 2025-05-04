import { useState, useEffect, useRef, use } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  ArrowLeft,
  Search,
  X,
  Info,
  Clock,
  MessageSquare,
  DollarSign,
  Map as MapIcon,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

import Reload from "../components/reload/Reload";
import Loader from "../components/reload/Loader";
import { useCountriesLatLng } from "../app/queries/useAllCountries";

export const LiveWorld = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [countryDetails, setCountryDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
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

  const { data, isLoading } = useCountriesLatLng();

  useEffect(() => {
    if (data) {
      setCountries(data);
    }
  }, [data]);

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
    controls.rotateSpeed = 0.5;

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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 1) {
      const results = countries
        .filter((country) =>
          country.name.common.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);

      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults([]);
    setShowResults(false);
  };

  const selectCountry = async (country) => {
    setSelectedCountry(country);
    setShowResults(false);
    setDetailsLoading(true);

    Object.values(countryMarkers).forEach((marker) => {
      marker.visible = false;
    });

    if (countryMarkers[country.cca3]) {
      countryMarkers[country.cca3].visible = true;

      countryMarkers[country.cca3].material.color.set(0xffff00); // Yellow
      countryMarkers[country.cca3].scale.set(1.5, 1.5, 1.5); // Scale up
    }

    if (globeRef.current && controlsRef.current && country.latlng) {
      const [lat, lng] = country.latlng;
      const point = latLongToVector3(lat, lng, 2);

      if (globeRef.current) {
        const targetRotationY = Math.atan2(-point.x, -point.z);
        const startRotationY = globeRef.current.rotation.y;

        const rotationDuration = 1000;
        const rotationStartTime = Date.now();

        const animateGlobeRotation = () => {
          const now = Date.now();
          const elapsed = now - rotationStartTime;
          const rotationProgress = Math.min(elapsed / rotationDuration, 1);
          const easeRotationProgress =
            rotationProgress * rotationProgress * (3 - 2 * rotationProgress);

          const newRotationY =
            startRotationY +
            (targetRotationY - startRotationY) * easeRotationProgress;
          globeRef.current.rotation.y = newRotationY;

          if (rotationProgress < 1) {
            requestAnimationFrame(animateGlobeRotation);
          }
        };

        animateGlobeRotation();
      }

      const direction = point.clone().normalize();

      const distance = 5;
      const cameraPosition = direction.multiplyScalar(distance);

      const startPosition = cameraRef.current.position.clone();
      const endPosition = cameraPosition;
      const duration = 1000;
      const startTime = Date.now();

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      const animateCamera = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = progress * progress * (3 - 2 * progress);

        cameraRef.current.position.lerpVectors(
          startPosition,
          endPosition,
          easeProgress
        );

        cameraRef.current.lookAt(0, 0, 0);

        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();

        rendererRef.current.render(sceneRef.current, cameraRef.current);

        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        } else {
          frameRef.current = requestAnimationFrame(() => {
            const animate = () => {
              frameRef.current = requestAnimationFrame(animate);
              if (controlsRef.current) {
                controlsRef.current.update();
              }
              rendererRef.current.render(sceneRef.current, cameraRef.current);
            };
            animate();
          });
        }
      };

      animateCamera();
    }

    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/alpha/${country.cca3}?fields=name,capital,region,subregion,population,flags,languages,currencies,area,borders,timezones`
      );
      if (!res.ok) throw new Error("Failed to fetch country details");
      const data = await res.json();
      setCountryDetails(data);
    } catch (err) {
      console.error("Error fetching country details:", err);
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedCountry(null);
    setCountryDetails(null);

    Object.values(countryMarkers).forEach((marker) => {
      marker.visible = false;
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getCurrencies = (currencyObj) => {
    if (!currencyObj) return "N/A";
    return Object.values(currencyObj)
      .map((curr) => `${curr.name} (${curr.symbol || ""})`)
      .join(", ");
  };

  if (error) {
    return <Reload />;
  }

  return (
    <div className=" min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="container mx-auto h-full flex flex-col">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-auto pt-6 px-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a
                  href="/"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-300 border border-white/10"
                  aria-label="Back to home"
                >
                  <ArrowLeft size={18} />
                </a>
                <h1 className="text-2xl font-medium text-white tracking-tight">
                  World Explorer
                </h1>
              </div>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pointer-events-auto px-6 mt-20 relative max-w-lg mx-auto w-full"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a country..."
                value={search}
                onChange={handleSearch}
                className="w-full bg-primary/10 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 placeholder-white/40 transition-all duration-300"
              />
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/50"
              />

              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 dark:dark hover:text-white/80 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {showResults && (
              <div className="absolute left-0 right-0 mt-2 z-50 px-4 py-2">
                {searchResults.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/10 dark:dark/80 backdrop-blur-lg border border-white/10 rounded-md overflow-hidden shadow-2xl"
                  >
                    {searchResults.map((country) => (
                      <button
                        key={country.cca3}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-all border-b border-white/5 last:border-0"
                        onClick={() => selectCountry(country)}
                      >
                        <img
                          src={country.flags.png}
                          alt={
                            country.flags.alt ||
                            `Flag of ${country.name.common}`
                          }
                          className="w-8 h-5 object-cover rounded shadow-sm"
                        />
                        <span className="font-medium">
                          {country.name.common}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                ) : search.length > 1 ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/80 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center text-white/80 shadow-2xl"
                  >
                    No countries found matching "
                    <span className="text-white">{search}</span>"
                  </motion.div>
                ) : null}
              </div>
            )}
          </motion.div>

          {!selectedCountry && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
            >
              <div className="flex flex-col items-center justify-center gap-2 text-white/70 text-sm w-full">
                <Info size={14} />
                <span>Drag to rotate the globe</span>
                <span>Search for a country to view details</span>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
                <Loader />
              </div>
            </div>
          )}

          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              className="pointer-events-auto  w-full max-w-md p-4 "
            >
              {detailsLoading ? (
                <Loader />
              ) : countryDetails ? (
                <div className="bg-gray-900 opacity-80 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
                  <div className="relative h-28">
                    <img
                      src={countryDetails.flags.png}
                      alt={
                        countryDetails.flags.alt ||
                        `Flag of ${countryDetails.name.common}`
                      }
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

                    <button
                      onClick={closeDetails}
                      className="absolute top-3 right-3 bg-black/30 p-1.5 rounded-full text-white"
                      aria-label="Close details"
                    >
                      <X size={16} />
                    </button>

                    <div className="absolute bottom-2 left-3">
                      <h2 className="text-xl font-medium text-white">
                        {countryDetails.name.common}
                      </h2>
                    </div>
                  </div>

                  <div className="p-4 text-gray-200 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Capital</span>
                        <span>{countryDetails.capital?.[0] || "N/A"}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Region</span>
                        <span>{countryDetails.region}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">
                          Population
                        </span>
                        <span>{formatNumber(countryDetails.population)}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Area</span>
                        <span>
                          {countryDetails.area
                            ? `${formatNumber(countryDetails.area)} km²`
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-xs text-gray-400 mb-1.5">
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {countryDetails.languages ? (
                          Object.values(countryDetails.languages).map(
                            (language, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-800 rounded-md text-xs"
                              >
                                {language}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-xs text-gray-400 mb-1.5">
                        Currencies
                      </h3>
                      <p className="text-sm">
                        {getCurrencies(countryDetails.currencies)}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-xs text-gray-400 mb-1.5">
                        Timezones
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {countryDetails.timezones ? (
                          countryDetails.timezones.map((timezone, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-gray-800 rounded-md text-xs"
                            >
                              {timezone}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                    </div>

                    {countryDetails.borders &&
                      countryDetails.borders.length > 0 && (
                        <div>
                          <h3 className="text-xs text-gray-400 mb-1.5">
                            Border Countries
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {countryDetails.borders.map((border) => {
                              const borderCountry = countries.find(
                                (c) => c.cca3 === border
                              );
                              return borderCountry ? (
                                <button
                                  key={border}
                                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-xs flex items-center gap-1.5 transition-colors"
                                  onClick={() => selectCountry(borderCountry)}
                                >
                                  <img
                                    src={borderCountry.flags.png}
                                    alt={`Flag of ${borderCountry.name.common}`}
                                    className="w-3 h-2 object-cover rounded-sm"
                                  />
                                  <span>{borderCountry.name.common}</span>
                                </button>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center text-white">
                  <AlertTriangle
                    className="mx-auto mb-3 text-amber-400"
                    size={24}
                  />
                  <p>Error loading country details</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
