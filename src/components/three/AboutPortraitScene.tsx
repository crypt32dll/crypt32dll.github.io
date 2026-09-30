'use client'

import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type MutableRefObject, Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { Group, Mesh, Points, ShaderMaterial } from 'three'
import * as THREE from 'three'
import { PortfolioCanvas } from '@/components/three/SceneCanvas'

const ACCENT = '#d4b08a'
const ACCENT_SOFT = '#e0bc96'
const INK = '#f2f0eb'
const VOID = '#0c0b09'

const portraitVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const portraitFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uHover;
  uniform vec3 uAccent;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float r = length(centered);
    float angle = atan(centered.y, centered.x);

    float breathe = 0.012 * sin(uTime * 0.7);
    float mask = 1.0 - smoothstep(0.46 + breathe, 0.5, r);

    float fringe = smoothstep(0.38, 0.5, r) * (0.55 + 0.45 * uHover);
    vec2 offset = centered * fringe * 0.018;
    float rCh = texture2D(uMap, vUv + offset).r;
    float gCh = texture2D(uMap, vUv).g;
    float bCh = texture2D(uMap, vUv - offset).b;
    vec3 color = vec3(rCh, gCh, bCh);

    float rim = smoothstep(0.34, 0.49, r) * (1.0 - smoothstep(0.49, 0.5, r));
    float pulse = 0.55 + 0.45 * sin(uTime * 1.4 + angle * 3.0);
    color += uAccent * rim * (0.55 + 0.35 * pulse + 0.25 * uHover);

    float vignette = smoothstep(0.52, 0.18, r);
    color *= mix(0.88, 1.05, vignette);

    float sparkle = pow(max(0.0, sin(angle * 6.0 + uTime * 1.8)), 18.0) * rim * 0.35;
    color += uAccent * sparkle;

    gl_FragColor = vec4(color, mask);
  }
`

const auraFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uAccent;
  varying vec2 vUv;

  void main() {
    vec2 c = vUv - 0.5;
    float r = length(c);
    // Hard kill before plane edges so the canvas never shows a square cut
    float edgeFade = 1.0 - smoothstep(0.38, 0.48, r);
    float ring = exp(-pow((r - 0.22) / 0.07, 2.0));
    float core = exp(-pow(r / 0.16, 2.0));
    float swirl = 0.5 + 0.5 * sin(atan(c.y, c.x) * 4.0 + uTime * 0.6);
    float alpha = (core * 0.4 + ring * 0.5 * swirl) * (0.75 + 0.25 * sin(uTime * 0.9));
    alpha *= edgeFade;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uAccent, alpha);
  }
`

function PortraitDisc({
  texture,
  animate,
  hover,
}: {
  texture: THREE.Texture
  animate: boolean
  hover: MutableRefObject<number>
}) {
  const mat = useRef<ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uAccent: { value: new THREE.Color(ACCENT) },
    }),
    [texture],
  )

  useFrame((state) => {
    if (!mat.current) return
    const t = animate ? state.clock.elapsedTime : 0
    mat.current.uniforms.uTime.value = t
    mat.current.uniforms.uHover.value = THREE.MathUtils.lerp(
      mat.current.uniforms.uHover.value,
      hover.current,
      0.08,
    )
  })

  return (
    <mesh position={[0, 0, 0.04]} renderOrder={2}>
      <circleGeometry args={[1.08, 96]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        toneMapped={false}
        vertexShader={portraitVertex}
        fragmentShader={portraitFragment}
        uniforms={uniforms}
      />
    </mesh>
  )
}

function SoftAura({ animate }: { animate: boolean }) {
  const mat = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAccent: { value: new THREE.Color(ACCENT) },
    }),
    [],
  )

  useFrame((state) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value = animate ? state.clock.elapsedTime : 0
  })

  return (
    <mesh position={[0, 0, -0.12]} scale={1.72} renderOrder={0}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        vertexShader={portraitVertex}
        fragmentShader={auraFragment}
        uniforms={uniforms}
      />
    </mesh>
  )
}

