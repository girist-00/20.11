const CONFIG = {
  layers: 3,
  messageCount: 50,
  iconCount: 50,
  starCount: 3000,
  teacherImageCount: 8,
  areaSize: 700,
  fallSpeed: 0.5,
  objectDistance: 300,
  teacherImages: [
    "./images/0abb95f22ca0a0fef9b1.jpg",
    "./images/53cb76bcf0ee7cb025ff.jpg",
    "./images/67fb6f3dd66f5a31037e.jpg",
    "./images/73435048d61a5a44030b.jpg"
  ],
  messages: [
    "🌸 Chúc mừng ngày Nhà giáo Việt Nam 20/11 🌸",
    "Kính chúc thầy cô luôn mạnh khỏe, hạnh phúc ❤️",
    "Cảm ơn thầy cô đã tận tâm dìu dắt học trò 🏫",
    "Thầy cô là ngọn hải đăng soi sáng tương lai 🌟",
    "Tri ân người lái đò thầm lặng 🚤",
    "Chúc cô luôn tươi trẻ, nhiệt huyết và yêu nghề 🌷",
    "Thầy cô – người gieo hạt ước mơ 💫",
    "Một ngày 20/11 thật nhiều niềm vui và yêu thương 🎉",
    "Chúc thầy cô tràn đầy năng lượng tích cực ☀️",
    "Em mãi biết ơn những bài học và tình thương của thầy cô 💖",
    "Người thắp sáng con đường tri thức ✨",
    "Tình thầy cô là ngọn lửa ấm áp suốt đời 🔥",
    "Cảm ơn cô vì những bài giảng tràn đầy yêu thương 💕",
    "Cảm ơn thầy vì đã truyền cảm hứng và đam mê 🎓",
    "Thầy cô – người dẫn đường tận tâm và bao dung 🌻",
    "Chúc thầy cô thật nhiều sức khỏe và hạnh phúc 💪",
    "Những bài học hôm nay là hành trang mai sau 📖",
    "Kính chúc thầy cô luôn rạng rỡ nụ cười 🌞"
  ],
  icons: ["🌸", "❤️", "🌟", "📚", "💖", "✨", "🌻", "🍀", "🎓", "🖋️", "💐", "🌹"]
};

let scene, camera, renderer, controls;
const layers = [];
let stars, initialCameraMatrix;
const shootingStars = [];

init();
animate();
createShootingStars();

function init() {
  document.getElementById("loading")?.remove();
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 3000);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = false;

  const ambient = new THREE.AmbientLight(0xffffff, 3.5);
  scene.add(ambient);
  const pointLight = new THREE.PointLight(0xffb3ff, 3.5, 2000);
  pointLight.position.set(0, 300, 400);
  scene.add(pointLight);

  initialCameraMatrix = camera.matrixWorld.clone();

  createStars();

  for (let i = 0; i < CONFIG.layers; i++) {
    const layerGroup = new THREE.Group();
    layerGroup.userData.depth = CONFIG.objectDistance + i * 150;
    layers.push(layerGroup);
    scene.add(layerGroup);

    createWishes(layerGroup);
    createIcons(layerGroup);
    createTeacherPhotos(CONFIG.teacherImages, layerGroup);
  }

  window.addEventListener("resize", onWindowResize);

  const btn = document.getElementById("music-control");
  const audio = document.getElementById("bg-music");
  let playing = false;
  if (btn && audio) {
    btn.addEventListener("click", () => {
      if (!playing) {
        audio.play();
        btn.textContent = "🔊";
      } else {
        audio.pause();
        btn.textContent = "🔈";
      }
      playing = !playing;
    });
  }
}

function getRandomWarmColor() {
  // Hue mở rộng: từ đỏ (0°) → cam (40°) → hồng (350°)
  const hue = Math.random() < 0.5
    ? 0 + Math.random() * 40     // đỏ → cam
    : 330 + Math.random() * 30;  // hồng → đỏ tím
  
  const sat = 85 + Math.random() * 15;  // độ bão hòa cao (85–100%)
  const light = 50 + Math.random() * 15; // sáng vừa phải, không cháy
  
  return `hsl(${hue % 360}, ${sat}%, ${light}%)`;
}

function createStars() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < CONFIG.starCount; i++) {
    vertices.push(
      (Math.random() - 0.5) * 6000,
      (Math.random() - 0.5) * 6000,
      (Math.random() - 0.5) * 6000
    );
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 4,
    opacity: 0.9,
    transparent: true
  });
  stars = new THREE.Points(geometry, material);
  scene.add(stars);
}

