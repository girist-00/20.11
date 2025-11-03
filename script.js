// 🌸 CƠN MƯA LỜI CHÚC 20/11 — Phiên bản tối ưu hiệu năng 🌸
const CONFIG = {
  messageCount: 70,
  iconCount: 25,
  starCount: 1200,
  teacherImageCount: 6,
  areaSize: 600,
  fallSpeed: 0.6,
  teacherImages: [
    "./images/0abb95f22ca0a0fef9b1.webp",
    "./images/53cb76bcf0ee7cb025ff.webp",
    "./images/67fb6f3dd66f5a31037e.webp",
    "./images/73435048d61a5a44030b.webp"
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
    "Những bài học hôm nay là hành trang mai sau 📖",
    "Kính chúc thầy cô luôn rạng rỡ nụ cười 🌞"
  ],
  icons: ["🌸", "❤️", "🌟", "📚", "💖", "✨", "🌻", "🍀", "🎓", "🖋️", "💐", "🌹"]
};

let scene, camera, renderer, controls;
const wishes = [], fallingIcons = [], teacherPhotos = [], shootingStars = [];
let stars;

// Cache để tránh tạo lại cùng text/icon nhiều lần
const textureCache = {};

init();
animate();
createShootingStars();

function init() {
  document.getElementById("loading")?.remove();
  scene = new THREE.Scene();

  // 🎥 Camera cố định, chỉ zoom/rotate nhẹ
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 3000);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, -1);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // 🎮 Controls — nhẹ hơn: tắt pan, giảm autoRotate
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 100;
  controls.maxDistance = 1000;
  controls.target.set(0, 0, -1);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.02;
  controls.update();

  // 💡 Ánh sáng nhẹ
  const ambient = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambient);

  const pointLight = new THREE.PointLight(0xffb3ff, 2, 1500);
  pointLight.position.set(0, 300, 400);
  scene.add(pointLight);

  createStars();
  createWishes();
  createIcons();
  createTeacherPhotos(CONFIG.teacherImages);

  window.addEventListener("resize", onWindowResize);

  // 🔈 Nút nhạc
  const btn = document.getElementById("music-control");
  const audio = document.getElementById("bg-music");
  let playing = false;
  if (btn && audio) {
    btn.addEventListener("click", () => {
      playing ? audio.pause() : audio.play();
      playing = !playing;
      btn.textContent = playing ? "🔈" : "🔊";
    });
  }
}

function getRandomWarmColor() {
  const hue = Math.random() < 0.4 ? 320 + Math.random() * 20 : 0 + Math.random() * 25;
  const sat = 70 + Math.random() * 20;
  const light = 60 + Math.random() * 10;
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

function createStars() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < CONFIG.starCount; i++) {
    vertices.push(
      (Math.random() - 0.5) * 5000,
      (Math.random() - 0.5) * 5000,
      (Math.random() - 0.5) * 5000
    );
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 5,
    opacity: 0.8,
    transparent: true
  });
  stars = new THREE.Points(geometry, material);
  scene.add(stars);
}

function createTextSprite(message, isIcon = false) {
  if (textureCache[message]) {
    const mat = new THREE.SpriteMaterial({ map: textureCache[message], transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(isIcon ? 40 : 280, isIcon ? 40 : 60, 1);
    return sprite;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const fontSize = isIcon ? 160 : 120;
  ctx.font = isIcon ? `bold ${fontSize}px 'Segoe UI Emoji'` : `700 ${fontSize}px 'Poppins'`;

  const textWidth = ctx.measureText(message).width;
  canvas.width = Math.min(2048, textWidth + 200);
  canvas.height = 512;
  ctx.font = ctx.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = getRandomWarmColor();
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache[message] = texture;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: !isIcon });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(isIcon ? 40 : Math.min(280, textWidth / 8), isIcon ? 40 : 60, 1);
  return sprite;
}

function createWishes() {
  for (let i = 0; i < CONFIG.messageCount; i++) {
    const text = CONFIG.messages[Math.floor(Math.random() * CONFIG.messages.length)];
    const sprite = createTextSprite(text);
    sprite.position.set(
      (Math.random() - 0.5) * CONFIG.areaSize * 2,
      Math.random() * CONFIG.areaSize,
      -400 + Math.random() * 200
    );
    scene.add(sprite);
    wishes.push(sprite);
  }
}

function createIcons() {
  for (let i = 0; i < CONFIG.iconCount; i++) {
    const icon = CONFIG.icons[Math.floor(Math.random() * CONFIG.icons.length)];
    const sprite = createTextSprite(icon, true);
    sprite.position.set(
      (Math.random() - 0.5) * CONFIG.areaSize * 3,
      Math.random() * CONFIG.areaSize,
      (Math.random() - 0.5) * CONFIG.areaSize * 3
    );
    scene.add(sprite);
    fallingIcons.push(sprite);
  }
}

// 🌸 Lazy load ảnh giáo viên
function createTeacherPhotos(urls) {
  const loader = new THREE.TextureLoader();
  let loaded = 0;
  function loadNext() {
    if (loaded >= CONFIG.teacherImageCount) return;
    const url = urls[Math.floor(Math.random() * urls.length)];
    loader.load(url, texture => {
      const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.85 });
      const photo = new THREE.Sprite(mat);
      const scale = 180 + Math.random() * 80;
      photo.scale.set(scale, scale, 1);
      photo.position.set(
        (Math.random() - 0.5) * CONFIG.areaSize * 3,
        Math.random() * CONFIG.areaSize,
        (Math.random() - 0.5) * CONFIG.areaSize * 3
      );
      scene.add(photo);
      teacherPhotos.push(photo);
      loaded++;
      setTimeout(loadNext, 400); // Load từng ảnh cách nhau 0.4s
    });
  }
  loadNext();
}

// 🌠 Sao băng
function createShootingStars() {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  for (let i = 0; i < 8; i++) {
    const line = new THREE.Line(geo, mat.clone());
    resetShootingStar(line);
    scene.add(line);
    shootingStars.push(line);
  }
}

function resetShootingStar(line) {
  line.position.set((Math.random() - 0.5) * 2000, 400 + Math.random() * 400, (Math.random() - 0.5) * 800);
  line.userData.vx = -10 - Math.random() * 10;
  line.userData.vy = -6 - Math.random() * 8;
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

// 🌀 Hiệu ứng chính
function animate() {
  setTimeout(() => requestAnimationFrame(animate), 1000 / 45); // Giới hạn 45 FPS
  controls.update();
  stars.rotation.y += 0.00025;
  stars.rotation.x += 0.00025;

  const all = [...wishes, ...fallingIcons, ...teacherPhotos];
  for (const obj of all) {
    obj.position.y -= CONFIG.fallSpeed;
    if (obj.position.y < -CONFIG.areaSize / 2) {
      obj.position.y = CONFIG.areaSize / 2;
      obj.position.x = (Math.random() - 0.5) * CONFIG.areaSize * 3;
      obj.position.z = (Math.random() - 0.5) * CONFIG.areaSize * 3;
    }
    obj.rotation.z += 0.0015;
  }

  updateShootingStars();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}