function OrbitalRings({ animate }: { animate: boolean }) {
  const slow = useRef<Group>(null)
  const mid = useRef<Group>(null)
  const fast = useRef<Group>(null)

  const geos = useMemo(
    () => ({
      accent: new THREE.TorusGeometry(1.22, 0.01, 10, 128),
      outer: new THREE.TorusGeometry(1.38, 0.006, 8, 160),
      tilt: new THREE.TorusGeometry(1.3, 0.005, 8, 140),
    }),
    [],
  )

  useFrame((state) => {
    if (!animate) return
    const t = state.clock.elapsedTime
    if (slow.current) {
      slow.current.rotation.z = t * 0.12
      slow.current.rotation.x = Math.sin(t * 0.22) * 0.08
    }
    if (mid.current) {
      mid.current.rotation.z = -t * 0.28
      mid.current.rotation.y = Math.sin(t * 0.35) * 0.15
    }
    if (fast.current) {
      fast.current.rotation.z = t * 0.55
      fast.current.rotation.x = 0.85 + Math.sin(t * 0.4) * 0.12
    }
  })

  return (
    <>
      <group ref={slow}>
        <mesh geometry={geos.accent} rotation={[Math.PI / 2.35, 0.18, 0]}>
          <meshBasicMaterial color={ACCENT} transparent opacity={0.85} />
        </mesh>
        <mesh geometry={geos.outer} rotation={[Math.PI / 2.05, -0.12, 0.3]}>
          <meshBasicMaterial color={INK} transparent opacity={0.22} />
        </mesh>
      </group>

      <group ref={mid}>
        <mesh rotation={[0.95, 0.35, 0.15]}>
          <ringGeometry args={[1.08, 1.115, 96]} />
          <meshBasicMaterial
            color={ACCENT_SOFT}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={geos.tilt} rotation={[1.1, -0.4, 0.6]}>
          <meshBasicMaterial color={ACCENT} transparent opacity={0.35} />
        </mesh>
      </group>

      <group ref={fast}>
        {Array.from({ length: 18 }, (_, i) => {
          const a = (i / 18) * Math.PI * 2
          const r = 1.32
          return (
            <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r * 0.42, Math.sin(a) * 0.18]}>
              <boxGeometry args={[0.03, 0.03, 0.03 + (i % 3) * 0.018]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? ACCENT : VOID}
                roughness={0.35}
                metalness={0.55}
                emissive={i % 3 === 0 ? ACCENT : VOID}
                emissiveIntensity={i % 3 === 0 ? 0.35 : 0}
                transparent
                opacity={0.8}
              />
            </mesh>
          )
        })}
      </group>
    </>
  )
}

function DriftParticles({ animate }: { animate: boolean }) {
  const points = useRef<Points>(null)
  const count = 48

  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 1.15 + Math.random() * 0.45
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.55
      speeds[i] = 0.15 + Math.random() * 0.45
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry, speeds }
  }, [])

  useFrame((state) => {
    if (!points.current || !animate) return
    const t = state.clock.elapsedTime
    const arr = points.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      arr[ix + 1] += Math.sin(t * speeds[i] + i) * 0.0012
      arr[ix] += Math.cos(t * speeds[i] * 0.7 + i) * 0.0006
    }
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.z = t * 0.04
  })

  return (
    <points ref={points} geometry={geometry} renderOrder={1}>
      <pointsMaterial
        color={ACCENT_SOFT}
        size={0.035}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function AccentOrbs({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current || !animate) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = -t * 0.32
    group.current.rotation.z = Math.sin(t * 0.38) * 0.08
    const children = group.current.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as Mesh
      child.rotation.x = t * (0.4 + i * 0.1)
      child.rotation.y = t * (0.3 + i * 0.08)
      child.position.y = Math.sin(t * 0.9 + i * 1.3) * 0.08
    }
  })

  return (
    <group ref={group}>
      <mesh position={[1.08, 0.62, 0.36]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color={ACCENT}
          roughness={0.25}
          metalness={0.7}
          emissive={ACCENT}
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[-1.1, -0.48, 0.28]}>
        <icosahedronGeometry args={[0.095, 0]} />
        <meshStandardMaterial color={ACCENT_SOFT} roughness={0.4} metalness={0.45} wireframe />
      </mesh>
      <mesh position={[0.82, -0.82, 0.24]}>
        <tetrahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color={VOID}
          roughness={0.5}
          metalness={0.3}
          emissive={ACCENT}
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  )
}

