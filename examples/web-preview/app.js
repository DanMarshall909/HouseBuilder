import * as THREE from "three";

const viewer = document.getElementById("viewer");
const statusEl = document.getElementById("status");
const exampleSelect = document.getElementById("exampleSelect");
const loadButton = document.getElementById("loadButton");
const resetCameraButton = document.getElementById("resetCameraButton");
const opacityToggleButton = document.getElementById("opacityToggleButton");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf9f3e3);

const camera = new THREE.PerspectiveCamera(55, viewer.clientWidth / viewer.clientHeight, 0.1, 3000);
camera.position.set(30, 30, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
viewer.appendChild(renderer.domElement);

const keyState = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  KeyQ: false,
  KeyE: false,
};

const BASE_MOVE_SPEED = 0.22;
const MAX_MOVE_SPEED = 1.8;
const ACCELERATION_PER_SECOND = 1.35;
let currentMoveSpeed = BASE_MOVE_SPEED;
const clock = new THREE.Clock();

const POINTER_SENSITIVITY = 0.0022;
const pitchLimit = THREE.MathUtils.degToRad(89);
const lookTarget = new THREE.Vector3(0, 0, 0);
let yaw = 0;
let pitch = 0;

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
  roof: new THREE.MeshStandardMaterial({ color: 0x8e4f34, roughness: 0.9, metalness: 0.03 }),
  roomTint: new THREE.MeshStandardMaterial({ color: 0x58b6ff, transparent: true, opacity: 0.08 }),
};

const SURFACE_MATERIAL_KEYS = ["floor", "ceiling", "wall", "glass", "door", "roof", "roomTint"];
const CUBE_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);
const MATERIAL_BY_KIND = {
  floor: MATERIALS.floor,
  ceiling: MATERIALS.ceiling,
  wall: MATERIALS.wall,
  window: MATERIALS.glass,
  door: MATERIALS.door,
  roof: MATERIALS.roof,
};

let halfOpacityEnabled = false;
let lastLoadedSignature = "";
let isLoadingPreview = false;

function setStatus(text) {
  statusEl.textContent = text;
}

function syncLookTarget(distance = 10) {
  const direction = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch)
  ).normalize();
  lookTarget.copy(camera.position).addScaledVector(direction, distance);
}

function applyLookDirection() {
  camera.lookAt(lookTarget);
}

function setCameraFacing(position, target) {
  camera.position.copy(position);
  const direction = target.clone().sub(position).normalize();
  pitch = Math.asin(direction.y);
  yaw = Math.atan2(direction.x, direction.z);
  syncLookTarget(position.distanceTo(target));
  applyLookDirection();
}

function applySurfaceOpacityMode() {
  SURFACE_MATERIAL_KEYS.forEach((key) => {
    const material = MATERIALS[key];
    if (!material) return;

    if (halfOpacityEnabled) {
      material.transparent = true;
      material.opacity = 0.5;
    } else if (key === "glass") {
      material.transparent = true;
      material.opacity = 0.5;
    } else if (key === "roomTint") {
      material.transparent = true;
      material.opacity = 0.08;
    } else {
      material.transparent = false;
      material.opacity = 1;
    }

    material.needsUpdate = true;
  });

  opacityToggleButton.textContent = halfOpacityEnabled ? "Toggle 50% Opacity (On)" : "Toggle 50% Opacity";
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

function normalizeRotation(rotation = 0) {
  return ((rotation % 360) + 360) % 360;
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

function blockKey(x, y, z) {
  return `${x}:${y}:${z}`;
}

function setBlock(buffer, room, lx, ly, lz, kind) {
  const world = transformLocal(room, lx, ly, lz);
  buffer.set(blockKey(world.x, world.y, world.z), { x: world.x, y: world.y, z: world.z, kind });
}

function fillLineX(buffer, room, xStart, xEnd, y, z, kind) {
  for (let x = xStart; x <= xEnd; x++) {
    setBlock(buffer, room, x, y, z, kind);
  }
}

function fillLineZ(buffer, room, zStart, zEnd, y, x, kind) {
  for (let z = zStart; z <= zEnd; z++) {
    setBlock(buffer, room, x, y, z, kind);
  }
}

function buildRoomIntoBuffer(room, buffer) {
  const width = room.width;
  const depth = room.depth;
  const height = room.height;

  if (room.floor) {
    const y = room.floor.yOffset ?? 0;
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        setBlock(buffer, room, x, y, z, "floor");
      }
    }
  }

  if (room.ceiling) {
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        setBlock(buffer, room, x, height, z, "ceiling");
      }
    }
  }

  (room.walls ?? []).forEach((wall) => {
    const startHeight = wall.startHeight ?? 1;
    const wallHeight = wall.wallHeight ?? height;

    for (let y = startHeight; y < startHeight + wallHeight; y++) {
      if (wall.side === "front") {
        fillLineX(buffer, room, 0, width - 1, y, 0, "wall");
      } else if (wall.side === "back") {
        fillLineX(buffer, room, 0, width - 1, y, depth - 1, "wall");
      } else if (wall.side === "left") {
        fillLineZ(buffer, room, 0, depth - 1, y, 0, "wall");
      } else {
        fillLineZ(buffer, room, 0, depth - 1, y, width - 1, "wall");
      }
    }
  });

  (room.windows ?? []).forEach((window) => {
    const w = window.width ?? 2;
    const h = window.height ?? 2;

    for (let dy = 0; dy < h; dy++) {
      for (let da = 0; da < w; da++) {
        if (window.side === "front") {
          setBlock(buffer, room, window.offsetAlong + da, window.offsetHeight + dy, 0, "window");
        } else if (window.side === "back") {
          setBlock(buffer, room, window.offsetAlong + da, window.offsetHeight + dy, depth - 1, "window");
        } else if (window.side === "left") {
          setBlock(buffer, room, 0, window.offsetHeight + dy, window.offsetAlong + da, "window");
        } else {
          setBlock(buffer, room, width - 1, window.offsetHeight + dy, window.offsetAlong + da, "window");
        }
      }
    }
  });

  (room.doors ?? []).forEach((door) => {
    for (let dy = 0; dy < 2; dy++) {
      if (door.side === "front") {
        setBlock(buffer, room, door.offsetAlong, 1 + dy, 0, "door");
      } else if (door.side === "back") {
        setBlock(buffer, room, door.offsetAlong, 1 + dy, depth - 1, "door");
      } else if (door.side === "left") {
        setBlock(buffer, room, 0, 1 + dy, door.offsetAlong, "door");
      } else {
        setBlock(buffer, room, width - 1, 1 + dy, door.offsetAlong, "door");
      }
    }
  });

  if (room.roof) {
    const roofY = height + 1;
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        setBlock(buffer, room, x, roofY, z, "roof");
      }
    }
  }
}

