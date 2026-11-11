import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export const GitHubSatellite = ({
  repo,
  orbitRadius = 24,
  orbitSpeed = 0.12,
  angleOffset = 0,
  onSelect
}) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const angle = elapsed * orbitSpeed + angleOffset;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = Math.sin(elapsed * 0.5 + angleOffset) * 1.2;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(repo);
    } else if (repo.html_url) {
      window.open(repo.html_url, '_blank', 'noopener,noreferrer');
    }
  };

  const langColor = 
    repo.language === 'Python' ? '#3B82F6' :
    repo.language === 'JavaScript' || repo.language === 'TypeScript' ? '#F5F04E' :
    repo.language === 'HTML' || repo.language === 'CSS' ? '#FF5C8A' :
    '#39D5C8';

  return (
    <group ref={groupRef}>
      {/* Satellite Probe Mesh */}
      <mesh
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
        scale={hovered ? [1.4, 1.4, 1.4] : [1, 1, 1]}
      >
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={langColor}
          roughness={0.2}
          metalness={0.8}
          emissive={langColor}
          emissiveIntensity={hovered ? 0.7 : 0.25}
        />
      </mesh>

      {/* Satellite Solar Panels */}
      <mesh rotation={[0, 0, Math.PI / 4]} scale={hovered ? [1.4, 1.4, 1.4] : [1, 1, 1]}>
        <boxGeometry args={[1.1, 0.04, 0.25]} />
        <meshStandardMaterial color="#3155FF" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* HTML Tag on Hover */}
      {hovered && (
        <Html position={[0, 0.7, 0]} center distanceFactor={18} zIndexRange={[100, 0]}>
          <div 
            onClick={handleClick}
            className="px-2 py-0.5 rounded-md bg-white border-2 border-[#151515] shadow-brutal-sm text-[10px] font-mono font-bold whitespace-nowrap cursor-pointer flex items-center space-x-1.5"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
            <span className="font-heading font-black text-[#151515]">{repo.displayName || repo.name}</span>
            {repo.stargazers_count > 0 && (
              <span className="text-[#525252]">★{repo.stargazers_count}</span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