function PortraitRig({ animate, onReady }: { animate: boolean; onReady?: () => void }) {
  const root = useRef<Group>(null)
  const plate = useRef<Mesh>(null)
  const hover = useRef(0)
  const texture = useTexture('/images/portrait/avatar.webp')

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.anisotropy = 8
    texture.repeat.set(0.9, 0.88)
    texture.offset.set(0.05, 0.02)
    texture.needsUpdate = true
  }, [texture])

  useEffect(() => {
    // Let the first textured frame settle, then reveal over the loader
    const id = window.setTimeout(() => onReady?.(), 120)
    return () => window.clearTimeout(id)
  }, [onReady, texture])

  useFrame((state) => {
    if (!root.current) return
    const t = state.clock.elapsedTime
    const { x, y } = state.pointer
    const over = Math.hypot(x, y) < 0.55 ? 1 : 0
    hover.current = THREE.MathUtils.lerp(hover.current, over, 0.06)

    if (animate) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, x * 0.28, 0.06)
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -y * 0.16, 0.06)
      root.current.position.y = Math.sin(t * 0.7) * 0.035
      const s = 0.78 + hover.current * 0.03
      root.current.scale.setScalar(THREE.MathUtils.lerp(root.current.scale.x, s, 0.08))
      if (plate.current) {
        plate.current.rotation.z = Math.sin(t * 0.25) * 0.04
      }
    } else {
      root.current.rotation.set(0, 0, 0)
      root.current.position.y = 0
      root.current.scale.setScalar(0.78)
    }
  })

  return (
    <group ref={root} scale={0.78}>
      <SoftAura animate={animate} />

      <mesh ref={plate} position={[0, 0, -0.02]}>
        <circleGeometry args={[1.12, 64]} />
        <meshStandardMaterial color="#161410" roughness={0.92} metalness={0.08} />
      </mesh>

      <PortraitDisc texture={texture} animate={animate} hover={hover} />
      <OrbitalRings animate={animate} />
      <AccentOrbs animate={animate} />
      <DriftParticles animate={animate} />
    </group>
  )
}

export function AboutPortraitScene({ onReady }: { onReady?: () => void }) {
  return (
    <div className="about-portrait-stage relative mx-auto aspect-square w-full max-w-lg lg:max-w-none">
      <div
        className="pointer-events-none absolute inset-[-6%] rounded-full opacity-90"
        style={{
          background:
            'radial-gradient(circle at 42% 36%, color-mix(in srgb, var(--color-accent) 28%, transparent), transparent 68%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[18%] rounded-full mix-blend-soft-light"
        style={{
          background:
            'radial-gradient(circle at 58% 68%, color-mix(in srgb, var(--color-ink) 12%, transparent), transparent 58%)',
        }}
        aria-hidden
      />
      <PortfolioCanvas
        className="relative z-10 !h-full !w-full"
        camera={{ position: [0, 0, 5.6], fov: 32 }}
      >
        {({ animate }) => (
          <Suspense fallback={null}>
            <PortraitRig animate={animate} onReady={onReady} />
          </Suspense>
        )}
      </PortfolioCanvas>
      <span className="sr-only">Portrait of Fabian Schultz-Fademrecht</span>
    </div>
  )
}
