import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Modelos procedurais (só código, sem arquivos de arte) dos três aparelhos
 * do hero. Cada fábrica devolve:
 *   • group      — a malha pronta para a cena
 *   • anchors    — onde fica cada ponto clicável e para que lado ele aponta
 *   • highlights — o realce que acende quando o ponto está ativo
 *
 * Unidades livres: cada aparelho tem ~4 de altura/largura, centrado na origem.
 * São representações estilizadas, sem logotipos de fabricantes.
 */

export type Anchor = {
  pos: THREE.Vector3;
  normal: THREE.Vector3;
  /** também vale para o lado espelhado em X (ex.: as duas tampas do console) */
  mirrorX?: boolean;
};

export type DeviceModel = {
  group: THREE.Group;
  anchors: Record<string, Anchor>;
  highlights: Record<string, THREE.Object3D>;
  floorY: number;
  glow: number;
  /** material da tela, reaproveitado quando o modelo detalhado entra */
  screenMaterial?: THREE.Material;
  /** animação própria do modelo (ex.: ventoinhas girando) */
  tick?: (dt: number) => void;
};

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/* ------------------------------------------------------------------ */
/* Utilitários                                                         */
/* ------------------------------------------------------------------ */

function canvasTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function roundedShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Placa de cantos arredondados com borda chanfrada; espessura no eixo Z. */
function slab(w: number, h: number, d: number, r: number, bevel = 0.03) {
  const g = new THREE.ExtrudeGeometry(
    roundedShape(w - bevel * 2, h - bevel * 2, Math.max(0.01, r - bevel)),
    {
      depth: d - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 4,
      curveSegments: 18,
    },
  );
  g.center();
  return g;
}

/** Face plana de cantos arredondados com UV 0–1 (para telas e tampas). */
function roundedFace(w: number, h: number, r: number) {
  const g = new THREE.ShapeGeometry(roundedShape(w, h, r), 18);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  }
  return g;
}

/**
 * Chapa densa de cantos arredondados que pode ser curvada (tampas do
 * console). `bend(u, v)` recebe coordenadas de -1 a 1 e devolve o
 * deslocamento em Z.
 */
function bentPlate(
  w: number,
  h: number,
  t: number,
  rTop: number,
  rBottom: number,
  bend: (u: number, v: number) => number,
) {
  const g = new THREE.BoxGeometry(w, h, t, 40, 60, 1);
  const pos = g.attributes.position;
  const hw = w / 2;
  const hh = h / 2;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    const r = y > 0 ? rTop : rBottom;
    const cx = THREE.MathUtils.clamp(x, -(hw - r), hw - r);
    const cy = THREE.MathUtils.clamp(y, -(hh - r), hh - r);
    const dx = x - cx;
    const dy = y - cy;
    const len = Math.hypot(dx, dy);
    if (len > r) {
      x = cx + (dx / len) * r;
      y = cy + (dy / len) * r;
    }
    pos.setXYZ(i, x, y, pos.getZ(i) + bend(x / hw, y / hh));
  }
  g.computeVertexNormals();
  return g;
}

/** Realce luminoso (aditivo) que só aparece quando o ponto está ativo. */
function glowDecal(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const ratio = w / h;
  const tw = ratio >= 1 ? 512 : Math.round(512 * ratio);
  const th = ratio >= 1 ? Math.round(512 / ratio) : 512;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({
      map: canvasTexture(tw, th, draw),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
  );
  m.userData.noPick = true;
  m.visible = false;
  m.renderOrder = 5;
  return m;
}

const frameDraw =
  (color: string, radius = 0.12) =>
  (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const pad = Math.min(w, h) * 0.08;
    ctx.shadowColor = color;
    ctx.shadowBlur = pad * 1.4;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(4, pad * 0.45);
    ctx.fillStyle = color.replace(")", ", 0.12)").replace("rgb(", "rgba(");
    ctx.beginPath();
    ctx.roundRect(pad, pad, w - pad * 2, h - pad * 2, Math.min(w, h) * radius);
    ctx.fill();
    ctx.stroke();
    ctx.stroke();
  };

const BLUE = "rgb(96, 190, 255)";
const AMBER = "rgb(255, 205, 90)";
const GREEN = "rgb(74, 222, 128)";
const VIOLET = "rgb(170, 130, 255)";

function finish(group: THREE.Group) {
  group.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && !o.userData.noPick) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
}

/* ------------------------------------------------------------------ */
/* Console (PlayStation 5)                                             */
/* ------------------------------------------------------------------ */

