"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  createModels,
  upgradeConsole,
  upgradeController,
  upgradePC,
  upgradePhone,
  type DeviceModel,
} from "./models";

export type StageHotspot = {
  id: string;
  title: string;
  /** ângulo (graus) que deixa a peça de frente: [inclinação, giro] */
  view: [number, number];
};

type Props = {
  deviceId: string;
  /** ângulo inicial do aparelho, em graus */
  view: [number, number];
  hotspots: StageHotspot[];
  activeId: string | null;
  /** muda sempre que o painel pede para girar até um ponto: "id:contador" */
  focusKey: string;
  /** +1 / -1: lado para onde o aparelho sai ao trocar */
  direction: number;
  onSelect: (id: string, rotate: boolean) => void;
  onInteract: () => void;
};

const rad = THREE.MathUtils.degToRad;
const clamp = THREE.MathUtils.clamp;

/**
 * Palco WebGL do hero. Cuida da cena, da rotação por arraste, do realce
 * ao passar o mouse e dos pontos clicáveis (botões HTML reposicionados a
 * cada quadro sobre o modelo).
 */
export default function Stage3D(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const latest = useRef(props);
  latest.current = props;

  // Ponte entre o React e o laço de renderização.
  const api = useRef<{
    setDevice: (id: string, view: [number, number], dir: number) => void;
    focus: (view: [number, number]) => void;
  } | null>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const canvas = canvasRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.5;

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

    // Luz principal + contraluzes nas cores da marca.
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(5, 7, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    key.shadow.bias = -0.0006;
    key.shadow.radius = 6;
    scene.add(key);
    const rimBlue = new THREE.PointLight(0x168bff, 90, 30);
    rimBlue.position.set(-6, 2, -4);
    scene.add(rimBlue);
    const rimPurple = new THREE.PointLight(0xc04bf7, 90, 30);
    rimPurple.position.set(6, 3, -5);
    scene.add(rimPurple);
    const fill = new THREE.PointLight(0x9fd0ff, 14, 30);
    fill.position.set(-3, -1, 8);
    scene.add(fill);

    // Tudo que gira junto fica no pivô.
    const pivot = new THREE.Group();
    scene.add(pivot);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(5, 48),
      new THREE.ShadowMaterial({ opacity: 0.45 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    pivot.add(floor);

    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    const gctx = glowCanvas.getContext("2d")!;
    const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,0.55)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.14)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 256, 256);
    const glowMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(glowCanvas),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 7.5), glowMat);
    glow.rotation.x = -Math.PI / 2;
    pivot.add(glow);

    const models = createModels();
    let shown: DeviceModel | null = null;
    let shownId = "";

    const show = (id: string) => {
      if (shown) pivot.remove(shown.group);
      shown = models[id];
      shownId = id;
      pivot.add(shown.group);
      floor.position.y = shown.floorY;
      glow.position.y = shown.floorY + 0.01;
      glowMat.color.set(shown.glow);
    };

    // Estado da animação.
    const first = latest.current;
    const s = {
      rx: rad(first.view[0]),
      ry: rad(first.view[1]),
      trx: rad(first.view[0]),
      try: rad(first.view[1]),
      t: 1,
      phase: "idle" as "idle" | "out" | "in",
      dir: 1,
      pending: null as null | { id: string; view: [number, number] },
      hoverId: null as string | null,
    };
    show(first.deviceId);

    // modelo detalhado do console: entra assim que o arquivo carrega
    let disposed = false;
    const refit = (m: DeviceModel) => () => {
      if (disposed || shown !== m) return;
      floor.position.y = m.floorY;
      glow.position.y = m.floorY + 0.01;
    };
    const loaders: Record<string, (m: DeviceModel) => Promise<void>> = {
      ps5: upgradeConsole,
      iphone: upgradePhone,
      pc: upgradePC,
      controller: upgradeController,
    };
    const started = new Set<string>();
    const ensure = (id: string): Promise<void> => {
      if (!loaders[id] || started.has(id)) return Promise.resolve();
      started.add(id);
      return loaders[id](models[id])
        .then(refit(models[id]))
        .catch(() => {});
    };
    // O aparelho em tela carrega primeiro. Os demais vêm em seguida, um por
    // vez, do mais leve ao mais pesado. Em conexão lenta ou com economia de
    // dados, cada um só é baixado quando a pessoa abre a aba dele.
    const net = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const frugal = !!net && (net.saveData === true || /(^|-)(2g|3g)$/.test(net.effectiveType ?? ""));
    ensure(first.deviceId).then(() => {
      if (frugal || disposed) return;
      ["ps5", "pc", "iphone", "controller"].reduce(
        (chain, id) => chain.then(() => (disposed ? undefined : ensure(id))),
        Promise.resolve() as Promise<void>,
      );
    });

    api.current = {
      setDevice: (id, view, dir) => {
        ensure(id);
        if (id === shownId && !s.pending) return;
        s.pending = { id, view };
        s.dir = dir;
        s.phase = "out";
      },
      focus: (view) => {
        s.trx = rad(view[0]);
        // escolhe a volta mais curta até o ângulo pedido
        const target = rad(view[1]);
        const turns = Math.round((s.try - target) / (Math.PI * 2));
        s.try = target + turns * Math.PI * 2;
      },
    };

    // Tamanho e enquadramento.
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const dist = 13.2 / Math.min(1, (w / h) * 0.92);
      camera.position.set(0, 0.25, dist);
      camera.lookAt(0, -0.1, 0);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // Acerto do raio: qual ponto corresponde à peça sob o cursor?
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const inv = new THREE.Matrix4();
    const pick = (clientX: number, clientY: number): string | null => {
      if (!shown || s.phase !== "idle") return null;
      const r = canvas.getBoundingClientRect();
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster
        .intersectObject(shown.group, true)
        .find((h) => !h.object.userData.noPick && h.face);
      if (!hit || !hit.face) return null;
      inv.copy(shown.group.matrixWorld).invert();
      const p = hit.point.clone().applyMatrix4(inv);
      const n = hit.face.normal
        .clone()
        .transformDirection(hit.object.matrixWorld)
        .transformDirection(inv);
      let best: string | null = null;
      let bestD = 2.6;
      for (const [id, a] of Object.entries(shown.anchors)) {
        const sides = a.mirrorX ? [1, -1] : [1];
        for (const sx of sides) {
          const facing = n.x * a.normal.x * sx + n.y * a.normal.y + n.z * a.normal.z;
          if (facing < 0.35) continue;
          const d = Math.hypot(p.x - a.pos.x * sx, p.y - a.pos.y, p.z - a.pos.z);
          if (d < bestD) {
            bestD = d;
            best = id;
          }
        }
      }
      return best;
    };

    // Arrastar para girar; um toque/clique sem arrastar seleciona a peça.
    let drag: null | { x: number; y: number; rx: number; ry: number; moved: number } = null;
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      drag = { x: e.clientX, y: e.clientY, rx: s.trx, ry: s.try, moved: 0 };
      host.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (drag) {
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
        if (drag.moved > 4) {
          s.try = drag.ry + dx * 0.009;
          s.trx = clamp(drag.rx + dy * 0.006, -0.8, 0.8);
          latest.current.onInteract();
        }
        return;
      }
      if (e.pointerType !== "mouse") return;
      if (!host.contains(e.target as Node) || (e.target as HTMLElement).closest("button")) return;
      const id = pick(e.clientX, e.clientY);
      host.style.cursor = id ? "pointer" : "grab";
      if (id && id !== s.hoverId) latest.current.onSelect(id, false);
      s.hoverId = id;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag) return;
      const wasClick = drag.moved <= 4;
      drag = null;
      host.style.cursor = "grab";
      if (wasClick) {
        const id = pick(e.clientX, e.clientY);
        if (id) latest.current.onSelect(id, true);
      }
    };
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // Só renderiza enquanto o palco está visível.
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    const world = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const toCam = new THREE.Vector3();
    const clock = new THREE.Clock();
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.25);
      if (!visible || document.hidden) return;
      const time = clock.elapsedTime;

      // troca de aparelho: sai para um lado, entra pelo outro
      if (s.phase === "out") {
        s.t -= dt / 0.24;
        if (s.t <= 0 && s.pending) {
          s.t = 0;
          show(s.pending.id);
          s.rx = s.trx = rad(s.pending.view[0]);
          s.ry = s.try = rad(s.pending.view[1]);
          s.pending = null;
          s.phase = "in";
        }
      } else if (s.phase === "in") {
        s.t += dt / 0.5;
        if (s.t >= 1) {
          s.t = 1;
          s.phase = "idle";
        }
      }
      const ease = s.t * s.t * (3 - 2 * s.t);
      const away = (s.phase === "out" ? -s.dir : s.phase === "in" ? s.dir : 0) * (1 - ease);

      const k = 1 - Math.exp(-dt * 7);
      s.rx += (s.trx - s.rx) * k;
      s.ry += (s.try - s.ry) * k;
      const sway = reduce ? 0 : Math.sin(time * 0.6) * 0.13;
      const bob = reduce ? 0 : Math.sin(time * 0.9) * 0.05;
      pivot.rotation.set(s.rx, s.ry + sway + away * 1.1, 0);
      pivot.position.set(away * 2.4, bob, 0);
      pivot.scale.setScalar(0.6 + 0.4 * ease);
      canvas.style.opacity = String(ease);

      shown?.tick?.(reduce ? 0 : dt);

      // realces
      const { activeId } = latest.current;
      if (shown) {
        for (const [id, obj] of Object.entries(shown.highlights)) {
          obj.visible = id === activeId;
          if (obj.visible) {
            const m = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial;
            m.opacity = 0.75 + Math.sin(time * 4) * 0.25;
          }
        }
      }

      renderer.render(scene, camera);

      // pontos HTML acompanham as peças
      const w = host.clientWidth;
      const h = host.clientHeight;
      let labelSet = false;
      if (shown) {
        for (const [id, a] of Object.entries(shown.anchors)) {
          const el = dotRefs.current[id];
          if (!el) continue;
          world.copy(a.pos).addScaledVector(a.normal, 0.12);
          shown.group.localToWorld(world);
          normal.copy(a.normal).transformDirection(shown.group.matrixWorld);
          toCam.copy(camera.position).sub(world).normalize();
          const facing = normal.dot(toCam) > 0.06;
          world.project(camera);
          const x = (world.x * 0.5 + 0.5) * w;
          const y = (-world.y * 0.5 + 0.5) * h;
          el.style.transform = `translate(${x}px, ${y}px)`;
          const on = facing && s.phase === "idle";
          el.style.opacity = on ? "1" : "0";
          el.style.pointerEvents = on ? "auto" : "none";
          if (id === activeId && labelRef.current && s.phase === "idle") {
            const lx = clamp(x, 110, Math.max(110, w - 110));
            labelRef.current.style.transform = `translate(${lx}px, ${Math.max(58, y)}px)`;
            labelRef.current.style.opacity = "1";
            labelSet = true;
          }
        }
      }
      if (!labelSet && labelRef.current) labelRef.current.style.opacity = "0";
    };
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      api.current = null;
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          for (const value of Object.values(m)) {
            if (value instanceof THREE.Texture) value.dispose();
          }
          m.dispose();
        }
      });
      for (const m of Object.values(models)) {
        m.group.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) mesh.geometry.dispose();
        });
      }
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    api.current?.setDevice(props.deviceId, props.view, props.direction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.deviceId]);

  useEffect(() => {
    const id = props.focusKey.split(":")[0];
    const h = latest.current.hotspots.find((x) => x.id === id);
    if (h) api.current?.focus(h.view);
  }, [props.focusKey]);

  const active = props.hotspots.find((h) => h.id === props.activeId) ?? null;

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 cursor-grab touch-pan-y select-none"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />

      {props.hotspots.map((h) => (
        <button
          key={`${props.deviceId}-${h.id}`}
          ref={(el) => {
            dotRefs.current[h.id] = el;
          }}
          type="button"
          aria-label={h.title}
          onClick={() => props.onSelect(h.id, true)}
          onPointerEnter={(e) => e.pointerType === "mouse" && props.onSelect(h.id, false)}
          style={{ opacity: 0 }}
          className="group absolute left-0 top-0 z-10 -ml-[18px] -mt-[18px] flex size-9 items-center justify-center rounded-full transition-opacity duration-200 will-change-transform"
        >
          <span className="absolute inset-1 animate-ping rounded-full bg-brand-blueSoft/50 [animation-duration:2.2s]" />
          <span
            className={`relative block rounded-full border-2 border-white shadow-[0_0_14px_3px_rgba(63,162,255,0.9)] transition-all duration-200 ${
              props.activeId === h.id
                ? "size-5 bg-white"
                : "size-3.5 bg-brand-blue group-hover:size-5"
            }`}
          />
        </button>
      ))}

      <div
        ref={labelRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute left-0 top-0 z-20 transition-opacity duration-200 will-change-transform"
      >
        <div className="-translate-x-1/2 -translate-y-[calc(100%+22px)] whitespace-nowrap rounded-full border border-white/25 bg-bg/85 px-3.5 py-1.5 text-xs font-medium text-white shadow-[0_8px_30px_-6px_rgba(22,139,255,0.7)] backdrop-blur sm:text-sm">
          {active?.title}
        </div>
      </div>
    </div>
  );
}
