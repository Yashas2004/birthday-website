/* ================= SAFETY ================= */
const container = document.getElementById("cake-container");
if (!container) {
  throw new Error("cake-container not found");
}

/* ================= SCENE ================= */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfff5f8);

/* ================= CAMERA ================= */
const camera = new THREE.PerspectiveCamera(
  40,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);
camera.position.set(0, 6, 10);
camera.lookAt(0, 2, 0);

/* ================= RENDERER ================= */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

/* ================= LIGHTING ================= */
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
keyLight.position.set(5, 8, 6);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 20;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffd6e0, 0.4);
fillLight.position.set(-5, 4, 4);
scene.add(fillLight);

/* ================= GROUND (SOFT SHADOW) ================= */
const groundGeo = new THREE.PlaneGeometry(20, 20);
const groundMat = new THREE.ShadowMaterial({
  opacity: 0.25   // softness of shadow
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.75;
ground.receiveShadow = true;
scene.add(ground);

/* ================= CAKE GROUP ================= */
const cake = new THREE.Group();
cake.castShadow = true;

/* Helper: cake layer */
function cakeLayer(radius, height, color) {
  const geo = new THREE.CylinderGeometry(radius, radius * 0.98, height, 64);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.45,
    metalness: 0.05
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

/* Layers */
const bottomLayer = cakeLayer(3, 1.3, 0xff9aa2);
bottomLayer.position.y = 0;
cake.add(bottomLayer);

const middleLayer = cakeLayer(2.6, 1.2, 0xff6f91);
middleLayer.position.y = 1.25;
cake.add(middleLayer);

const topLayer = cakeLayer(2.2, 1.1, 0xff4d6d);
topLayer.position.y = 2.45;
cake.add(topLayer);

/* ================= ICING ================= */
const icingGeo = new THREE.TorusGeometry(2.3, 0.18, 24, 120);
const icingMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.3
});
const icing = new THREE.Mesh(icingGeo, icingMat);
icing.rotation.x = Math.PI / 2;
icing.position.y = 3.1;
icing.castShadow = true;
cake.add(icing);

/* ================= STRAWBERRIES ================= */
function createStrawberry(x, z) {
  const strawberry = new THREE.Group();

  const bodyGeo = new THREE.SphereGeometry(0.25, 16, 16);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xe63946,
    roughness: 0.4
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.scale.y = 1.2;
  body.castShadow = true;
  strawberry.add(body);

  const leafGeo = new THREE.ConeGeometry(0.12, 0.2, 8);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2a9d8f });

  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.y = 0.25;
    leaf.rotation.z = Math.PI;
    leaf.rotation.y = (i / 5) * Math.PI * 2;
    leaf.castShadow = true;
    strawberry.add(leaf);
  }

  strawberry.position.set(x, 3.4, z);
  return strawberry;
}

[
  [0.8, 0],
  [-0.8, 0],
  [0, 0.8],
  [0, -0.8],
  [0.5, 0.5]
].forEach(pos => cake.add(createStrawberry(pos[0], pos[1])));

/* ================= PLATE ================= */
const plateGeo = new THREE.CylinderGeometry(3.8, 4.1, 0.25, 64);
const plateMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.25
});
const plate = new THREE.Mesh(plateGeo, plateMat);
plate.position.y = -0.6;
plate.receiveShadow = true;
cake.add(plate);

/* ================= CANDLE ================= */
const candleGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.4, 20);
const candleMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const candle = new THREE.Mesh(candleGeo, candleMat);
candle.position.y = 3.7;
candle.castShadow = true;
cake.add(candle);

/* Flame */
const flameGeo = new THREE.SphereGeometry(0.18, 16, 16);
const flameMat = new THREE.MeshBasicMaterial({ color: 0xffc93c });
const flame = new THREE.Mesh(flameGeo, flameMat);
flame.position.y = 4.5;
cake.add(flame);

scene.add(cake);

/* ================= ANIMATION ================= */
function animate() {
  requestAnimationFrame(animate);

  cake.rotation.y += 0.004;

  const flicker = Math.sin(Date.now() * 0.01);
  flame.scale.y = 1 + flicker * 0.3;
  flame.position.y = 4.5 + flicker * 0.05;

  renderer.render(scene, camera);
}
animate();

/* ================= RESPONSIVE ================= */
window.addEventListener("resize", () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