function createConsole(): DeviceModel {
  const group = new THREE.Group();
  const highlights: Record<string, THREE.Object3D> = {};

  const white = new THREE.MeshPhysicalMaterial({
    color: 0xe4e6ea,
    roughness: 0.46,
    clearcoat: 0.5,
    clearcoatRoughness: 0.35,
  });
  const gloss = new THREE.MeshPhysicalMaterial({
    color: 0x06070a,
    roughness: 0.16,
    metalness: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });
  const matte = new THREE.MeshStandardMaterial({ color: 0x0c0d11, roughness: 0.75 });
  const hole = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xb9bec8, metalness: 1, roughness: 0.3 });
  const led = new THREE.MeshBasicMaterial({ color: 0x7cc8ff, toneMapped: false });

  // corpo central
  const core = new THREE.Mesh(new RoundedBoxGeometry(0.6, 3.5, 2.3, 5, 0.07), gloss);
  group.add(core);

  // tampas brancas, curvadas: abrem no topo e abraçam o corpo nas bordas
  const plateGeo = bentPlate(2.56, 3.92, 0.07, 0.6, 0.24, (u, vv) => {
    const top = Math.max(0, vv);
    const bottom = Math.min(0, vv);
    return 0.15 * top * top + 0.05 * bottom * bottom - 0.05 * u * u;
  });
  for (const side of [1, -1]) {
    const plate = new THREE.Mesh(plateGeo, white);
    plate.rotation.y = (side * Math.PI) / 2;
    plate.position.set(side * 0.37, 0.1, 0);
    group.add(plate);
  }

  // filetes de luz entre a tampa e o corpo
  for (const side of [1, -1]) {
    for (const z of [1.13, -1.13]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.025, 2.1, 0.025), led);
      strip.position.set(side * 0.315, 0.62, z);
      strip.userData.noPick = true;
      group.add(strip);
    }
  }

  // respiros no topo
  const ventTex = canvasTexture(64, 256, (ctx, w, h) => {
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#23262e";
    for (let y = 4; y < h; y += 10) ctx.fillRect(6, y, w - 12, 4);
  });
  const topVent = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 2.1),
    new THREE.MeshStandardMaterial({ map: ventTex, roughness: 0.8 }),
  );
  topVent.rotation.x = -Math.PI / 2;
  topVent.position.y = 1.752;
  group.add(topVent);

  // frente: leitor, USBs e botão de ligar
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    group.add(m);
    return m;
  };
  add(new THREE.BoxGeometry(0.035, 1.25, 0.02), hole, -0.12, -0.15, 1.152);
  add(new THREE.BoxGeometry(0.2, 0.085, 0.02), metal, 0.02, 0.78, 1.15);
  add(new THREE.BoxGeometry(0.16, 0.05, 0.03), hole, 0.02, 0.78, 1.152);
  add(new THREE.BoxGeometry(0.13, 0.06, 0.03), hole, 0.02, 0.58, 1.152);
  const power = add(new THREE.CylinderGeometry(0.065, 0.065, 0.03, 24), metal, 0.02, -1.2, 1.152);
  power.rotation.x = Math.PI / 2;

  // traseira: grade de ventilação e portas
  const backTex = canvasTexture(128, 512, (ctx, w, h) => {
    ctx.fillStyle = "#07080b";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#2a2d36";
    for (let y = 8; y < h; y += 12)
      for (let x = 8 + ((y / 12) % 2) * 6; x < w - 4; x += 12) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
  });
  const backVent = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 2.0),
    new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.85 }),
  );
  backVent.rotation.y = Math.PI;
  backVent.position.set(0, 0.55, -1.152);
  group.add(backVent);
  add(new THREE.BoxGeometry(0.32, 0.15, 0.02), metal, 0, -0.78, -1.15);
  add(new THREE.BoxGeometry(0.26, 0.09, 0.03), hole, 0, -0.78, -1.152);
  add(new THREE.BoxGeometry(0.17, 0.15, 0.03), hole, -0.13, -1.05, -1.152);
  add(new THREE.BoxGeometry(0.17, 0.08, 0.03), hole, 0.13, -1.05, -1.152);
  add(new THREE.BoxGeometry(0.28, 0.15, 0.03), hole, 0, -1.33, -1.152);

  // base
  const stand = add(new THREE.CylinderGeometry(0.95, 1.0, 0.07, 64), matte, 0, -1.79, 0);
  stand.userData.noPick = true;
  const ring = add(new THREE.TorusGeometry(0.96, 0.012, 8, 64), metal, 0, -1.755, 0);
  ring.rotation.x = Math.PI / 2;
  ring.userData.noPick = true;

  // realces
  const chip = glowDecal(1.15, 1.15, (ctx, w, h) => {
    frameDraw(BLUE, 0.1)(ctx, w, h);
    const g = ctx.createLinearGradient(w * 0.3, h * 0.3, w * 0.7, h * 0.7);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.5, "#8fa3bd");
    g.addColorStop(1, "#e8eef7");
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#ffffff";
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(w * 0.3, h * 0.3, w * 0.4, h * 0.4, 14);
    ctx.fill();
  });
  chip.rotation.y = Math.PI / 2;
  chip.position.set(0.43, -0.2, 0);
  group.add(chip);
  highlights.metal = chip;

  const fan = glowDecal(1.25, 1.25, (ctx, w, h) => {
    ctx.translate(w / 2, h / 2);
    ctx.strokeStyle = VIOLET;
    ctx.shadowColor = VIOLET;
    ctx.shadowBlur = 26;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 7;
    for (let i = 0; i < 9; i++) {
      ctx.rotate((Math.PI * 2) / 9);
      ctx.beginPath();
      ctx.moveTo(w * 0.08, 0);
      ctx.quadraticCurveTo(w * 0.25, -h * 0.14, w * 0.39, -h * 0.04);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.08, 0, Math.PI * 2);
    ctx.stroke();
  });
  fan.rotation.y = Math.PI / 2;
  fan.position.set(0.5, 1.15, 0.15);
  group.add(fan);
  highlights.limpeza = fan;

  const hdmi = glowDecal(0.62, 0.42, frameDraw(AMBER, 0.2));
  hdmi.rotation.y = Math.PI;
  hdmi.position.set(0, -0.78, -1.19);
  group.add(hdmi);
  highlights.hdmi = hdmi;

  const boot = glowDecal(0.5, 0.5, frameDraw(BLUE, 0.5));
  boot.position.set(0.02, -1.2, 1.19);
  group.add(boot);
  highlights.boot = boot;

  finish(group);
  return {
    group,
    highlights,
    floorY: -1.83,
    glow: 0x168bff,
    anchors: {
      metal: { pos: v(0.47, -0.2, 0), normal: v(1, 0, 0), mirrorX: true },
      limpeza: { pos: v(0.54, 1.15, 0.15), normal: v(1, 0, 0), mirrorX: true },
      hdmi: { pos: v(0, -0.78, -1.2), normal: v(0, 0, -1) },
      boot: { pos: v(0.02, -1.2, 1.2), normal: v(0, 0, 1) },
    },
  };
}