function renderVoxelBuffer(buffer) {
  const tintGeo = new THREE.BoxGeometry(1.02, 1.02, 1.02);

  buffer.forEach((block) => {
    const material = MATERIAL_BY_KIND[block.kind] ?? MATERIALS.wall;
    const cube = new THREE.Mesh(CUBE_GEOMETRY, material);
    cube.position.set(block.x, block.y, block.z);
    previewRoot.add(cube);

    if (block.kind === "window" || block.kind === "door") {
      const outline = new THREE.Mesh(tintGeo, MATERIALS.roomTint);
      outline.position.copy(cube.position);
      previewRoot.add(outline);
    }
  });
}

function framePreview() {
  const box = new THREE.Box3().setFromObject(previewRoot);
  if (box.isEmpty()) {
    setCameraFacing(new THREE.Vector3(30, 30, 30), new THREE.Vector3(0, 0, 0));
    return;
  }

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  setCameraFacing(
    new THREE.Vector3(center.x + size * 0.8, center.y + size * 0.7, center.z + size * 0.8),
    center
  );
}

async function loadPreview(path) {
  if (isLoadingPreview) {
    return;
  }

  try {
    isLoadingPreview = true;
    setStatus(`Loading ${path}...`);
    const response = await fetch(`${path}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load JSON (${response.status})`);
    }

    const raw = await response.text();
    const config = JSON.parse(raw);
    if (!Array.isArray(config.rooms)) {
      throw new Error("Invalid config: expected rooms array");
    }

    const buffer = new Map();
    config.rooms.forEach((room) => buildRoomIntoBuffer(room, buffer));

    clearPreview();
    renderVoxelBuffer(buffer);
    framePreview();
    lastLoadedSignature = raw;
    setStatus(`Loaded ${config.name ?? "house"} (${buffer.size} voxels).`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    setStatus(`Error: ${message}`);
  } finally {
    isLoadingPreview = false;
  }
}

loadButton.addEventListener("click", () => {
  loadPreview(exampleSelect.value);
});

exampleSelect.addEventListener("change", () => {
  loadPreview(exampleSelect.value);
});

resetCameraButton.addEventListener("click", () => {
  framePreview();
});

opacityToggleButton.addEventListener("click", () => {
  halfOpacityEnabled = !halfOpacityEnabled;
  applySurfaceOpacityMode();
});

window.addEventListener("resize", () => {
  camera.aspect = viewer.clientWidth / viewer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
});

function tick() {
  const deltaSeconds = Math.min(clock.getDelta(), 0.05);

  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize();
  const right = new THREE.Vector3().crossVectors(camera.up, forward).normalize();
  const movement = new THREE.Vector3();

  if (keyState.KeyW) movement.add(forward);
  if (keyState.KeyS) movement.sub(forward);
  if (keyState.KeyD) movement.sub(right);
  if (keyState.KeyA) movement.add(right);
  if (keyState.KeyE) movement.y += 1;
  if (keyState.KeyQ) movement.y -= 1;

  if (movement.lengthSq() > 0) {
    currentMoveSpeed = Math.min(MAX_MOVE_SPEED, currentMoveSpeed + ACCELERATION_PER_SECOND * deltaSeconds);
    movement.normalize().multiplyScalar(currentMoveSpeed * (deltaSeconds * 60));
    camera.position.add(movement);
    lookTarget.add(movement);
  } else {
    currentMoveSpeed = BASE_MOVE_SPEED;
  }

  applyLookDirection();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

renderer.domElement.addEventListener("click", () => {
  renderer.domElement.requestPointerLock();
});

window.addEventListener("mousemove", (event) => {
  if (document.pointerLockElement !== renderer.domElement) {
    return;
  }

  yaw += event.movementX * POINTER_SENSITIVITY;
  pitch -= event.movementY * POINTER_SENSITIVITY;
  pitch = THREE.MathUtils.clamp(pitch, -pitchLimit, pitchLimit);
  syncLookTarget();
});

window.addEventListener("keydown", (event) => {
  if (event.code in keyState) {
    keyState[event.code] = true;
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code in keyState) {
    keyState[event.code] = false;
    event.preventDefault();
  }
});

setInterval(async () => {
  if (isLoadingPreview) {
    return;
  }

  const path = exampleSelect.value;
  try {
    const response = await fetch(`${path}?watch=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const raw = await response.text();
    if (raw !== lastLoadedSignature) {
      await loadPreview(path);
      setStatus("Detected JSON change. Preview refreshed.");
    }
  } catch {
    // Ignore transient watch errors
  }
}, 1000);

tick();
applySurfaceOpacityMode();
loadPreview(exampleSelect.value);