function createTextSprite(message, isIcon = false) {
  const testCanvas = document.createElement("canvas");
  const testCtx = testCanvas.getContext("2d");
  const fontSize = isIcon ? 160 : 140;
testCtx.font = isIcon
  ? `bold ${fontSize}px 'Segoe UI Emoji'`
  : `700 ${fontSize}px 'Be Vietnam Pro', sans-serif`;
  const textWidth = testCtx.measureText(message).width;
  const padding = 300;
  const canvasWidth = Math.min(4096, textWidth + padding);
  const canvasHeight = 1024;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  const fillColor = getRandomWarmColor();
  ctx.shadowColor = "rgba(255, 255, 255, 0.37)";
  ctx.shadowBlur = 20;
  ctx.font = testCtx.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.strokeText(message, canvasWidth / 2, canvasHeight / 2);
  ctx.fillStyle = fillColor;
  ctx.fillText(message, canvasWidth / 2, canvasHeight / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  const scaleX = isIcon ? 45 : Math.min(320, textWidth / 8);
  const scaleY = isIcon ? 45 : 70;
  sprite.scale.set(scaleX, scaleY, 1);
  return sprite;
}

function createWishes(group) {
  const DISTANCE = group.userData.depth;
  for (let i = 0; i < CONFIG.messageCount / CONFIG.layers; i++) {
    const text = CONFIG.messages[Math.floor(Math.random() * CONFIG.messages.length)];
    const sprite = createTextSprite(text);
    const localPos = new THREE.Vector3(
      (Math.random() - 0.5) * CONFIG.areaSize,
      (Math.random() - 0.5) * CONFIG.areaSize,
      -DISTANCE
    );
    const worldPos = localPos.clone().applyMatrix4(initialCameraMatrix);
    sprite.position.copy(worldPos);
    group.add(sprite);
  }
}

function createIcons(group) {
  const DISTANCE = group.userData.depth;
  for (let i = 0; i < CONFIG.iconCount / CONFIG.layers; i++) {
    const icon = CONFIG.icons[Math.floor(Math.random() * CONFIG.icons.length)];
    const sprite = createTextSprite(icon, true);
    const localPos = new THREE.Vector3(
      (Math.random() - 0.5) * CONFIG.areaSize,
      (Math.random() - 0.5) * CONFIG.areaSize,
      -DISTANCE
    );
    const worldPos = localPos.clone().applyMatrix4(initialCameraMatrix);
    sprite.position.copy(worldPos);
    group.add(sprite);
  }
}

function createTeacherPhotos(urls, group) {
  const loader = new THREE.TextureLoader();
  const DISTANCE = group.userData.depth + 50;
  for (let i = 0; i < CONFIG.teacherImageCount / CONFIG.layers; i++) {
    const url = urls[Math.floor(Math.random() * urls.length)];
    loader.load(url, (texture) => {
      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
      });
      const photo = new THREE.Sprite(mat);
      const scale = 100 + Math.random() * 60; // ⬅️ giảm kích thước hình
      photo.scale.set(scale, scale, 1);

      const localPos = new THREE.Vector3(
        (Math.random() - 0.5) * CONFIG.areaSize,
        (Math.random() - 0.5) * CONFIG.areaSize,
        -DISTANCE
      );
      const worldPos = localPos.clone().applyMatrix4(initialCameraMatrix);
      photo.position.copy(worldPos);
      group.add(photo);
    });
  }
}

function createShootingStars() {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  for (let i = 0; i < 10; i++) {
    const line = new THREE.Line(geo, mat.clone());
    resetShootingStar(line);
    scene.add(line);
    shootingStars.push(line);
  }
}

function resetShootingStar(line) {
  line.position.set((Math.random() - 0.5) * 2000, 500 + Math.random() * 500, (Math.random() - 0.5) * 800);
  line.userData.vx = -10 - Math.random() * 15;
  line.userData.vy = -8 - Math.random() * 10;
  line.material.opacity = 0.8;
}

function updateShootingStars() {
  for (const star of shootingStars) {
    star.position.x += star.userData.vx;
    star.position.y += star.userData.vy;
    star.material.opacity -= 0.008;
    if (star.material.opacity <= 0) resetShootingStar(star);
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  stars.rotation.y += 0.00025;
  stars.rotation.x += 0.00025;

  for (const group of layers) {
    const speed = CONFIG.fallSpeed * (1 + group.userData.depth / 1000);
    group.children.forEach((obj) => {
      obj.position.y -= speed;
      if (obj.position.y < -CONFIG.areaSize / 2) {
        obj.position.y = CONFIG.areaSize / 2;
      }
    });
  }

  updateShootingStars();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}