/**
 * Troca o console procedural pelo modelo detalhado em /models/ps5.obj
 * (enviado pelo cliente). O procedural continua como reserva enquanto o
 * arquivo carrega ou se ele falhar. Os pontos clicáveis são reencaixados
 * na superfície do modelo novo por raio.
 */
export async function upgradeConsole(model: DeviceModel) {
  const obj = await new OBJLoader().loadAsync("/models/ps5.obj");

  const materials: Record<string, THREE.Material> = {
    "Plastic_-_Textured_-_Regular": new THREE.MeshPhysicalMaterial({
      color: 0xe6e8ec,
      roughness: 0.48,
      clearcoat: 0.45,
      clearcoatRoughness: 0.4,
    }),
    "Plastic_-_Translucent_Glossy_(Gray)": new THREE.MeshPhysicalMaterial({
      color: 0x050609,
      roughness: 0.14,
      metalness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
    }),
    "Plastic_-_Translucent_Matte_(Gray)": new THREE.MeshStandardMaterial({
      color: 0x0b0c10,
      roughness: 0.7,
    }),
    "Plastic_-_Translucent_Matte_(Gray)_1": new THREE.MeshStandardMaterial({
      color: 0x0d0e13,
      roughness: 0.6,
    }),
    "Plastic_-_Translucent_Glossy_(Blue)": new THREE.MeshBasicMaterial({
      color: 0x8fd0ff,
      toneMapped: false,
    }),
    "Steel_-_Satin": new THREE.MeshStandardMaterial({
      color: 0xb9bec8,
      metalness: 1,
      roughness: 0.3,
    }),
    "Glass_-_Heavy_Color": new THREE.MeshPhysicalMaterial({
      color: 0x111319,
      roughness: 0.05,
      metalness: 0.5,
      clearcoat: 1,
    }),
  };
  const fallback = materials["Plastic_-_Translucent_Matte_(Gray)"];
  obj.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const old = mesh.material;
    mesh.material = Array.isArray(old)
      ? old.map((m) => materials[m.name] ?? fallback)
      : materials[old.name] ?? fallback;
  });

  // o arquivo tem ~1,95 de altura com a base em y = 0
  obj.scale.setScalar(2);
  obj.position.y = -1.9;
  obj.updateMatrixWorld(true);

  // âncoras nas peças do modelo novo
  const wanted: Record<string, Anchor> = {
    metal: { pos: v(0, -0.25, 0), normal: v(1, 0, 0), mirrorX: true },
    limpeza: { pos: v(0, 1.1, 0.1), normal: v(1, 0, 0), mirrorX: true },
    hdmi: { pos: v(0, -0.95, 0), normal: v(0, 0, -1) },
    boot: { pos: v(0, -1.38, 0), normal: v(0, 0, 1) },
  };
  swapIn(model, obj, wanted);
  model.floorY = -2.05;
}

/**
 * Coloca `obj` no lugar da malha procedural de `model`, encaixando cada
 * âncora (e o realce dela) na superfície real do modelo novo: um raio parte
 * de fora, na direção contrária à normal, e para onde bater.
 * `centered` lista realces que cobrem a face inteira e por isso só andam
 * no eixo da normal.
 */
function swapIn(
  model: DeviceModel,
  obj: THREE.Object3D,
  wanted: Record<string, Anchor>,
  centered: string[] = [],
) {
  obj.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  for (const [id, a] of Object.entries(wanted)) {
    ray.set(a.pos.clone().addScaledVector(a.normal, 5), a.normal.clone().negate());
    const hit = ray.intersectObject(obj, true)[0];
    if (hit) a.pos.copy(hit.point);
    const glow = model.highlights[id];
    if (!glow) continue;
    if (centered.includes(id)) {
      const along = a.pos.dot(a.normal) + 0.035;
      glow.position.set(a.normal.x * along, a.normal.y * along, a.normal.z * along);
    } else {
      glow.position.copy(a.pos).addScaledVector(a.normal, 0.035);
    }
  }

  const keep = new Set(Object.values(model.highlights));
  for (const child of [...model.group.children]) {
    if (keep.has(child)) continue;
    model.group.remove(child);
    child.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.geometry.dispose();
    });
  }
  model.group.add(obj);
  model.anchors = wanted;
  finish(model.group);
}

/**
 * Troca o celular procedural pelo modelo em /models/iphone.glb:
 * "iPhone 18 Pro Max - High Quality 3D Model", de Pro Animator
 * (sketchfab.com/Riju.mandal), licença CC BY 4.0. Crédito no rodapé.
 */
