"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ACCENT = new THREE.Color("#c47b5a");
const WARM_WHITE = new THREE.Color("#f5f1ea");

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  attribute vec3 aSeed;
  varying float vMix;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime * 0.12;

    p.x += sin(t * (0.6 + aSeed.x) + aSeed.y * 6.2831) * 0.6;
    p.y += cos(t * (0.5 + aSeed.y) + aSeed.z * 6.2831) * 0.45;
    p.z += sin(t * (0.4 + aSeed.z) + aSeed.x * 6.2831) * 0.3;

    // Mouse parallax: nearer particles move more.
    float depth = clamp((p.z + 3.0) / 6.0, 0.0, 1.0);
    p.x += uMouse.x * mix(0.08, 0.5, depth);
    p.y += uMouse.y * mix(0.05, 0.35, depth);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.35 + aSeed.x * 0.9) * (28.0 / -mv.z);

    vMix = aSeed.z;
    vAlpha = mix(0.25, 1.0, depth);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vMix;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d) * vAlpha * 0.55;
    if (a < 0.001) discard;
    // Mostly warm white dust; the brightest seeds tip into terracotta.
    vec3 col = mix(uColorA, uColorB, smoothstep(0.62, 0.95, vMix));
    gl_FragColor = vec4(col, a);
  }
`;

function Particles({
  count,
  mouseTarget,
}: {
  count: number;
  mouseTarget: React.RefObject<THREE.Vector2>;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const { positions, seeds } = useMemo(() => {
    // Deterministic LCG keeps this render-pure and the field stable across remounts.
    let s = 1337;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 18;
      positions[i * 3 + 1] = (rand() - 0.5) * 10;
      positions[i * 3 + 2] = (rand() - 0.5) * 6;
      seeds[i * 3] = rand();
      seeds[i * 3 + 1] = rand();
      seeds[i * 3 + 2] = rand();
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 10 },
      uColorA: { value: WARM_WHITE },
      uColorB: { value: ACCENT },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uTime.value += delta;
    mouse.current.lerp(mouseTarget.current, Math.min(delta * 3, 1));
    (u.uMouse.value as THREE.Vector2).copy(mouse.current);
  });

  return (
    <points key={count}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroCanvas() {
  const wrapper = useRef<HTMLDivElement>(null);
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const [inView, setInView] = useState(true);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  // Pause the render loop when the hero scrolls out of view.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: PointerEvent) => {
      mouseTarget.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [isMobile]);

  return (
    <div ref={wrapper} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={isMobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Particles count={isMobile ? 450 : 1400} mouseTarget={mouseTarget} />
      </Canvas>
    </div>
  );
}
