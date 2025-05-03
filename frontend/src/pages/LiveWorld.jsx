import { useState, useEffect, useRef, use } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Globe, ArrowLeft, Info, X, Search } from "lucide-react";
import { motion } from "framer-motion";

import { Reload } from "../components/Reload/Reload";
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
    <div className="relative min-h-screen w-full overflow-hidden ">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="container mx-auto p-4 h-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-auto"
          >
            <div className="flex items-center gap-4 mb-4">
              <a
                href="/"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft size={20} />
              </a>
              <h1 className="text-2xl font-bold text-white">
                3D World Explorer
              </h1>
            </div>

            <div className="relative max-w-md pt-16">
              <div className="absolute top-18 flex items-center pointer-events-none">
                <Search size={26} className="text-white" />
              </div>
              <input
                type="text"
                placeholder="Search for a country..."
                value={search}
                onChange={handleSearch}
                className="w-full ml-10 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue-400 placeholder-primary"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black pt-16"
                >
                  <X size={18} />
                </button>
              )}

              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden z-50">
                  {searchResults.map((country) => (
                    <button
                      key={country.cca3}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-colors border-b border-white/10 last:border-0"
                      onClick={() => selectCountry(country)}
                    >
                      <img
                        src={country.flags.png}
                        alt={
                          country.flags.alt || `Flag of ${country.name.common}`
                        }
                        className="w-8 h-5 object-cover rounded"
                      />
                      <span>{country.name.common}</span>
                    </button>
                  ))}
                </div>
              )}

              {showResults &&
                searchResults.length === 0 &&
                search.length > 1 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-center text-white">
                    No countries found matching "{search}"
                  </div>
                )}
            </div>
          </motion.div>

          {isLoading && <Loader />}

          {!selectedCountry && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white/70 text-sm"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Info size={16} />
                <span>Use your mouse to rotate the globe</span>
              </div>
              <div>Search for a country to see detailed information</div>
            </motion.div>
          )}

          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="pointer-events-auto ml-auto w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
            >
              {detailsLoading ? (
                <Loader />
              ) : countryDetails ? (
                <div className="flex flex-col h-full max-h-[60vh]">
                  <div className="relative">
                    <img
                      src={countryDetails.flags.png}
                      alt={
                        countryDetails.flags.alt ||
                        `Flag of ${countryDetails.name.common}`
                      }
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                    <button
                      onClick={closeDetails}
                      className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 rounded-full p-2 text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h2 className="text-2xl font-bold text-white">
                        {countryDetails.name.common}
                      </h2>
                      <p className="text-white/80">
                        {countryDetails.name.official}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 text-white overflow-y-auto">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/10 rounded-lg p-3">
                          <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Capital
                          </h3>
                          <p>{countryDetails.capital?.[0] || "N/A"}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Region
                          </h3>
                          <p>{countryDetails.region}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Population
                          </h3>
                          <p>{formatNumber(countryDetails.population)}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <h3 className="text-xs uppercase tracking-wider text-white/60 mb-1">
                            Area
                          </h3>
                          <p>
                            {countryDetails.area
                              ? `${formatNumber(countryDetails.area)} km²`
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {countryDetails.languages ? (
                            Object.values(countryDetails.languages).map(
                              (language, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-white/10 rounded-full text-sm"
                                >
                                  {language}
                                </span>
                              )
                            )
                          ) : (
                            <span>N/A</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-2">Currencies</h3>
                        <p>{getCurrencies(countryDetails.currencies)}</p>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-2">Timezones</h3>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {countryDetails.timezones ? (
                            countryDetails.timezones.map((timezone, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-white/10 rounded-full"
                              >
                                {timezone}
                              </span>
                            ))
                          ) : (
                            <span>N/A</span>
                          )}
                        </div>
                      </div>

                      {countryDetails.borders &&
                        countryDetails.borders.length > 0 && (
                          <div className="bg-white/10 rounded-lg p-4">
                            <h3 className="text-sm font-medium mb-2">
                              Border Countries
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {countryDetails.borders.map((border) => {
                                const borderCountry = countries.find(
                                  (c) => c.cca3 === border
                                );
                                return borderCountry ? (
                                  <button
                                    key={border}
                                    className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm flex items-center gap-2 transition-colors"
                                    onClick={() => selectCountry(borderCountry)}
                                  >
                                    <img
                                      src={borderCountry.flags.png}
                                      alt={`Flag of ${borderCountry.name.common}`}
                                      className="w-4 h-3 object-cover"
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
                </div>
              ) : (
                <div className="p-6 text-center text-white">
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