export async function upgradePhone(model: DeviceModel) {
  const gltf = await new GLTFLoader().loadAsync("/models/iphone.glb");
  const scene = gltf.scene;
  scene.getObjectByName("Plane_1")?.removeFromParent(); // chão do arquivo original
  const tilted = scene.getObjectByName("Object_7_0");
  if (tilted) tilted.quaternion.identity(); // o arquivo vem levemente inclinado
  scene.updateMatrixWorld(true);

  // centraliza, põe na altura padrão (3,98) e vira a tela para a frente
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  scene.position.copy(box.getCenter(new THREE.Vector3())).multiplyScalar(-1);
  const holder = new THREE.Group();
  holder.add(scene);
  holder.scale.setScalar(3.98 / size.y);

  const found: THREE.Mesh[] = [];
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && (mesh.material as THREE.Material).name === "Material.001") found.push(mesh);
  });
  const glass = found[0];

  // a carcaça original é um vinho quase preto, que some no fundo escuro do
  // site: clareia só as peças coloridas, mantendo o tom
  scene.traverse((o) => {
    const mat = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
    if (mat && /^17ProMax_color/.test(mat.name) && !mat.userData.lifted) {
      mat.color.multiplyScalar(2.6);
      mat.userData.lifted = true;
    }
  });
  const glassBox = new THREE.Box3();
  const measure = () => {
    holder.updateMatrixWorld(true);
    if (glass) glassBox.setFromObject(glass);
  };
  measure();
  if (glass && glassBox.getCenter(new THREE.Vector3()).z < 0) {
    holder.rotation.y = Math.PI;
    measure();
  }

  // o modelo vem com a tela apagada: acende com o nosso papel de parede
  if (glass && model.screenMaterial) {
    const g = glassBox.getSize(new THREE.Vector3());
    const c = glassBox.getCenter(new THREE.Vector3());
    const lit = new THREE.Mesh(
      roundedFace(g.x * 0.975, g.y * 0.987, g.x * 0.13),
      model.screenMaterial,
    );
    lit.position.set(c.x, c.y, glassBox.max.z + 0.004);
    const wrap = new THREE.Group();
    wrap.add(holder, lit);
    return finishPhone(model, wrap);
  }
  finishPhone(model, holder);
}

function finishPhone(model: DeviceModel, obj: THREE.Object3D) {
  swapIn(
    model,
    obj,
    {
      tela: { pos: v(0, 0.1, 0), normal: v(0, 0, 1) },
      bateria: { pos: v(0, -0.7, 0), normal: v(0, 0, -1) },
      conector: { pos: v(0, 0, 0), normal: v(0, -1, 0) },
      camera: { pos: v(0.32, 1.42, 0), normal: v(0, 0, -1) },
      placa: { pos: v(-0.5, 0.2, 0), normal: v(0, 0, -1) },
    },
    ["tela"],
  );
}

/* ------------------------------------------------------------------ */
/* Smartphone (iPhone)                                                 */
/* ------------------------------------------------------------------ */

