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

const MATERIALS = {
  floor: new THREE.MeshStandardMaterial({ color: 0x9b7a4c, roughness: 0.85, metalness: 0.04 }),
  ceiling: new THREE.MeshStandardMaterial({ color: 0xc7b79a, roughness: 0.9, metalness: 0.03 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xbcb7ae, roughness: 0.88, metalness: 0.02 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x9ad8ff, transparent: true, opacity: 0.5, roughness: 0.2 }),
  door: new THREE.MeshStandardMaterial({ color: 0x7b4e2c, roughness: 0.82, metalness: 0.05 }),
  roomTint: new THREE.MeshStandardMaterial({ color: 0x58b6ff, transparent: true, opacity: 0.08 }),
};

function setStatus(text) {
  statusEl.textContent = text;
}

function clearPreview() {
  while (previewRoot.children.length) {
    const child = previewRoot.children.pop();
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((m) => m?.dispose?.());
    } else if (!Object.values(MATERIALS).includes(child.material)) {
      child.material?.dispose?.();
    }
  }
}

function roomColor(index) {
  const hue = (index * 57) % 360;
  return new THREE.Color(`hsl(${hue} 58% 57%)`);
}

function normalizeRotation(rotation = 0) {
  const normalized = ((rotation % 360) + 360) % 360;
  return normalized;
}

function transformLocal(room, lx, ly, lz) {
  const rotation = normalizeRotation(room.rotation);
  const ox = room.position.x;
  const oy = room.position.y;
  const oz = room.position.z;

  switch (rotation) {
    case 90:
      return { x: ox - lz, y: oy + ly, z: oz + lx };
    case 180:
      return { x: ox - lx, y: oy + ly, z: oz - lz };
    case 270:
      return { x: ox + lz, y: oy + ly, z: oz - lx };
    case 0:
    default:
      return { x: ox + lx, y: oy + ly, z: oz + lz };
  }
}

function roomToWorldBox(room, centerLocal, sizeLocal) {
  const center = transformLocal(room, centerLocal.x, centerLocal.y, centerLocal.z);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sizeLocal.x, sizeLocal.y, sizeLocal.z), MATERIALS.wall);
  mesh.position.set(center.x, center.y, center.z);
  mesh.rotation.y = THREE.MathUtils.degToRad(normalizeRotation(room.rotation));
  return mesh;
}

function addFloor(room) {
  if (!room.floor) return;
  const yOffset = room.floor.yOffset ?? 0;
  const mesh = roomToWorldBox(
    room,
    { x: (room.width - 1) / 2, y: yOffset, z: (room.depth - 1) / 2 },
    { x: room.width, y: 0.2, z: room.depth }
  );
  mesh.material = MATERIALS.floor;
  previewRoot.add(mesh);
}

function addCeiling(room) {
  if (!room.ceiling) return;
  const mesh = roomToWorldBox(
    room,
    { x: (room.width - 1) / 2, y: room.height, z: (room.depth - 1) / 2 },
    { x: room.width, y: 0.2, z: room.depth }
  );
  mesh.material = MATERIALS.ceiling;
  previewRoot.add(mesh);
}

function wallPlacement(room, side) {
  if (side === "front") {
    return { center: { x: (room.width - 1) / 2, y: room.height / 2, z: 0 }, size: { x: room.width, y: room.height, z: 0.2 } };
  }
  if (side === "back") {
    return {
      center: { x: (room.width - 1) / 2, y: room.height / 2, z: room.depth - 1 },
      size: { x: room.width, y: room.height, z: 0.2 },
    };
  }
  if (side === "left") {
    return { center: { x: 0, y: room.height / 2, z: (room.depth - 1) / 2 }, size: { x: 0.2, y: room.height, z: room.depth } };
  }
  return {
    center: { x: room.width - 1, y: room.height / 2, z: (room.depth - 1) / 2 },
    size: { x: 0.2, y: room.height, z: room.depth },
  };
}

function addWalls(room) {
  (room.walls ?? []).forEach((wall) => {
    const startHeight = wall.startHeight ?? 1;
    const wallHeight = wall.wallHeight ?? room.height;
    const config = wallPlacement(room, wall.side);
    const mesh = roomToWorldBox(
      room,
      { x: config.center.x, y: startHeight + wallHeight / 2 - 0.5, z: config.center.z },
      { x: config.size.x, y: wallHeight, z: config.size.z }
    );
    mesh.material = MATERIALS.wall;
    previewRoot.add(mesh);
  });
}

function openingPlacement(room, side, offsetAlong, offsetHeight, width, height) {
  if (side === "front") {
    return { center: { x: offsetAlong + (width - 1) / 2, y: offsetHeight + (height - 1) / 2, z: 0 }, size: { x: width, y: height, z: 0.22 } };
  }
  if (side === "back") {
    return {
      center: { x: offsetAlong + (width - 1) / 2, y: offsetHeight + (height - 1) / 2, z: room.depth - 1 },
      size: { x: width, y: height, z: 0.22 },
    };
  }
  if (side === "left") {
    return {
      center: { x: 0, y: offsetHeight + (height - 1) / 2, z: offsetAlong + (width - 1) / 2 },
      size: { x: 0.22, y: height, z: width },
    };
  }
  return {
    center: { x: room.width - 1, y: offsetHeight + (height - 1) / 2, z: offsetAlong + (width - 1) / 2 },
    size: { x: 0.22, y: height, z: width },
  };
}

function addWindows(room) {
  (room.windows ?? []).forEach((window) => {
    const width = window.width ?? 2;
    const height = window.height ?? 2;
    const config = openingPlacement(room, window.side, window.offsetAlong, window.offsetHeight, width, height);
    const mesh = roomToWorldBox(room, config.center, config.size);
    mesh.material = MATERIALS.glass;
    previewRoot.add(mesh);
  });
}

function addDoors(room) {
  (room.doors ?? []).forEach((door) => {
    const config = openingPlacement(room, door.side, door.offsetAlong, 1, 1, 2);
    const mesh = roomToWorldBox(room, config.center, config.size);
    mesh.material = MATERIALS.door;
    previewRoot.add(mesh);
  });
}

function addRoomBounds(room, index) {
  const color = roomColor(index);
  const boxGeometry = new THREE.BoxGeometry(room.width, room.height, room.depth);
  const fillMat = MATERIALS.roomTint.clone();
  fillMat.color = color;
  const fill = new THREE.Mesh(boxGeometry, fillMat);

  const lineGeo = new THREE.EdgesGeometry(boxGeometry);
  const lineMat = new THREE.LineBasicMaterial({ color: color.clone().multiplyScalar(0.75) });
  const wire = new THREE.LineSegments(lineGeo, lineMat);

  const center = transformLocal(room, (room.width - 1) / 2, room.height / 2, (room.depth - 1) / 2);
  fill.position.set(center.x, center.y, center.z);
  wire.position.copy(fill.position);
  fill.rotation.y = THREE.MathUtils.degToRad(normalizeRotation(room.rotation));
  wire.rotation.y = fill.rotation.y;

  previewRoot.add(fill);
  previewRoot.add(wire);
}

function addRoom(room, index) {
  addFloor(room);
  addCeiling(room);
  addWalls(room);
  addWindows(room);
  addDoors(room);
  addRoomBounds(room, index);
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
