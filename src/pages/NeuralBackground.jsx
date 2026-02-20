import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";

const NeuralBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // ── Config ────────────────────────────────────────────────────────────
        const config = { paused: false, activePaletteIndex: 2, currentFormation: 0, densityFactor: 1 };
        const clock = new THREE.Clock();

        const colorPalettes = [
            [new THREE.Color(0x667eea), new THREE.Color(0x764ba2), new THREE.Color(0xf093fb), new THREE.Color(0x9d50bb), new THREE.Color(0x6e48aa)],
            [new THREE.Color(0xf857a6), new THREE.Color(0xff5858), new THREE.Color(0xfeca57), new THREE.Color(0xff6348), new THREE.Color(0xff9068)],
            [new THREE.Color(0x4facfe), new THREE.Color(0x00f2fe), new THREE.Color(0x43e97b), new THREE.Color(0x38f9d7), new THREE.Color(0x4484ce)],
        ];

        // ── Scene / Camera ────────────────────────────────────────────────────
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.002);

        const isSmallMobile = window.innerWidth <= 480;
        const isMobile = window.innerWidth <= 768;
        const cameraZ = isSmallMobile ? 50 : isMobile ? 42 : 38;
        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 8, cameraZ);

        // ── Renderer ──────────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // ── Starfield ─────────────────────────────────────────────────────────
        function createStarfield() {
            const count = 8000;
            const positions = [], colors = [], sizes = [];
            for (let i = 0; i < count; i++) {
                const r = THREE.MathUtils.randFloat(50, 150);
                const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
                const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
                positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
                const c = Math.random();
                if (c < 0.70) colors.push(1, 1, 1);
                else if (c < 0.85) colors.push(0.7, 0.8, 1);
                else colors.push(1, 0.9, 0.8);
                sizes.push(THREE.MathUtils.randFloat(0.1, 0.3));
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
            geo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
            const mat = new THREE.ShaderMaterial({
                uniforms: { uTime: { value: 0 } },
                vertexShader: `
                    attribute float size; attribute vec3 color; varying vec3 vColor; uniform float uTime;
                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
                        float twinkle = sin(uTime*2.0+position.x*100.0)*0.3+0.7;
                        gl_PointSize = size*twinkle*(300.0/-mvPosition.z);
                        gl_Position = projectionMatrix*mvPosition;
                    }`,
                fragmentShader: `
                    varying vec3 vColor;
                    void main() {
                        vec2 c=gl_PointCoord-0.5; float d=length(c);
                        if(d>0.5)discard;
                        float a=1.0-smoothstep(0.0,0.5,d);
                        gl_FragColor=vec4(vColor,a*0.8);
                    }`,
                transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            });
            return new THREE.Points(geo, mat);
        }
        const starField = createStarfield();
        scene.add(starField);

        // ── Controls ──────────────────────────────────────────────────────────
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.6;
        controls.minDistance = 8;
        controls.maxDistance = 80;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.2;
        controls.enablePan = false;

        // ── Post-processing ───────────────────────────────────────────────────
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.4, 0.85);
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());

        // ── Pulse uniforms ────────────────────────────────────────────────────
        const pulseUniforms = {
            uTime: { value: 0.0 },
            uPulsePositions: { value: [new THREE.Vector3(1e3, 1e3, 1e3), new THREE.Vector3(1e3, 1e3, 1e3), new THREE.Vector3(1e3, 1e3, 1e3)] },
            uPulseTimes: { value: [-1e3, -1e3, -1e3] },
            uPulseColors: { value: [new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1)] },
            uPulseSpeed: { value: 18.0 },
            uBaseNodeSize: { value: 0.6 },
        };

        // ── GLSL noise ────────────────────────────────────────────────────────
        const noiseFunctions = `
        vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
        vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
        vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
        float snoise(vec3 v){
            const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
            vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
            vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;
            vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
            vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
            i=mod289(i);
            vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
            float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
            vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
            vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
            vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
            vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
            vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
            vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
            vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
            p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
            vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
            return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }`;

        const pulseIntensityGLSL = `
        float getPulseIntensity(vec3 worldPos,vec3 pulsePos,float pulseTime){
            if(pulseTime<0.0)return 0.0;
            float t=uTime-pulseTime;
            if(t<0.0||t>4.0)return 0.0;
            float r=t*uPulseSpeed;float d=distance(worldPos,pulsePos);
            return smoothstep(3.0,0.0,abs(d-r))*smoothstep(4.0,0.0,t);
        }`;

        const nodeShader = {
            vertexShader: `${noiseFunctions}
            attribute float nodeSize,nodeType,distanceFromRoot,nodeShape;
            attribute vec3 nodeColor;
            uniform float uTime,uPulseSpeed,uBaseNodeSize;
            uniform vec3 uPulsePositions[3];
            uniform float uPulseTimes[3];
            varying vec3 vColor;varying float vNodeType,vPulseIntensity,vDistanceFromRoot,vGlow,vNodeShape;varying vec3 vPosition;
            ${pulseIntensityGLSL}
            void main(){
                vNodeType=nodeType;vColor=nodeColor;vDistanceFromRoot=distanceFromRoot;vNodeShape=nodeShape;
                vec3 worldPos=(modelMatrix*vec4(position,1.0)).xyz;vPosition=worldPos;
                float totalPulse=0.0;
                for(int i=0;i<3;i++)totalPulse+=getPulseIntensity(worldPos,uPulsePositions[i],uPulseTimes[i]);
                vPulseIntensity=min(totalPulse,1.0);
                float breathe=sin(uTime*0.7+distanceFromRoot*0.15)*0.15+0.85;
                float pulseSize=nodeSize*breathe*(1.0+vPulseIntensity*2.5);
                vGlow=0.5+0.5*sin(uTime*0.5+distanceFromRoot*0.2);
                vec3 modPos=position;
                if(nodeType>0.5){float noise=snoise(position*0.08+uTime*0.08);modPos+=normal*noise*0.15;}
                vec4 mvPos=modelViewMatrix*vec4(modPos,1.0);
                gl_PointSize=pulseSize*uBaseNodeSize*(1000.0/-mvPos.z);
                gl_Position=projectionMatrix*mvPos;
            }`,
            fragmentShader: `
            uniform float uTime;uniform vec3 uPulseColors[3];
            varying vec3 vColor;varying float vNodeType,vPulseIntensity,vDistanceFromRoot,vGlow,vNodeShape;varying vec3 vPosition;
            float sdRoundBox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
            void main(){
                vec2 center=2.0*gl_PointCoord-1.0;float dist=length(center);float shapeMask=0.0;
                if(vNodeShape<0.5){if(dist>1.0)discard;shapeMask=1.0-smoothstep(0.0,1.0,dist);}
                else if(vNodeShape<1.5){
                    float screen=sdRoundBox(center*vec2(1.0,1.2)+vec2(0.0,-0.1),vec2(0.75,0.55),0.12);
                    float stand=sdRoundBox(center+vec2(0.0,-0.8),vec2(0.1,0.2),0.02);
                    float base=sdRoundBox(center+vec2(0.0,-0.95),vec2(0.3,0.06),0.03);
                    float d=min(min(screen,stand),base);if(d>0.15)discard;shapeMask=1.0-smoothstep(0.0,0.15,d);
                } else if(vNodeShape<2.5){
                    float chip=sdRoundBox(center,vec2(0.5,0.5),0.08);float pins=1.0;
                    for(float i=-0.3;i<=0.31;i+=0.2){
                        pins=min(pins,sdRoundBox(center+vec2(0.0,i),vec2(0.8,0.04),0.01));
                        pins=min(pins,sdRoundBox(center+vec2(i,0.0),vec2(0.04,0.8),0.01));
                    }
                    float d=min(chip,pins);if(d>0.15)discard;shapeMask=1.0-smoothstep(0.0,0.15,d);
                } else {
                    float diamond=abs(center.x)+abs(center.y)-0.7;float ic=length(center)-0.3;
                    float crossH=sdRoundBox(center,vec2(0.35,0.02),0.01);float crossV=sdRoundBox(center,vec2(0.02,0.35),0.01);
                    float d=min(diamond,min(abs(ic)-0.03,min(crossH,crossV)));if(d>0.15)discard;shapeMask=1.0-smoothstep(0.0,0.15,d);
                }
                float glowStr=shapeMask*0.5+(1.0-smoothstep(0.0,1.0,dist))*0.2;
                float breatheColor=0.7+0.08*sin(uTime*0.6+vDistanceFromRoot*0.25);
                vec3 baseColor=vColor*breatheColor*0.6;vec3 finalColor=baseColor;
                if(vPulseIntensity>0.0){
                    vec3 pc=mix(vec3(0.8),uPulseColors[0],0.5);
                    finalColor=mix(baseColor,pc,vPulseIntensity*0.6);finalColor*=(1.0+vPulseIntensity*0.8);
                    glowStr*=(1.0+vPulseIntensity*0.6);
                }
                finalColor+=vec3(0.8)*shapeMask*0.15;float alpha=glowStr*0.7;
                float camDist=length(vPosition-cameraPosition);float df=smoothstep(100.0,15.0,camDist);
                if(vNodeType>0.5){finalColor*=0.9;alpha*=0.8;}
                finalColor*=(1.0+vGlow*0.05);if(vNodeShape>0.5)finalColor*=1.1;
                gl_FragColor=vec4(finalColor,alpha*df);
            }`,
        };

        const connectionShader = {
            vertexShader: `${noiseFunctions}
            attribute vec3 startPoint,endPoint,connectionColor;
            attribute float connectionStrength,pathIndex;
            uniform float uTime,uPulseSpeed;
            uniform vec3 uPulsePositions[3];uniform float uPulseTimes[3];
            varying vec3 vColor;varying float vConnectionStrength,vPulseIntensity,vPathPosition,vDistanceFromCamera;
            ${pulseIntensityGLSL}
            void main(){
                float t=position.x;vPathPosition=t;
                vec3 mid=mix(startPoint,endPoint,0.5);
                float off=sin(t*3.14159)*0.15;
                vec3 perp=normalize(cross(normalize(endPoint-startPoint),vec3(0.0,1.0,0.0)));
                if(length(perp)<0.1)perp=vec3(1.0,0.0,0.0);
                mid+=perp*off;
                vec3 p0=mix(startPoint,mid,t);vec3 p1=mix(mid,endPoint,t);vec3 finalPos=mix(p0,p1,t);
                float noise=snoise(vec3(pathIndex*0.08,t*0.6,uTime*0.15));finalPos+=perp*noise*0.12;
                vec3 worldPos=(modelMatrix*vec4(finalPos,1.0)).xyz;
                float totalPulse=0.0;
                for(int i=0;i<3;i++)totalPulse+=getPulseIntensity(worldPos,uPulsePositions[i],uPulseTimes[i]);
                vPulseIntensity=min(totalPulse,1.0);vColor=connectionColor;vConnectionStrength=connectionStrength;
                vDistanceFromCamera=length(worldPos-cameraPosition);
                gl_Position=projectionMatrix*modelViewMatrix*vec4(finalPos,1.0);
            }`,
            fragmentShader: `
            uniform float uTime;uniform vec3 uPulseColors[3];
            varying vec3 vColor;varying float vConnectionStrength,vPulseIntensity,vPathPosition,vDistanceFromCamera;
            void main(){
                float f1=sin(vPathPosition*25.0-uTime*4.0)*0.5+0.5;
                float f2=sin(vPathPosition*15.0-uTime*2.5+1.57)*0.5+0.5;
                float cf=(f1+f2*0.5)/1.5;
                vec3 baseColor=vColor*(0.8+0.2*sin(uTime*0.6+vPathPosition*12.0));
                float fi=0.4*cf*vConnectionStrength;vec3 finalColor=baseColor;
                if(vPulseIntensity>0.0){
                    vec3 pc=mix(vec3(1.0),uPulseColors[0],0.3);
                    finalColor=mix(baseColor,pc*1.2,vPulseIntensity*0.7);fi+=vPulseIntensity*0.8;
                }
                finalColor*=(0.7+fi+vConnectionStrength*0.5);
                float alpha=(0.7*vConnectionStrength+cf*0.3);
                alpha=mix(alpha,min(1.0,alpha*2.5),vPulseIntensity);
                gl_FragColor=vec4(finalColor,alpha*smoothstep(100.0,15.0,vDistanceFromCamera));
            }`,
        };

        // ── Node class ────────────────────────────────────────────────────────
        class Node {
            constructor(position, level = 0, type = 0) {
                this.position = position; this.connections = [];
                this.level = level; this.type = type;
                this.size = type === 0 ? THREE.MathUtils.randFloat(0.8, 1.4) : THREE.MathUtils.randFloat(0.5, 1.0);
                this.distanceFromRoot = 0;
            }
            addConnection(node, strength = 1.0) {
                if (!this.isConnectedTo(node)) {
                    this.connections.push({ node, strength });
                    node.connections.push({ node: this, strength });
                }
            }
            isConnectedTo(node) { return this.connections.some(c => c.node === node); }
        }

        // ── Network generation ────────────────────────────────────────────────
        function generateNeuralNetwork(formationIndex, densityFactor = 1.0) {
            let nodes = []; let rootNode;
            function generateCrystallineSphere() {
                rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0); rootNode.size = 2.0; nodes.push(rootNode);
                const layers = 5; const goldenRatio = (1 + Math.sqrt(5)) / 2;
                for (let layer = 1; layer <= layers; layer++) {
                    const radius = layer * 4; const numPoints = Math.floor(layer * 12 * densityFactor);
                    for (let i = 0; i < numPoints; i++) {
                        const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
                        const theta = 2 * Math.PI * i / goldenRatio;
                        const pos = new THREE.Vector3(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
                        const isLeaf = layer === layers || Math.random() < 0.3;
                        const node = new Node(pos, layer, isLeaf ? 1 : 0); node.distanceFromRoot = radius; nodes.push(node);
                        if (layer > 1) {
                            const prev = nodes.filter(n => n.level === layer - 1 && n !== rootNode).sort((a, b) => pos.distanceTo(a.position) - pos.distanceTo(b.position));
                            for (let j = 0; j < Math.min(3, prev.length); j++) { const dist = pos.distanceTo(prev[j].position); node.addConnection(prev[j], Math.max(0.3, 1.0 - (dist / (radius * 2)))); }
                        } else { rootNode.addConnection(node, 0.9); }
                    }
                    const layerNodes = nodes.filter(n => n.level === layer && n !== rootNode);
                    for (let i = 0; i < layerNodes.length; i++) {
                        const node = layerNodes[i];
                        const nearby = layerNodes.filter(n => n !== node).sort((a, b) => node.position.distanceTo(a.position) - node.position.distanceTo(b.position)).slice(0, 5);
                        for (const nn of nearby) { if (node.position.distanceTo(nn.position) < radius * 0.8 && !node.isConnectedTo(nn)) node.addConnection(nn, 0.6); }
                    }
                }
                const outer = nodes.filter(n => n.level >= 3);
                for (let i = 0; i < Math.min(20, outer.length); i++) {
                    const n1 = outer[Math.floor(Math.random() * outer.length)]; const n2 = outer[Math.floor(Math.random() * outer.length)];
                    if (n1 !== n2 && !n1.isConnectedTo(n2) && Math.abs(n1.level - n2.level) > 1) n1.addConnection(n2, 0.4);
                }
            }
            function generateHelixLattice() {
                rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0); rootNode.size = 1.8; nodes.push(rootNode);
                const numHelices = 4, height = 30, maxRadius = 12, nodesPerHelix = Math.floor(50 * densityFactor); const helixArrays = [];
                for (let h = 0; h < numHelices; h++) {
                    const helixPhase = (h / numHelices) * Math.PI * 2; const helixNodes = [];
                    for (let i = 0; i < nodesPerHelix; i++) {
                        const t = i / (nodesPerHelix - 1); const y = (t - 0.5) * height;
                        const radiusScale = Math.sin(t * Math.PI) * 0.7 + 0.3; const radius = maxRadius * radiusScale;
                        const angle = helixPhase + t * Math.PI * 6;
                        const pos = new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle));
                        const level = Math.ceil(t * 5); const isLeaf = i > nodesPerHelix - 5 || Math.random() < 0.25;
                        const node = new Node(pos, level, isLeaf ? 1 : 0); node.distanceFromRoot = Math.sqrt(radius * radius + y * y);
                        node.helixIndex = h; node.helixT = t; nodes.push(node); helixNodes.push(node);
                    }
                    helixArrays.push(helixNodes); rootNode.addConnection(helixNodes[0], 1.0);
                    for (let i = 0; i < helixNodes.length - 1; i++)helixNodes[i].addConnection(helixNodes[i + 1], 0.85);
                }
                for (let h = 0; h < numHelices; h++) {
                    const cur = helixArrays[h]; const nxt = helixArrays[(h + 1) % numHelices];
                    for (let i = 0; i < cur.length; i += 5) { const idx = Math.round(cur[i].helixT * (nxt.length - 1)); if (idx < nxt.length) cur[i].addConnection(nxt[idx], 0.7); }
                }
                for (const helix of helixArrays) {
                    for (let i = 0; i < helix.length; i += 8) {
                        const node = helix[i]; const inner = nodes.filter(n => n !== node && n !== rootNode && n.distanceFromRoot < node.distanceFromRoot * 0.5);
                        if (inner.length > 0) { const nearest = inner.sort((a, b) => node.position.distanceTo(a.position) - node.position.distanceTo(b.position))[0]; node.addConnection(nearest, 0.5); }
                    }
                }
                const all = nodes.filter(n => n !== rootNode);
                for (let i = 0; i < Math.floor(30 * densityFactor); i++) {
                    const n1 = all[Math.floor(Math.random() * all.length)];
                    const nearby = all.filter(n => { const d = n.position.distanceTo(n1.position); return n !== n1 && d < 8 && d > 3 && !n1.isConnectedTo(n); });
                    if (nearby.length > 0) n1.addConnection(nearby[Math.floor(Math.random() * nearby.length)], 0.45);
                }
            }
            function generateFractalWeb() {
                rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0); rootNode.size = 1.6; nodes.push(rootNode);
                const branches = 6, maxDepth = 4;
                function createBranch(startNode, direction, depth, strength, scale) {
                    if (depth > maxDepth) return;
                    const bl = 5 * scale; const endPos = new THREE.Vector3().copy(startNode.position).add(direction.clone().multiplyScalar(bl));
                    const isLeaf = depth === maxDepth || Math.random() < 0.3;
                    const newNode = new Node(endPos, depth, isLeaf ? 1 : 0); newNode.distanceFromRoot = rootNode.position.distanceTo(endPos);
                    nodes.push(newNode); startNode.addConnection(newNode, strength);
                    if (depth < maxDepth) {
                        for (let i = 0; i < 3; i++) {
                            const angle = (i / 3) * Math.PI * 2;
                            const p1 = new THREE.Vector3(-direction.y, direction.x, 0).normalize(); const p2 = direction.clone().cross(p1).normalize();
                            const nd = new THREE.Vector3().copy(direction).add(p1.clone().multiplyScalar(Math.cos(angle) * 0.7)).add(p2.clone().multiplyScalar(Math.sin(angle) * 0.7)).normalize();
                            createBranch(newNode, nd, depth + 1, strength * 0.7, scale * 0.75);
                        }
                    }
                }
                for (let i = 0; i < branches; i++) {
                    const phi = Math.acos(1 - 2 * (i + 0.5) / branches); const theta = Math.PI * (1 + Math.sqrt(5)) * i;
                    createBranch(rootNode, new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)).normalize(), 1, 0.9, 1.0);
                }
                const leafNodes = nodes.filter(n => n.level >= 2);
                for (const node of leafNodes) {
                    const nearby = leafNodes.filter(n => { const d = n.position.distanceTo(node.position); return n !== node && d < 10 && !node.isConnectedTo(n); }).sort((a, b) => node.position.distanceTo(a.position) - node.position.distanceTo(b.position)).slice(0, 3);
                    for (const nn of nearby) if (Math.random() < 0.5 * densityFactor) node.addConnection(nn, 0.5);
                }
                const mid = nodes.filter(n => n.level >= 2 && n.level <= 3);
                for (const node of mid) {
                    if (Math.random() < 0.3) {
                        const inner = nodes.filter(n => n !== node && n.distanceFromRoot < node.distanceFromRoot * 0.6);
                        if (inner.length > 0) { const t = inner[Math.floor(Math.random() * inner.length)]; if (!node.isConnectedTo(t)) node.addConnection(t, 0.4); }
                    }
                }
            }
            switch (formationIndex % 3) { case 0: generateCrystallineSphere(); break; case 1: generateHelixLattice(); break; case 2: generateFractalWeb(); break; }
            return { nodes, rootNode };
        }

        // ── Build mesh ────────────────────────────────────────────────────────
        let nodesMesh = null, connectionsMesh = null;
        function createNetworkVisualization(formationIndex, densityFactor = 1.0) {
            if (nodesMesh) { scene.remove(nodesMesh); nodesMesh.geometry.dispose(); nodesMesh.material.dispose(); }
            if (connectionsMesh) { scene.remove(connectionsMesh); connectionsMesh.geometry.dispose(); connectionsMesh.material.dispose(); }
            const network = generateNeuralNetwork(formationIndex, densityFactor);
            if (!network || network.nodes.length === 0) return;
            const palette = colorPalettes[config.activePaletteIndex];
            // nodes
            const nPos = [], nType = [], nSize = [], nColor = [], nDist = [], nShape = [];
            network.nodes.forEach(node => {
                nPos.push(node.position.x, node.position.y, node.position.z); nType.push(node.type);
                const roll = Math.random(); let shape = 0;
                if (roll < 0.20) { shape = 1; node.size *= 1.8; } else if (roll < 0.40) { shape = 2; node.size *= 1.6; } else if (roll < 0.55) { shape = 3; node.size *= 1.5; }
                nShape.push(shape); nSize.push(node.size); nDist.push(node.distanceFromRoot);
                const ci = Math.min(node.level, palette.length - 1); const bc = palette[ci % palette.length].clone();
                bc.offsetHSL(THREE.MathUtils.randFloatSpread(0.03), THREE.MathUtils.randFloatSpread(0.08), THREE.MathUtils.randFloatSpread(0.08));
                nColor.push(bc.r, bc.g, bc.b);
            });
            const ng = new THREE.BufferGeometry();
            ng.setAttribute("position", new THREE.Float32BufferAttribute(nPos, 3)); ng.setAttribute("nodeType", new THREE.Float32BufferAttribute(nType, 1));
            ng.setAttribute("nodeSize", new THREE.Float32BufferAttribute(nSize, 1)); ng.setAttribute("nodeColor", new THREE.Float32BufferAttribute(nColor, 3));
            ng.setAttribute("distanceFromRoot", new THREE.Float32BufferAttribute(nDist, 1)); ng.setAttribute("nodeShape", new THREE.Float32BufferAttribute(nShape, 1));
            const nm = new THREE.ShaderMaterial({ uniforms: THREE.UniformsUtils.clone(pulseUniforms), vertexShader: nodeShader.vertexShader, fragmentShader: nodeShader.fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
            nodesMesh = new THREE.Points(ng, nm); scene.add(nodesMesh);
            // connections
            const cPos = [], cSP = [], cEP = [], cStr = [], cPIdx = [], cColor = []; let pi = 0; const processed = new Set();
            network.nodes.forEach((node, ni) => {
                node.connections.forEach(conn => {
                    const ci = network.nodes.indexOf(conn.node); if (ci === -1) return;
                    const key = [Math.min(ni, ci), Math.max(ni, ci)].join("-");
                    if (!processed.has(key)) {
                        processed.add(key);
                        const ns = 20;
                        for (let i = 0; i < ns; i++) {
                            const t = i / (ns - 1); cPos.push(t, 0, 0); cSP.push(node.position.x, node.position.y, node.position.z);
                            cEP.push(conn.node.position.x, conn.node.position.y, conn.node.position.z); cPIdx.push(pi); cStr.push(conn.strength);
                            const al = Math.min(Math.floor((node.level + conn.node.level) / 2), palette.length - 1);
                            const bc = palette[al % palette.length].clone(); bc.offsetHSL(THREE.MathUtils.randFloatSpread(0.03), THREE.MathUtils.randFloatSpread(0.08), THREE.MathUtils.randFloatSpread(0.08));
                            cColor.push(bc.r, bc.g, bc.b);
                        } pi++;
                    }
                });
            });
            const cg = new THREE.BufferGeometry();
            cg.setAttribute("position", new THREE.Float32BufferAttribute(cPos, 3)); cg.setAttribute("startPoint", new THREE.Float32BufferAttribute(cSP, 3));
            cg.setAttribute("endPoint", new THREE.Float32BufferAttribute(cEP, 3)); cg.setAttribute("connectionStrength", new THREE.Float32BufferAttribute(cStr, 1));
            cg.setAttribute("connectionColor", new THREE.Float32BufferAttribute(cColor, 3)); cg.setAttribute("pathIndex", new THREE.Float32BufferAttribute(cPIdx, 1));
            const cm = new THREE.ShaderMaterial({ uniforms: THREE.UniformsUtils.clone(pulseUniforms), vertexShader: connectionShader.vertexShader, fragmentShader: connectionShader.fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
            connectionsMesh = new THREE.LineSegments(cg, cm); scene.add(connectionsMesh);
            palette.forEach((color, i) => { if (i < 3) { cm.uniforms.uPulseColors.value[i].copy(color); nm.uniforms.uPulseColors.value[i].copy(color); } });
        }

        // ── Click to pulse ────────────────────────────────────────────────────
        const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
        const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), interactionPoint = new THREE.Vector3();
        let lastPulseIndex = 0;
        function triggerPulse(clientX, clientY) {
            pointer.x = (clientX / window.innerWidth) * 2 - 1; pointer.y = -(clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            interactionPlane.normal.copy(camera.position).normalize();
            interactionPlane.constant = -interactionPlane.normal.dot(camera.position) + camera.position.length() * 0.5;
            if (raycaster.ray.intersectPlane(interactionPlane, interactionPoint) && nodesMesh && connectionsMesh) {
                const t = clock.getElapsedTime(); lastPulseIndex = (lastPulseIndex + 1) % 3;
                nodesMesh.material.uniforms.uPulsePositions.value[lastPulseIndex].copy(interactionPoint);
                nodesMesh.material.uniforms.uPulseTimes.value[lastPulseIndex] = t;
                connectionsMesh.material.uniforms.uPulsePositions.value[lastPulseIndex].copy(interactionPoint);
                connectionsMesh.material.uniforms.uPulseTimes.value[lastPulseIndex] = t;
                const pal = colorPalettes[config.activePaletteIndex]; const rc = pal[Math.floor(Math.random() * pal.length)];
                nodesMesh.material.uniforms.uPulseColors.value[lastPulseIndex].copy(rc);
                connectionsMesh.material.uniforms.uPulseColors.value[lastPulseIndex].copy(rc);
            }
        }
        canvas.addEventListener("click", (e) => { if (!config.paused) triggerPulse(e.clientX, e.clientY); });

        // ── Animate ───────────────────────────────────────────────────────────
        let animId;
        function animate() {
            animId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            if (!config.paused) {
                if (nodesMesh) { nodesMesh.material.uniforms.uTime.value = t; nodesMesh.rotation.y = Math.sin(t * 0.04) * 0.05; }
                if (connectionsMesh) { connectionsMesh.material.uniforms.uTime.value = t; connectionsMesh.rotation.y = Math.sin(t * 0.04) * 0.05; }
            }
            starField.rotation.y += 0.0002; starField.material.uniforms.uTime.value = t;
            controls.update(); composer.render();
        }

        // ── Resize ────────────────────────────────────────────────────────────
        function onResize() {
            const sm = window.innerWidth <= 480, mb = window.innerWidth <= 768;
            camera.position.z = sm ? 50 : mb ? 42 : 38;
            camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
            bloomPass.resolution.set(window.innerWidth, window.innerHeight);
        }
        window.addEventListener("resize", onResize);

        createNetworkVisualization(config.currentFormation, config.densityFactor);
        animate();

        // ── Cleanup on unmount ────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", onResize);
            canvas.removeEventListener("click", triggerPulse);
            renderer.dispose();
            controls.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100%", height: "100%",
                zIndex: 0,
                display: "block",
            }}
        />
    );
};

export default NeuralBackground;