function createPhone(): DeviceModel {
  const group = new THREE.Group();
  const highlights: Record<string, THREE.Object3D> = {};
  const W = 1.92;
  const H = 3.98;
  const D = 0.2;

  const titanium = new THREE.MeshPhysicalMaterial({
    color: 0x9a9da4,
    metalness: 1,
    roughness: 0.32,
    clearcoat: 0.3,
  });
  const backGlass = new THREE.MeshPhysicalMaterial({
    color: 0x3a3e48,
    roughness: 0.5,
    metalness: 0.35,
    clearcoat: 0.6,
    clearcoatRoughness: 0.5,
  });
  const hole = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9 });

  group.add(new THREE.Mesh(slab(W, H, D, 0.4, 0.045), titanium));

  // tela
  const screenTex = canvasTexture(512, 1060, (ctx, w, h) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    const m = 14;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(m, m, w - m * 2, h - m * 2, 78);
    ctx.clip();
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, w, h);
    const blob = (x: number, y: number, r: number, c: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, c);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };
    blob(w * 0.2, h * 0.14, w * 0.75, "#fb923c");
    blob(w * 0.9, h * 0.38, w * 0.8, "#ec4899");
    blob(w * 0.35, h * 0.86, w * 0.9, "#3b82f6");
    ctx.restore();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.roundRect(w / 2 - 78, 40, 156, 44, 22);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.textAlign = "center";
    ctx.font = "600 150px system-ui, sans-serif";
    ctx.fillText("9:41", w / 2, 300);
    ctx.font = "500 26px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("N O N I T R O   L A B", w / 2, 350);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.roundRect(w / 2 - 90, h - 46, 180, 9, 5);
    ctx.fill();
  });
  const screen = new THREE.Mesh(
    roundedFace(W - 0.1, H - 0.1, 0.36),
    new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      emissiveMap: screenTex,
      emissiveIntensity: 0.95,
      roughness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    }),
  );
  screen.position.z = D / 2 + 0.002;
  group.add(screen);

  // traseira
  const back = new THREE.Mesh(roundedFace(W - 0.1, H - 0.1, 0.36), backGlass);
  back.rotation.y = Math.PI;
  back.position.z = -D / 2 - 0.002;
  group.add(back);

  // conjunto de câmeras (canto superior esquerdo de quem olha por trás)
  const cam = new THREE.Group();
  cam.position.set(0.42, 1.42, -D / 2 - 0.035);
  const island = new THREE.Mesh(
    slab(0.98, 0.98, 0.07, 0.28, 0.02),
    new THREE.MeshPhysicalMaterial({ color: 0x4a4e59, roughness: 0.35, metalness: 0.5, clearcoat: 0.8 }),
  );
  cam.add(island);
  const lensGlass = new THREE.MeshPhysicalMaterial({
    color: 0x05070d,
    roughness: 0.04,
    metalness: 0.6,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
  });
  for (const [lx, ly] of [
    [0.21, 0.21],
    [0.21, -0.21],
    [-0.21, 0],
  ]) {
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.07, 40), titanium);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(lx, ly, -0.05);
    cam.add(rim);
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.15, 40), lensGlass);
    glass.rotation.y = Math.PI;
    glass.position.set(lx, ly, -0.087);
    cam.add(glass);
    const iris = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 24),
      new THREE.MeshBasicMaterial({ color: 0x1b2a55 }),
    );
    iris.rotation.y = Math.PI;
    iris.position.set(lx, ly, -0.088);
    cam.add(iris);
  }
  const flash = new THREE.Mesh(
    new THREE.CircleGeometry(0.06, 24),
    new THREE.MeshBasicMaterial({ color: 0xfff1cc, toneMapped: false }),
  );
  flash.rotation.y = Math.PI;
  flash.position.set(-0.26, 0.3, -0.037);
  cam.add(flash);
  group.add(cam);

  // botões laterais
  for (const [x, y, len] of [
    [W / 2, 0.55, 0.6],
    [-W / 2, 0.95, 0.34],
    [-W / 2, 0.5, 0.34],
  ]) {
    const b = new THREE.Mesh(new RoundedBoxGeometry(0.035, len, 0.085, 3, 0.015), titanium);
    b.position.set(x, y, 0);
    group.add(b);
  }

  // porta de carga e saídas de som
  const port = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.03, 0.09, 3, 0.012), hole);
  port.position.set(0, -H / 2, 0);
  group.add(port);
  for (const sx of [-0.62, -0.5, -0.38, 0.38, 0.5, 0.62]) {
    const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 12), hole);
    dot.position.set(sx, -H / 2, 0);
    group.add(dot);
  }

  // realces
  const tela = glowDecal(W - 0.06, H - 0.06, frameDraw(BLUE, 0.2));
  tela.position.z = D / 2 + 0.012;
  group.add(tela);
  highlights.tela = tela;

  const battery = glowDecal(1.45, 2.0, (ctx, w, h) => {
    frameDraw(GREEN, 0.1)(ctx, w, h);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(74, 222, 128, 0.85)";
    ctx.beginPath();
    ctx.roundRect(w * 0.18, h * 0.8, w * 0.52, h * 0.05, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(74, 222, 128, 0.25)";
    ctx.beginPath();
    ctx.roundRect(w * 0.18, h * 0.8, w * 0.64, h * 0.05, 8);
    ctx.fill();
  });
  battery.rotation.y = Math.PI;
  battery.position.set(0, -0.62, -D / 2 - 0.014);
  group.add(battery);
  highlights.bateria = battery;

  const board = glowDecal(0.72, 1.35, (ctx, w, h) => {
    frameDraw(VIOLET, 0.12)(ctx, w, h);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(170, 130, 255, 0.7)";
    for (let y = h * 0.16; y < h * 0.86; y += h * 0.09)
      ctx.fillRect(w * 0.22, y, w * 0.56, 4);
  });
  board.rotation.y = Math.PI;
  board.position.set(-0.5, 1.2, -D / 2 - 0.014);
  group.add(board);
  highlights.placa = board;

  const camGlow = glowDecal(1.2, 1.2, frameDraw(BLUE, 0.3));
  camGlow.rotation.y = Math.PI;
  camGlow.position.set(0.42, 1.42, -D / 2 - 0.13);
  group.add(camGlow);
  highlights.camera = camGlow;

  const portGlow = glowDecal(0.8, 0.34, frameDraw(BLUE, 0.4));
  portGlow.rotation.x = Math.PI / 2;
  portGlow.position.set(0, -H / 2 - 0.03, 0);
  group.add(portGlow);
  highlights.conector = portGlow;

  finish(group);
  return {
    group,
    highlights,
    screenMaterial: screen.material,
    floorY: -2.25,
    glow: 0x7957ff,
    anchors: {
      tela: { pos: v(0, 0.1, D / 2 + 0.05), normal: v(0, 0, 1) },
      bateria: { pos: v(0, -0.62, -D / 2 - 0.05), normal: v(0, 0, -1) },
      conector: { pos: v(0, -H / 2 - 0.06, 0), normal: v(0, -1, 0) },
      camera: { pos: v(0.42, 1.42, -D / 2 - 0.16), normal: v(0, 0, -1) },
      placa: { pos: v(-0.5, 1.2, -D / 2 - 0.05), normal: v(0, 0, -1) },
    },
  };
}

/* ------------------------------------------------------------------ */
/* Notebook gamer                                                      */
/* ------------------------------------------------------------------ */

