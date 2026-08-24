"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const MODELLO = "/models/delsigel-emblema-vettoriale.glb";
const PESO_MODELLO = 1_757_812;
/* Un giro in quattro secondi: nei cinque secondi minimi della porta il
   modello completa sempre una rotazione visibile, anche considerando il
   breve tempo necessario a inizializzare WebGL. */
const VELOCITA_ROTAZIONE = (Math.PI * 2) / 4;

type Props = {
  onProgress: (progresso: number) => void;
  onReady: () => void;
  onError: () => void;
};

/**
 * Il solo emblema storico, reso come ceramica cacao. Three viene importato
 * qui, nel browser, così il renderer resta un chunk isolato e il layout
 * server non trascina WebGL nel proprio grafo.
 */
export function PreloaderLogo3D({ onProgress, onReady, onError }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [modelloPronto, setModelloPronto] = useState(false);

  useEffect(() => {
    const elemento = canvas.current;
    if (!elemento) return;

    let vivo = true;
    let frame = 0;
    let osservatore: ResizeObserver | null = null;
    let renderer: import("three").WebGLRenderer | null = null;
    let ambiente: import("three").Texture | null = null;
    let materiale: import("three").MeshPhysicalMaterial | null = null;
    let geometriaOmbra: import("three").PlaneGeometry | null = null;
    let materialeOmbra: import("three").ShadowMaterial | null = null;
    let timer: import("three").Timer | null = null;
    const geometrie: import("three").BufferGeometry[] = [];

    const avvia = async () => {
      try {
        onProgress(0.04);
        const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
        ]);
        if (!vivo) return;
        onProgress(0.12);

        renderer = new THREE.WebGLRenderer({
          canvas: elemento,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setClearAlpha(0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.94;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        const scena = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
        camera.position.set(0, 0.2, 5);

        const pmrem = new THREE.PMREMGenerator(renderer);
        const stanza = new RoomEnvironment();
        ambiente = pmrem.fromScene(stanza, 0.035).texture;
        scena.environment = ambiente;
        stanza.dispose();
        pmrem.dispose();

        const chiave = new THREE.DirectionalLight(0xffead4, 3.2);
        chiave.position.set(-2.8, 3.8, 4.2);
        chiave.castShadow = true;
        chiave.shadow.mapSize.set(1024, 1024);
        chiave.shadow.camera.near = 0.5;
        chiave.shadow.camera.far = 12;
        scena.add(chiave);

        const riempimento = new THREE.DirectionalLight(0xffb794, 1.45);
        riempimento.position.set(3.8, 0.5, 2.8);
        scena.add(riempimento);

        const bordo = new THREE.DirectionalLight(0xffffff, 1.8);
        bordo.position.set(0.2, 3, -3.5);
        scena.add(bordo);

        const gruppo = new THREE.Group();
        gruppo.position.y = 0.26;
        gruppo.rotation.set(-0.06, -0.28, 0);
        scena.add(gruppo);

        materiale = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#35180c"),
          roughness: 0.17,
          metalness: 0.025,
          clearcoat: 0.9,
          clearcoatRoughness: 0.14,
          envMapIntensity: 1.2,
        });

        geometriaOmbra = new THREE.PlaneGeometry(8, 5);
        materialeOmbra = new THREE.ShadowMaterial({
          color: 0x2b1d16,
          opacity: 0.18,
          transparent: true,
        });
        const piano = new THREE.Mesh(geometriaOmbra, materialeOmbra);
        piano.rotation.x = -Math.PI / 2;
        piano.position.set(0, -0.48, 0);
        piano.receiveShadow = true;
        scena.add(piano);

        const gltf = await new Promise<
          Awaited<ReturnType<InstanceType<typeof GLTFLoader>["loadAsync"]>>
        >((risolvi, rifiuta) => {
          const loader = new GLTFLoader();
          loader.load(
            MODELLO,
            risolvi,
            (evento) => {
              const totale = evento.total || PESO_MODELLO;
              const quota = Math.min(1, evento.loaded / totale);
              onProgress(0.12 + quota * 0.84);
            },
            rifiuta,
          );
        });
        if (!vivo) return;

        gltf.scene.traverse((oggetto) => {
          if (!(oggetto instanceof THREE.Mesh)) return;
          geometrie.push(oggetto.geometry);
          oggetto.material = materiale!;
          oggetto.castShadow = true;
          oggetto.receiveShadow = true;
        });

        /* Meshy esporta gia l'orientamento corretto. Si centra la scena sul
           suo bounding box e la si scala in base alla larghezza, senza
           affidarsi alle unita arbitrarie del generatore. */
        const involucro = new THREE.Group();
        const scatola = new THREE.Box3().setFromObject(gltf.scene);
        const centro = scatola.getCenter(new THREE.Vector3());
        const misura = scatola.getSize(new THREE.Vector3());
        gltf.scene.position.sub(centro);
        involucro.scale.setScalar(3.9 / Math.max(0.001, misura.x));
        involucro.add(gltf.scene);
        gruppo.add(involucro);

        const ridotto = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        timer = new THREE.Timer();
        timer.connect(document);

        const ridimensiona = () => {
          if (!renderer) return;
          const rettangolo = elemento.getBoundingClientRect();
          const larghezza = Math.max(1, Math.round(rettangolo.width));
          const altezza = Math.max(1, Math.round(rettangolo.height));
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
          renderer.setSize(larghezza, altezza, false);
          camera.aspect = larghezza / altezza;
          camera.updateProjectionMatrix();
        };

        const disegna = (tempo: number) => {
          if (!renderer || !vivo) return;
          timer?.update(tempo);
          const delta = Math.min(0.05, timer?.getDelta() ?? 0);
          if (!ridotto && !document.hidden) {
            gruppo.rotation.y += delta * VELOCITA_ROTAZIONE;
          }
          renderer.render(scena, camera);
          frame = requestAnimationFrame(disegna);
        };

        osservatore = new ResizeObserver(ridimensiona);
        osservatore.observe(elemento);
        ridimensiona();
        renderer.render(scena, camera);
        setModelloPronto(true);
        onProgress(1);
        onReady();
        frame = requestAnimationFrame(disegna);
      } catch {
        if (!vivo) return;
        onProgress(1);
        onError();
      }
    };

    void avvia();

    return () => {
      vivo = false;
      cancelAnimationFrame(frame);
      osservatore?.disconnect();
      for (const geometria of new Set(geometrie)) geometria.dispose();
      geometriaOmbra?.dispose();
      materiale?.dispose();
      materialeOmbra?.dispose();
      ambiente?.dispose();
      timer?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, [onError, onProgress, onReady]);

  return (
    <div className="preloader-modello" data-pronto={modelloPronto || undefined}>
      <Image
        src="/brand/logo-storico-emblema.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        fill
        sizes="(max-aspect-ratio: 5/4) 92vw, 45vw"
        loading="eager"
        fetchPriority="high"
        unoptimized
        className="preloader-modello-ripiego"
      />
      <canvas ref={canvas} className="preloader-modello-canvas" aria-hidden="true" />
    </div>
  );
}
