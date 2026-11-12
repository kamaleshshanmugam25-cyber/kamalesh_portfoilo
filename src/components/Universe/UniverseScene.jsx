import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { 
  RotateCcw, 
  Compass, 
  Sparkles, 
  Globe2, 
  Info, 
  HelpCircle,
  Play,
  Pause,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { APPLICATION_REGISTRY } from '../../config/applicationRegistry';
import { useWindowManager } from '../../context/WindowContext';
import { ProjectPlanet } from './ProjectPlanet';
import { GitHubSatellite } from './GitHubSatellite';
import { PlanetInfoModal } from './PlanetInfoModal';
import { UniverseFallback } from './UniverseFallback';

// Camera & Smooth Focus Controller
function CameraController({ focusedApp, resetSignal, controlsRef }) {
  const { camera } = useThree();
  const defaultPos = useRef(new THREE.Vector3(0, 18, 28));
  const defaultTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (resetSignal) {
      camera.position.lerp(defaultPos.current, 0.05);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(defaultTarget.current, 0.05);
        controlsRef.current.update();
      }
    }
  });

  return null;
}

// Galactic Core (Central Sun/Matrix Hub)
function GalacticCore() {
  const coreRef = useRef();
  const coronaRef = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (coreRef.current) coreRef.current.rotation.y = elapsed * 0.2;
    if (coronaRef.current) coronaRef.current.rotation.y = -elapsed * 0.15;
  });

  return (
    <group>
      {/* Central Star Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshStandardMaterial
          color="#F5F04E"
          emissive="#F5F04E"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>

      {/* Pulsing Corona Atmosphere */}
      <mesh ref={coronaRef} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[2.2, 24, 24]} />
        <meshBasicMaterial
          color="#3155FF"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point Light emitted from core */}
      <pointLight color="#FFFFFF" intensity={250} distance={90} decay={2} />
    </group>
  );
}