function createNotebook(): DeviceModel {
  const root = new THREE.Group();
  const group = new THREE.Group();
  group.scale.setScalar(0.86);
  root.add(group);
  const highlights: Record<string, THREE.Object3D> = {};

  const W = 4.6;
  const DEPTH = 3.1;
  const BASE_Y = -0.95;
  const DECK = BASE_Y + 0.085;

  const shell = new THREE.MeshPhysicalMaterial({
    color: 0x1a1d25,
    metalness: 0.85,
    roughness: 0.42,
    clearcoat: 0.25,
  });
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x0d0e12, roughness: 0.55 });

  // base
  const base = new THREE.Mesh(slab(W, DEPTH, 0.17, 0.16, 0.03), shell);
  base.rotation.x = -Math.PI / 2;
  base.position.y = BASE_Y;
  group.add(base);

  // retroiluminação RGB sob as teclas
  const KB_W = 4.12;
  const KB_D = 1.5;
  const KB_Z = -0.38;
  const rgbTex = canvasTexture(512, 64, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    ["#ff2d55", "#ff9f0a", "#a3e635", "#22d3ee", "#6366f1", "#e040fb"].forEach((c, i, a) =>
      g.addColorStop(i / (a.length - 1), c),
    );
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  const rgb = new THREE.Mesh(
    new THREE.PlaneGeometry(KB_W, KB_D),
    new THREE.MeshBasicMaterial({ map: rgbTex, toneMapped: false }),
  );
  rgb.rotation.x = -Math.PI / 2;
  rgb.position.set(0, DECK + 0.004, KB_Z);
  group.add(rgb);

  const COLS = 15;
  const ROWS = 5;
  const pitchX = KB_W / COLS;
  const pitchZ = KB_D / ROWS;
  const keys = new THREE.InstancedMesh(
    new RoundedBoxGeometry(pitchX - 0.045, 0.05, pitchZ - 0.045, 2, 0.012),
    keyMat,
    COLS * ROWS,
  );
  const m4 = new THREE.Matrix4();
  let k = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      m4.setPosition(
        -KB_W / 2 + pitchX * (c + 0.5),
        DECK + 0.028,
        KB_Z - KB_D / 2 + pitchZ * (r + 0.5),
      );
      keys.setMatrixAt(k++, m4);
    }
  group.add(keys);

  // touchpad
  const pad = new THREE.Mesh(
    roundedFace(1.5, 0.9, 0.06),
    new THREE.MeshPhysicalMaterial({ color: 0x23262f, roughness: 0.25, metalness: 0.6, clearcoat: 0.6 }),
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, DECK + 0.003, 0.98);
  group.add(pad);

  // saída de ar junto à dobradiça
  const ventTex = canvasTexture(512, 32, (ctx, w, h) => {
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#2b2f3a";
    for (let x = 4; x < w; x += 10) ctx.fillRect(x, 5, 4, h - 10);
  });
  const vent = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 0.16),
    new THREE.MeshStandardMaterial({ map: ventTex, roughness: 0.8 }),
  );
  vent.rotation.x = -Math.PI / 2;
  vent.position.set(0, DECK + 0.003, -1.36);
  group.add(vent);

  // tampa (dobradiça na borda de trás, inclinada para trás)
  const hinge = new THREE.Group();
  hinge.position.set(0, DECK - 0.02, -DEPTH / 2 + 0.02);
  hinge.rotation.x = -0.25;
  group.add(hinge);

  const LID_H = 3.0;
  const lid = new THREE.Mesh(slab(W, LID_H, 0.09, 0.16, 0.02), shell);
  lid.position.y = LID_H / 2;
  hinge.add(lid);

  const screenTex = canvasTexture(1024, 640, (ctx, w, h) => {
    ctx.fillStyle = "#0b0320";
    ctx.fillRect(0, 0, w, h);
    const blob = (x: number, y: number, r: number, c: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, c);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };
    blob(w * 0.2, h * 0.8, w * 0.5, "#e040fb");
    blob(w * 0.8, h * 0.22, w * 0.5, "#22d3ee");
    blob(w * 0.6, h * 0.95, w * 0.45, "#6366f1");
    // horizonte em grade, estilo jogo
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 2;
    for (let i = -12; i <= 12; i++) {
      ctx.beginPath();
      ctx.moveTo(w / 2 + i * 26, h * 0.62);
      ctx.lineTo(w / 2 + i * 150, h);
      ctx.stroke();
    }
    for (let j = 0; j < 7; j++) {
      const y = h * 0.62 + Math.pow(j / 6, 2) * h * 0.38;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "700 92px system-ui, sans-serif";
    ctx.shadowColor = "rgba(255,255,255,0.7)";
    ctx.shadowBlur = 30;
    ctx.fillText("NONITRO LAB", w / 2, h * 0.42);
    ctx.shadowBlur = 0;
    ctx.font = "600 26px system-ui, sans-serif";
    ctx.fillStyle = "#bef264";
    ctx.textAlign = "right";
    ctx.fillText("144 FPS", w - 30, 46);
  });
  const screen = new THREE.Mesh(
    roundedFace(W - 0.24, LID_H - 0.3, 0.05),
    new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      emissiveMap: screenTex,
      emissiveIntensity: 1,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
  );
  screen.position.set(0, LID_H / 2 + 0.04, 0.052);
  hinge.add(screen);
  const bezel = new THREE.Mesh(
    roundedFace(W - 0.06, LID_H - 0.06, 0.13),
    new THREE.MeshStandardMaterial({ color: 0x050608, roughness: 0.4 }),
  );
  bezel.position.set(0, LID_H / 2, 0.046);
  hinge.add(bezel);

  // costas da tampa com filete luminoso
  const lidBackTex = canvasTexture(1024, 640, (ctx, w, h) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#e040fb";
    ctx.shadowColor = "#e040fb";
    ctx.shadowBlur = 24;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.78);
    ctx.lineTo(w * 0.42, h * 0.5);
    ctx.lineTo(w, h * 0.5);
    ctx.stroke();
  });
  const lidBack = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.4, LID_H - 0.4),
    new THREE.MeshBasicMaterial({
      map: lidBackTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  lidBack.userData.noPick = true;
  lidBack.rotation.y = Math.PI;
  lidBack.position.set(0, LID_H / 2, -0.048);
  hinge.add(lidBack);

  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.7, 20), shell);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, DECK - 0.01, -DEPTH / 2 + 0.03);
  group.add(bar);

  // realces
  const tela = glowDecal(W - 0.2, LID_H - 0.26, frameDraw(BLUE, 0.05));
  tela.position.set(0, LID_H / 2 + 0.04, 0.06);
  hinge.add(tela);
  highlights.tela = tela;

  const sys = glowDecal(1.7, 0.4, (ctx, w, h) => {
    frameDraw(BLUE, 0.3)(ctx, w, h);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.font = `600 ${h * 0.3}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("INSTALANDO SISTEMA…", w / 2, h / 2);
  });
  sys.position.set(-1.2, 0.5, 0.065);
  hinge.add(sys);
  highlights.sistema = sys;

  const kb = glowDecal(KB_W + 0.16, KB_D + 0.16, frameDraw(BLUE, 0.06));
  kb.rotation.x = -Math.PI / 2;
  kb.position.set(0, DECK + 0.07, KB_Z);
  group.add(kb);
  highlights.teclado = kb;

  const heat = glowDecal(4.2, 0.42, frameDraw(AMBER, 0.4));
  heat.rotation.x = -Math.PI / 2;
  heat.position.set(0, DECK + 0.03, -1.36);
  group.add(heat);
  highlights.termica = heat;

  const up = glowDecal(1.25, 0.7, (ctx, w, h) => {
    frameDraw(GREEN, 0.12)(ctx, w, h);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(74, 222, 128, 0.8)";
    for (let x = w * 0.18; x < w * 0.84; x += w * 0.07)
      ctx.fillRect(x, h * 0.3, w * 0.03, h * 0.4);
  });
  up.rotation.x = -Math.PI / 2;
  up.position.set(1.6, DECK + 0.03, 0.98);
  group.add(up);
  highlights.upgrade = up;

  finish(root);

  // âncoras no espaço do `root` (o group interno tem escala 0.86)
  const s = 0.86;
  const lidPoint = (x: number, y: number, z: number) => {
    const p = v(x, y, z).applyEuler(hinge.rotation).add(hinge.position);
    return p.multiplyScalar(s);
  };
  const lidNormal = v(0, 0, 1).applyEuler(hinge.rotation);
  const up3 = v(0, 1, 0);
  return {
    group: root,
    highlights,
    floorY: (BASE_Y - 0.1) * s,
    glow: 0xc04bf7,
    anchors: {
      tela: { pos: lidPoint(0, LID_H / 2 + 0.2, 0.12), normal: lidNormal },
      sistema: { pos: lidPoint(-1.2, 0.5, 0.12), normal: lidNormal },
      teclado: { pos: v(0, DECK + 0.14, KB_Z).multiplyScalar(s), normal: up3 },
      termica: { pos: v(-1.4, DECK + 0.1, -1.36).multiplyScalar(s), normal: up3 },
      upgrade: { pos: v(1.6, DECK + 0.1, 0.98).multiplyScalar(s), normal: up3 },
    },
  };
}

/* ------------------------------------------------------------------ */
/* Controle                                                            */
/* ------------------------------------------------------------------ */

/** Versão simples, mostrada só enquanto o modelo detalhado carrega. */
function createController(): DeviceModel {
  const group = new THREE.Group();
  const highlights: Record<string, THREE.Object3D> = {};
  const white = new THREE.MeshPhysicalMaterial({ color: 0xe6e8ec, roughness: 0.5, clearcoat: 0.4 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0c0d11, roughness: 0.6 });

  const body = new THREE.Mesh(new RoundedBoxGeometry(3.4, 1.5, 0.7, 6, 0.3), white);
  body.position.y = 0.3;
  group.add(body);
  for (const side of [1, -1]) {
    const grip = new THREE.Mesh(new RoundedBoxGeometry(0.95, 1.9, 0.75, 6, 0.36), white);
    grip.position.set(side * 1.55, -0.45, -0.05);
    grip.rotation.z = side * 0.22;
    group.add(grip);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 32), dark);
    stick.rotation.x = Math.PI / 2;
    stick.position.set(side * 0.82, 0, 0.42);
    group.add(stick);
  }

  const ring = glowDecal(0.95, 0.95, frameDraw(BLUE, 0.5));
  group.add(ring);
  highlights.analogico = ring;
  const buttons = glowDecal(1.15, 1.15, frameDraw(VIOLET, 0.5));
  group.add(buttons);
  highlights.botoes = buttons;
  const board = glowDecal(1.6, 0.9, frameDraw(GREEN, 0.2));
  group.add(board);
  highlights.placa = board;
  const port = glowDecal(0.8, 0.4, frameDraw(AMBER, 0.4));
  port.rotation.x = -Math.PI / 2;
  group.add(port);
  highlights.conector = port;
  const battery = glowDecal(1.7, 1.0, frameDraw(GREEN, 0.15));
  battery.rotation.y = Math.PI;
  group.add(battery);
  highlights.bateria = battery;

  const model: DeviceModel = {
    group,
    highlights,
    floorY: -1.7,
    glow: 0x168bff,
    anchors: controllerAnchors(),
  };
  for (const [id, a] of Object.entries(model.anchors)) {
    const off = id === "conector" ? 1.1 : 0.45;
    a.pos.addScaledVector(a.normal, off);
    highlights[id].position.copy(a.pos);
  }
  finish(group);
  return model;
}

/** Posições aproximadas; o encaixe fino é feito por raio no modelo real. */
function controllerAnchors(): Record<string, Anchor> {
  return {
    analogico: { pos: v(-0.82, -0.03, 0), normal: v(0, 0, 1) },
    botoes: { pos: v(1.32, 0.7, 0), normal: v(0, 0, 1) },
    placa: { pos: v(0, 0.95, 0), normal: v(0, 0, 1) },
    conector: { pos: v(0, 0, -0.2), normal: v(0, 1, 0) },
    bateria: { pos: v(0, 0.15, 0), normal: v(0, 0, -1) },
  };
}

/**
 * Troca o controle simples pelo modelo em /models/controller.glb:
 * "Sony PS5 DualSense Controller", de Jayakrishnan Marath
 * (sketchfab.com/jayhystic22), licença CC BY 4.0. Crédito no rodapé.
 * O arquivo publicado é uma versão com texturas reduzidas do original.
 */
export async function upgradeController(model: DeviceModel) {
  const gltf = await new GLTFLoader().loadAsync("/models/controller.glb");
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  scene.position.copy(box.getCenter(new THREE.Vector3())).multiplyScalar(-1);
  const holder = new THREE.Group();
  holder.add(scene);
  holder.scale.setScalar(4.3 / size.x);
  // o arquivo vem deitado, com a frente para cima e os gatilhos para a câmera:
  // levanta (frente para a câmera) e gira para os gatilhos ficarem em cima
  holder.quaternion
    .setFromAxisAngle(v(0, 0, 1), Math.PI)
    .multiply(new THREE.Quaternion().setFromAxisAngle(v(1, 0, 0), Math.PI / 2));

  swapIn(model, holder, controllerAnchors());
  model.floorY = -1.75;
}

/* ------------------------------------------------------------------ */
/* PC gamer                                                            */
/* ------------------------------------------------------------------ */

/** Posições aproximadas; o encaixe fino é feito por raio no modelo real. */
function pcAnchors(): Record<string, Anchor> {
  return {
    montagem: { pos: v(0, 0.1, 0.2), normal: v(1, 0, 0) },
    limpeza: { pos: v(0, 1.05, -0.9), normal: v(1, 0, 0) },
    upgrade: { pos: v(0, -0.75, 0.1), normal: v(1, 0, 0) },
    // neste modelo a frente (três ventoinhas) aponta para -Z
    formatacao: { pos: v(0, 0.9, 0), normal: v(0, 0, -1) },
    diagnostico: { pos: v(0, -1.2, 0), normal: v(0, 0, 1) },
  };
}

/** Gabinete simples, mostrado só enquanto o modelo detalhado carrega. */
function createPC(): DeviceModel {
  const group = new THREE.Group();
  const highlights: Record<string, THREE.Object3D> = {};
  const tower = new THREE.Mesh(
    new RoundedBoxGeometry(1.7, 3.8, 3.6, 4, 0.08),
    new THREE.MeshPhysicalMaterial({ color: 0x0c0d12, roughness: 0.3, metalness: 0.6, clearcoat: 0.6 }),
  );
  group.add(tower);

  const side = (w: number, h: number, color: string) => {
    const d = glowDecal(w, h, frameDraw(color, 0.12));
    d.rotation.y = Math.PI / 2;
    group.add(d);
    return d;
  };
  highlights.montagem = side(2.6, 2.6, BLUE);
  highlights.limpeza = side(1.1, 1.1, VIOLET);
  highlights.upgrade = side(2.2, 0.7, GREEN);
  const front = glowDecal(1.1, 1.1, frameDraw(BLUE, 0.3));
  group.add(front);
  highlights.formatacao = front;
  const back = glowDecal(1.2, 0.9, frameDraw(AMBER, 0.15));
  back.rotation.y = Math.PI;
  group.add(back);
  highlights.diagnostico = back;

  const model: DeviceModel = { group, highlights, floorY: -1.95, glow: 0xff3b3b, anchors: pcAnchors() };
  swapAnchorsOnly(model, tower);
  finish(group);
  return model;
}

/** Encaixa âncoras e realces na malha já presente (sem trocar nada). */
function swapAnchorsOnly(model: DeviceModel, obj: THREE.Object3D) {
  obj.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  for (const [id, a] of Object.entries(model.anchors)) {
    ray.set(a.pos.clone().addScaledVector(a.normal, 5), a.normal.clone().negate());
    const hit = ray.intersectObject(obj, true)[0];
    if (hit) a.pos.copy(hit.point);
    model.highlights[id]?.position.copy(a.pos).addScaledVector(a.normal, 0.035);
  }
}

/**
 * Troca o gabinete simples pelo modelo em /models/pc.glb:
 * "Pc Gamer (Animation)", de Caio de Oliveira (sketchfab.com/caio17011),
 * licença CC BY 4.0. Crédito no rodapé. O arquivo publicado é uma versão
 * com texturas reduzidas do original. A animação gira as ventoinhas.
 */
export async function upgradePC(model: DeviceModel) {
  const gltf = await new GLTFLoader().loadAsync("/models/pc.glb");
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  scene.position.copy(box.getCenter(new THREE.Vector3())).multiplyScalar(-1);
  const holder = new THREE.Group();
  holder.add(scene);
  holder.scale.setScalar(3.9 / size.y);
  holder.rotation.y = PC_TURN;

  swapIn(model, holder, pcAnchors());
  model.floorY = -1.97;

  if (gltf.animations.length) {
    const mixer = new THREE.AnimationMixer(scene);
    for (const clip of gltf.animations) mixer.clipAction(clip).play();
    model.tick = (dt) => mixer.update(dt);
  }
}

/** giro que deixa o vidro lateral do gabinete no lado +X da cena */
const PC_TURN = 0;

export function createModels(): Record<string, DeviceModel> {
  return {
    ps5: createConsole(),
    controller: createController(),
    pc: createPC(),
    iphone: createPhone(),
    notebook: createNotebook(),
  };
}
