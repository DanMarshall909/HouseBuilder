import * as THREE from "three";
import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls.js";

const viewer = document.getElementById("viewer");
const statusEl = document.getElementById("status");
const exampleSelect = document.getElementById("exampleSelect");
const loadButton = document.getElementById("loadButton");
const resetCameraButton = document.getElementById("resetCameraButton");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf9f3e3);

const camera = new THREE.PerspectiveCamera(55, viewer.clientWidth / viewer.clientHeight, 0.1, 3000);
camera.position.set(30, 30, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

const hemi = new THREE.HemisphereLight(0xffffff, 0x7d6b4a, 1.05);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(30, 40, 20);
scene.add(dir);

const grid = new THREE.GridHelper(200, 100, 0xa88d62, 0xcdb894);
scene.add(grid);

const previewRoot = new THREE.Group();
scene.add(previewRoot);

function setStatus(text) {
  statusEl.textContent = text;
}

function clearPreview() {
  while (previewRoot.children.length) {
    const child = previewRoot.children.pop();
    child.geometry?.dispose?.();
    child.material?.dispose?.();
  }
}

function roomColor(index) {
  const hue = (index * 57) % 360;
  return new THREE.Color(`hsl(${hue} 58% 57%)`);
}

function addRoom(room, index) {
  const color = roomColor(index);
  const boxGeometry = new THREE.BoxGeometry(room.width, room.height, room.depth);

  const fillMat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.22,
  });
  const fill = new THREE.Mesh(boxGeometry, fillMat);

  const lineGeo = new THREE.EdgesGeometry(boxGeometry);
  const lineMat = new THREE.LineBasicMaterial({ color: color.clone().multiplyScalar(0.7) });
  const wire = new THREE.LineSegments(lineGeo, lineMat);

  const cx = room.position.x + room.width / 2;
  const cy = room.position.y + room.height / 2;
  const cz = room.position.z + room.depth / 2;

  fill.position.set(cx, cy, cz);
  wire.position.copy(fill.position);

  previewRoot.add(fill);
  previewRoot.add(wire);
}

function framePreview() {
  const box = new THREE.Box3().setFromObject(previewRoot);
  if (box.isEmpty()) {
    controls.target.set(0, 0, 0);
    camera.position.set(30, 30, 30);
    return;
  }

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  controls.target.copy(center);
  camera.position.set(center.x + size * 0.8, center.y + size * 0.7, center.z + size * 0.8);
}

async function loadPreview(path) {
  try {
    setStatus(`Loading ${path}...`);
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load JSON (${response.status})`);
    }

    const config = await response.json();
    if (!Array.isArray(config.rooms)) {
      throw new Error("Invalid config: expected rooms array");
    }

    clearPreview();
    config.rooms.forEach((room, index) => addRoom(room, index));
    framePreview();
    setStatus(`Loaded ${config.name ?? "house"} (${config.rooms.length} room(s)).`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    setStatus(`Error: ${message}`);
  }
}

loadButton.addEventListener("click", () => {
  loadPreview(exampleSelect.value);
});

resetCameraButton.addEventListener("click", () => {
  framePreview();
});

window.addEventListener("resize", () => {
  camera.aspect = viewer.clientWidth / viewer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
});

function tick() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
loadPreview(exampleSelect.value);