export const UniverseScene = () => {
  const { 
    setViewMode, 
    selectedPlanetId, 
    setSelectedPlanetId, 
    techFilter,
    gitHubProjects = [] 
  } = useWindowManager();

  const [selectedApp, setSelectedApp] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const controlsRef = useRef();

  // Check WebGL availability on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGLError(true);
    } catch (_) {
      setHasWebGLError(true);
    }
  }, []);

  // Listen to external KAM AI workspace events
  useEffect(() => {
    const handleFocusPlanet = (e) => {
      const { planetId } = e.detail || {};
      const app = APPLICATION_REGISTRY.find(a => a.id === planetId);
      if (app) {
        setSelectedApp(app);
        if (setSelectedPlanetId) setSelectedPlanetId(app.id);
      }
    };

    const handleResetUniverse = () => {
      setSelectedApp(null);
      if (setSelectedPlanetId) setSelectedPlanetId(null);
      setResetCounter(prev => prev + 1);
    };

    window.addEventListener('kamverse:focus-planet', handleFocusPlanet);
    window.addEventListener('kamverse:reset-universe', handleResetUniverse);

    return () => {
      window.removeEventListener('kamverse:focus-planet', handleFocusPlanet);
      window.removeEventListener('kamverse:reset-universe', handleResetUniverse);
    };
  }, [setSelectedPlanetId]);

  // Synchronize external selectedPlanetId prop
  useEffect(() => {
    if (selectedPlanetId) {
      const app = APPLICATION_REGISTRY.find(a => a.id === selectedPlanetId);
      if (app) setSelectedApp(app);
    }
  }, [selectedPlanetId]);

  const handleSelectPlanet = (app) => {
    setSelectedApp(app);
    if (setSelectedPlanetId) setSelectedPlanetId(app.id);
  };

  const handleResetCamera = () => {
    setSelectedApp(null);
    if (setSelectedPlanetId) setSelectedPlanetId(null);
    setResetCounter(prev => prev + 1);
  };

  if (hasWebGLError) {
    return (
      <UniverseFallback 
        onSelectPlanet={(app) => setSelectedApp(app)} 
        onRetry3D={() => setHasWebGLError(false)} 
      />
    );
  }

  // Planet parameters config
  const planetConfigs = [
    { id: 'rsk-traders', radius: 6.8, speed: 0.22, size: 1.15, ring: true },
    { id: 'trichy-preneurs', radius: 9.8, speed: 0.19, size: 1.12, ring: true },
    { id: 'photography', radius: 12.8, speed: 0.16, size: 1.05, ring: false },
    { id: 'jewellery', radius: 15.8, speed: 0.14, size: 1.1, ring: false },
    { id: 'restaurant', radius: 18.8, speed: 0.11, size: 1.08, ring: false },
    { id: 'jobsphere', radius: 21.8, speed: 0.09, size: 1.12, ring: true },
    { id: 'college-erp', radius: 24.8, speed: 0.07, size: 1.2, ring: false }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-3rem)] bg-[#07070D] overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 18, 28], fov: 48 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#07070D');
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient Cosmic Illumination */}
          <ambientLight intensity={0.55} />
          
          {/* Directional Key Light */}
          <directionalLight position={[15, 25, 20]} intensity={1.5} color="#FFFFFF" />
          <directionalLight position={[-15, -10, -20]} intensity={0.4} color="#3155FF" />

          {/* Deep Starfield */}
          <Stars 
            radius={130} 
            depth={60} 
            count={1400} 
            factor={3.8} 
            saturation={0} 
            fade 
            speed={0.8} 
          />

          {/* Core Sun / Hub */}
          <GalacticCore />

          {/* 6 Featured Project Planets */}
          {planetConfigs.map((cfg) => {
            const app = APPLICATION_REGISTRY.find(a => a.id === cfg.id);
            if (!app) return null;
            const isHighlighted = Boolean(
              techFilter && app.techStack && app.techStack.some(t => t.toLowerCase() === techFilter.toLowerCase())
            );
            const isFocused = selectedApp?.id === app.id;

            return (
              <ProjectPlanet
                key={app.id}
                app={app}
                orbitRadius={cfg.radius}
                orbitSpeed={cfg.speed}
                planetRadius={cfg.size}
                color={app.accentColor || '#3155FF'}
                hasRing={cfg.ring}
                isFocused={isFocused}
                isHighlighted={isHighlighted}
                onSelect={handleSelectPlanet}
              />
            );
          })}

          {/* GitHub Satellites around Outer Galactic Rim */}
          {gitHubProjects.slice(0, 10).map((repo, idx) => (
            <GitHubSatellite
              key={repo.id || idx}
              repo={repo}
              orbitRadius={25 + (idx % 3) * 1.5}
              orbitSpeed={0.06 + (idx % 4) * 0.02}
              angleOffset={(idx * Math.PI) / 5}
              onSelect={(r) => {
                const matchedApp = APPLICATION_REGISTRY.find(
                  a => a.id === r.id || a.shortName.toLowerCase() === (r.displayName || r.name).toLowerCase()
                );
                if (matchedApp) handleSelectPlanet(matchedApp);
                else if (r.html_url) window.open(r.html_url, '_blank', 'noopener,noreferrer');
              }}
            />
          ))}

          {/* Interactive Camera Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={45}
            maxPolarAngle={Math.PI / 2 + 0.15}
            autoRotate={autoRotate}
            autoRotateSpeed={0.6}
          />

          <CameraController
            focusedApp={selectedApp}
            resetSignal={resetCounter}
            controlsRef={controlsRef}
          />
        </Suspense>
      </Canvas>

      {/* Top Floating HUD Controls */}
      <div className="absolute top-3 left-3 right-3 z-30 pointer-events-none flex items-center justify-between">
        {/* Left: Mode Pill & Quick Planet Picker */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="px-3 py-1.5 bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-brutal-sm flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3155FF] animate-pulse" />
            <span className="text-xs font-display font-black uppercase tracking-wider">
              3D PROJECT UNIVERSE
            </span>
          </div>

          {/* Quick Planet Pills for Quick Access */}
          <div className="hidden lg:flex items-center space-x-1">
            {APPLICATION_REGISTRY.map(app => (
              <button
                key={app.id}
                onClick={() => handleSelectPlanet(app)}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase border-2 border-[#151515] transition-all ${
                  selectedApp?.id === app.id
                    ? 'bg-[#3155FF] text-white shadow-brutal-sm -translate-y-0.5'
                    : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
                }`}
              >
                {app.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Camera Action Buttons */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Toggle Auto Rotation */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 border-2 border-[#151515] font-mono text-xs font-bold shadow-brutal-sm transition-all flex items-center space-x-1 ${
              autoRotate ? 'bg-[#10B981] text-white' : 'bg-white text-[#151515] hover:bg-[#F5F04E]'
            }`}
            title={autoRotate ? 'Pause Orbit Rotation' : 'Start Orbit Auto-Rotation'}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoRotate ? 'ORBITING' : 'ROTATE'}</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white hover:bg-[#F5F04E] text-[#151515] border-2 border-[#151515] shadow-brutal-sm font-mono text-xs font-bold transition-all flex items-center space-x-1"
            title="Reset Camera Position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          {/* Exit / Return to Desktop Canvas */}
          <button
            onClick={() => setViewMode('desktop')}
            className="px-3 py-1.5 bg-[#3155FF] hover:bg-[#2042eb] text-white border-2 border-[#151515] shadow-brutal-sm font-display font-black text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>DESKTOP</span>
          </button>
        </div>
      </div>

      {/* Bottom Subtle Navigation Helper Bar */}
      <div className="absolute bottom-20 sm:bottom-22 left-0 right-0 z-20 pointer-events-none flex justify-center px-4">
        <div className="px-3 py-1 bg-black/60 backdrop-blur-xs text-white/80 border border-white/20 rounded-full text-[10px] sm:text-[11px] font-mono font-medium flex items-center space-x-2 shadow-lg">
          <Compass className="w-3 h-3 text-[#F5F04E]" />
          <span>DRAG TO ORBIT • SCROLL/PINCH TO ZOOM • CLICK ANY PLANET TO INSPECT</span>
        </div>
      </div>

      {/* Planet Information Panel Modal */}
      {selectedApp && (
        <PlanetInfoModal
          app={selectedApp}
          onClose={() => {
            setSelectedApp(null);
            if (setSelectedPlanetId) setSelectedPlanetId(null);
          }}
        />
      )}
    </div>
  );
};
