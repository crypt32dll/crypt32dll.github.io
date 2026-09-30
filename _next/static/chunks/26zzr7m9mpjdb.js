(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,89664,83826,e=>{"use strict";var r=e.i(60668);e.s(["useThree",()=>r.D],89664),e.s(["useLoader",()=>r.H],83826)},90348,e=>{"use strict";var r=e.i(2384),t=e.i(35393),a=e.i(95418),n=e.i(89664),o=e.i(83826);let s=e=>e===Object(e)&&!Array.isArray(e)&&"function"!=typeof e;function i(e,r){let i=(0,n.useThree)(e=>e.gl),l=(0,o.useLoader)(a.TextureLoader,s(e)?Object.values(e):e);return(0,t.useLayoutEffect)(()=>{null==r||r(l)},[r]),(0,t.useEffect)(()=>{if("initTexture"in i){let e=[];Array.isArray(l)?e=l:l instanceof a.Texture?e=[l]:s(l)&&(e=Object.values(l)),e.forEach(e=>{e instanceof a.Texture&&i.initTexture(e)})}},[i,l]),(0,t.useMemo)(()=>{if(!s(e))return l;{let r={},t=0;for(let a in e)r[a]=l[t++];return r}},[e,l])}i.preload=e=>o.useLoader.preload(a.TextureLoader,e),i.clear=e=>o.useLoader.clear(a.TextureLoader,e);var l=e.i(95392),u=e.i(21928);let c="#d4b08a",m="#e0bc96",d="#0c0b09",h=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,f=`
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
`,p=`
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
`;function v({texture:e,animate:n,hover:o}){let s=(0,t.useRef)(null),i=(0,t.useMemo)(()=>({uMap:{value:e},uTime:{value:0},uHover:{value:0},uAccent:{value:new a.Color(c)}}),[e]);return(0,l.useFrame)(e=>{if(!s.current)return;let r=n?e.clock.elapsedTime:0;s.current.uniforms.uTime.value=r,s.current.uniforms.uHover.value=a.MathUtils.lerp(s.current.uniforms.uHover.value,o.current,.08)}),(0,r.jsxs)("mesh",{position:[0,0,.04],renderOrder:2,children:[(0,r.jsx)("circleGeometry",{args:[1.08,96]}),(0,r.jsx)("shaderMaterial",{ref:s,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:h,fragmentShader:f,uniforms:i})]})}function x({animate:e}){let n=(0,t.useRef)(null),o=(0,t.useMemo)(()=>({uTime:{value:0},uAccent:{value:new a.Color(c)}}),[]);return(0,l.useFrame)(r=>{n.current&&(n.current.uniforms.uTime.value=e?r.clock.elapsedTime:0)}),(0,r.jsxs)("mesh",{position:[0,0,-.12],scale:1.72,renderOrder:0,children:[(0,r.jsx)("planeGeometry",{args:[2,2]}),(0,r.jsx)("shaderMaterial",{ref:n,transparent:!0,depthWrite:!1,toneMapped:!1,blending:a.AdditiveBlending,vertexShader:h,fragmentShader:p,uniforms:o})]})}function g({animate:e}){let n=(0,t.useRef)(null),o=(0,t.useRef)(null),s=(0,t.useRef)(null),i=(0,t.useMemo)(()=>({accent:new a.TorusGeometry(1.22,.01,10,128),outer:new a.TorusGeometry(1.38,.006,8,160),tilt:new a.TorusGeometry(1.3,.005,8,140)}),[]);return(0,l.useFrame)(r=>{if(!e)return;let t=r.clock.elapsedTime;n.current&&(n.current.rotation.z=.12*t,n.current.rotation.x=.08*Math.sin(.22*t)),o.current&&(o.current.rotation.z=-(.28*t),o.current.rotation.y=.15*Math.sin(.35*t)),s.current&&(s.current.rotation.z=.55*t,s.current.rotation.x=.85+.12*Math.sin(.4*t))}),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("group",{ref:n,children:[(0,r.jsx)("mesh",{geometry:i.accent,rotation:[Math.PI/2.35,.18,0],children:(0,r.jsx)("meshBasicMaterial",{color:c,transparent:!0,opacity:.85})}),(0,r.jsx)("mesh",{geometry:i.outer,rotation:[Math.PI/2.05,-.12,.3],children:(0,r.jsx)("meshBasicMaterial",{color:"#f2f0eb",transparent:!0,opacity:.22})})]}),(0,r.jsxs)("group",{ref:o,children:[(0,r.jsxs)("mesh",{rotation:[.95,.35,.15],children:[(0,r.jsx)("ringGeometry",{args:[1.08,1.115,96]}),(0,r.jsx)("meshBasicMaterial",{color:m,transparent:!0,opacity:.5,side:a.DoubleSide})]}),(0,r.jsx)("mesh",{geometry:i.tilt,rotation:[1.1,-.4,.6],children:(0,r.jsx)("meshBasicMaterial",{color:c,transparent:!0,opacity:.35})})]}),(0,r.jsx)("group",{ref:s,children:Array.from({length:18},(e,t)=>{let a=t/18*Math.PI*2;return(0,r.jsxs)("mesh",{position:[1.32*Math.cos(a),1.32*Math.sin(a)*.42,.18*Math.sin(a)],children:[(0,r.jsx)("boxGeometry",{args:[.03,.03,.03+t%3*.018]}),(0,r.jsx)("meshStandardMaterial",{color:t%2==0?c:d,roughness:.35,metalness:.55,emissive:t%3==0?c:d,emissiveIntensity:.35*(t%3==0),transparent:!0,opacity:.8})]},t)})})]})}function y({animate:e}){let n=(0,t.useRef)(null),{geometry:o,speeds:s}=(0,t.useMemo)(()=>{let e=new Float32Array(144),r=new Float32Array(48);for(let t=0;t<48;t++){let a=Math.random()*Math.PI*2,n=1.15+.45*Math.random();e[3*t]=Math.cos(a)*n,e[3*t+1]=(Math.random()-.5)*1.6,e[3*t+2]=(Math.random()-.5)*.55,r[t]=.15+.45*Math.random()}let t=new a.BufferGeometry;return t.setAttribute("position",new a.BufferAttribute(e,3)),{geometry:t,speeds:r}},[]);return(0,l.useFrame)(r=>{if(!n.current||!e)return;let t=r.clock.elapsedTime,a=n.current.geometry.attributes.position.array;for(let e=0;e<48;e++){let r=3*e;a[r+1]+=.0012*Math.sin(t*s[e]+e),a[r]+=6e-4*Math.cos(t*s[e]*.7+e)}n.current.geometry.attributes.position.needsUpdate=!0,n.current.rotation.z=.04*t}),(0,r.jsx)("points",{ref:n,geometry:o,renderOrder:1,children:(0,r.jsx)("pointsMaterial",{color:m,size:.035,transparent:!0,opacity:.55,depthWrite:!1,sizeAttenuation:!0})})}function j({animate:e}){let a=(0,t.useRef)(null);return(0,l.useFrame)(r=>{if(!a.current||!e)return;let t=r.clock.elapsedTime;a.current.rotation.y=-(.32*t),a.current.rotation.z=.08*Math.sin(.38*t);let n=a.current.children;for(let e=0;e<n.length;e++){let r=n[e];r.rotation.x=t*(.4+.1*e),r.rotation.y=t*(.3+.08*e),r.position.y=.08*Math.sin(.9*t+1.3*e)}}),(0,r.jsxs)("group",{ref:a,children:[(0,r.jsxs)("mesh",{position:[1.08,.62,.36],children:[(0,r.jsx)("octahedronGeometry",{args:[.12,0]}),(0,r.jsx)("meshStandardMaterial",{color:c,roughness:.25,metalness:.7,emissive:c,emissiveIntensity:.25})]}),(0,r.jsxs)("mesh",{position:[-1.1,-.48,.28],children:[(0,r.jsx)("icosahedronGeometry",{args:[.095,0]}),(0,r.jsx)("meshStandardMaterial",{color:m,roughness:.4,metalness:.45,wireframe:!0})]}),(0,r.jsxs)("mesh",{position:[.82,-.82,.24],children:[(0,r.jsx)("tetrahedronGeometry",{args:[.1,0]}),(0,r.jsx)("meshStandardMaterial",{color:d,roughness:.5,metalness:.3,emissive:c,emissiveIntensity:.15})]})]})}function M({animate:e,onReady:n}){let o=(0,t.useRef)(null),s=(0,t.useRef)(null),u=(0,t.useRef)(0),c=i("/images/portrait/avatar.webp");return(0,t.useLayoutEffect)(()=>{c.colorSpace=a.SRGBColorSpace,c.wrapS=a.ClampToEdgeWrapping,c.wrapT=a.ClampToEdgeWrapping,c.anisotropy=8,c.repeat.set(.9,.88),c.offset.set(.05,.02),c.needsUpdate=!0},[c]),(0,t.useEffect)(()=>{let e=window.setTimeout(()=>n?.(),120);return()=>window.clearTimeout(e)},[n,c]),(0,l.useFrame)(r=>{if(!o.current)return;let t=r.clock.elapsedTime,{x:n,y:i}=r.pointer,l=+(.55>Math.hypot(n,i));if(u.current=a.MathUtils.lerp(u.current,l,.06),e){o.current.rotation.y=a.MathUtils.lerp(o.current.rotation.y,.28*n,.06),o.current.rotation.x=a.MathUtils.lerp(o.current.rotation.x,-(.16*i),.06),o.current.position.y=.035*Math.sin(.7*t);let e=.78+.03*u.current;o.current.scale.setScalar(a.MathUtils.lerp(o.current.scale.x,e,.08)),s.current&&(s.current.rotation.z=.04*Math.sin(.25*t))}else o.current.rotation.set(0,0,0),o.current.position.y=0,o.current.scale.setScalar(.78)}),(0,r.jsxs)("group",{ref:o,scale:.78,children:[(0,r.jsx)(x,{animate:e}),(0,r.jsxs)("mesh",{ref:s,position:[0,0,-.02],children:[(0,r.jsx)("circleGeometry",{args:[1.12,64]}),(0,r.jsx)("meshStandardMaterial",{color:"#161410",roughness:.92,metalness:.08})]}),(0,r.jsx)(v,{texture:c,animate:e,hover:u}),(0,r.jsx)(g,{animate:e}),(0,r.jsx)(j,{animate:e}),(0,r.jsx)(y,{animate:e})]})}e.s(["AboutPortraitScene",0,function({onReady:e}){return(0,r.jsxs)("div",{className:"about-portrait-stage relative mx-auto aspect-square w-full max-w-lg lg:max-w-none",children:[(0,r.jsx)("div",{className:"pointer-events-none absolute inset-[-6%] rounded-full opacity-90",style:{background:"radial-gradient(circle at 42% 36%, color-mix(in srgb, var(--color-accent) 28%, transparent), transparent 68%)"},"aria-hidden":!0}),(0,r.jsx)("div",{className:"pointer-events-none absolute inset-[18%] rounded-full mix-blend-soft-light",style:{background:"radial-gradient(circle at 58% 68%, color-mix(in srgb, var(--color-ink) 12%, transparent), transparent 58%)"},"aria-hidden":!0}),(0,r.jsx)(u.PortfolioCanvas,{className:"relative z-10 !h-full !w-full",camera:{position:[0,0,5.6],fov:32},children:({animate:a})=>(0,r.jsx)(t.Suspense,{fallback:null,children:(0,r.jsx)(M,{animate:a,onReady:e})})}),(0,r.jsx)("span",{className:"sr-only",children:"Portrait of Fabian Schultz-Fademrecht"})]})}],90348)}]);