import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export const ProjectPlanet = ({
  app,
  orbitRadius = 10,
  orbitSpeed = 0.3,
  planetRadius = 1.1,
  color = '#3155FF',
  isFocused = false,
  isHighlighted = false,
  hasRing = false,
  onSelect
}) => {
  const planetGroupRef = useRef();
  const sphereRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Orbit angle offset based on project index/id so planets are evenly distributed
  const angleOffset = useRef(
    app.id === 'rsk-traders' ? 0 :
    app.id === 'trichy-preneurs' ? 0.9 :
    app.id === 'photography' ? 1.8 :
    app.id === 'jewellery' ? 2.7 :
    app.id === 'restaurant' ? 3.6 :
    app.id === 'jobsphere' ? 4.5 :
    5.4
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    // Orbit around the galactic core
    const angle = elapsed * orbitSpeed + angleOffset.current;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;

    if (planetGroupRef.current) {
      planetGroupRef.current.position.set(x, 0, z);
    }

    // Planet self-rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.012;
      sphereRef.current.rotation.x = 0.15;
    }

    // Ring slow rotation if present
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.005;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect(app);
  };

  return (
    <>
      {/* Visual Orbit Guide Line in the galactic plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.04, orbitRadius + 0.04, 80]} />
        <meshBasicMaterial 
          color={isHighlighted ? '#F5F04E' : '#FFFFFF'} 
          transparent 
          opacity={isHighlighted ? 0.35 : 0.08} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Orbiting Planet Group */}
      <group ref={planetGroupRef}>
        {/* Core Planet Sphere */}
        <mesh
          ref={sphereRef}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          scale={hovered || isFocused ? [1.18, 1.18, 1.18] : isHighlighted ? [1.12, 1.12, 1.12] : [1, 1, 1]}
        >
          <sphereGeometry args={[planetRadius, 32, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.25}
            metalness={0.35}
            emissive={isHighlighted ? '#F5F04E' : hovered || isFocused ? color : color}
            emissiveIntensity={isHighlighted ? 0.6 : hovered || isFocused ? 0.45 : 0.15}
          />

          {/* Planetary Ring if enabled (e.g. RSK Traders, JobSphere) */}
          {hasRing && (
            <mesh ref={ringRef} rotation={[1.1, 0.4, 0]}>
              <ringGeometry args={[planetRadius * 1.45, planetRadius * 1.95, 48]} />
              <meshStandardMaterial
                color={color}
                transparent
                opacity={0.65}
                roughness={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Atmospheric Glow Shell */}
          <mesh scale={[1.12, 1.12, 1.12]}>
            <sphereGeometry args={[planetRadius, 24, 24]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={hovered || isFocused ? 0.28 : isHighlighted ? 0.35 : 0.08}
              side={THREE.BackSide}
            />
          </mesh>
        </mesh>

        {/* Neo-Brutalist 2D HTML Label Attached to 3D Space */}
        <Html
          position={[0, planetRadius + 0.9, 0]}
          center
          distanceFactor={18}
          zIndexRange={[100, 0]}
        >
          <div
            onClick={handleClick}
            className={`cursor-pointer select-none transition-all duration-150 transform hover:scale-105 ${
              hovered || isFocused
                ? 'scale-110 z-50'
                : isHighlighted
                ? 'scale-105'
                : 'scale-100 opacity-90'
            }`}
          >
            <div className="flex flex-col items-center">
              {/* Tooltip Badge */}
              <div className="px-2.5 py-1 rounded-lg bg-white border-2 border-[#151515] shadow-brutal-sm flex items-center space-x-1.5 whitespace-nowrap">
                <span 
                  className="w-2.5 h-2.5 rounded-full border border-[#151515]" 
                  style={{ backgroundColor: color }}
                />
                <span className="font-display font-black text-[11px] uppercase tracking-tight text-[#151515]">
                  {app.shortName || app.name}
                </span>
                {app.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                )}
              </div>

              {/* Sub-label Category Pill */}
              {(hovered || isFocused || isHighlighted) && (
                <div className="mt-0.5 px-1.5 py-0.2 rounded bg-[#151515] text-white text-[8px] font-mono font-bold uppercase tracking-wider">
                  {app.category}
                </div>
              )}
            </div>
          </div>
        </Html>
      </group>
    </>
  );
};
