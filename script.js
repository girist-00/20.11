const CONFIG = {
  messageCount: 150,
  iconCount: 50,
  starCount: 2000,
  teacherImageCount: 10,
  areaSize: 700,
  fallSpeed: 0.8,
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
const wishes = [], fallingIcons = [], teacherPhotos = [], shootingStars = [];
let stars;

init();
animate();
createShootingStars();

function init() {
  document.getElementById("loading").remove();
  scene = new THREE.Scene();

  // 🎥 Giữ camera tại gốc và chỉ xoay/zoom
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 3000);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, -1);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // 🎮 Controls chỉ xoay và zoom quanh chính camera
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;       // ❌ không cho kéo ngang
  controls.minDistance = 100;       // zoom in tối thiểu
  controls.maxDistance = 1000;      // zoom out tối đa
  controls.target.set(0, 0, -1);    // nhìn ra phía trước
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.04;
  controls.update();

  // 💡 Ánh sáng
  const ambient = new THREE.AmbientLight(0xffffff, 3.5);
  scene.add(ambient);

  const pointLight = new THREE.PointLight(0xffb3ff, 3.5, 2000);
  pointLight.position.set(0, 300, 400);
  scene.add(pointLight);

  createStars();
  createWishes();
  createIcons();
  createTeacherPhotos(CONFIG.teacherImages);

  window.addEventListener("resize", onWindowResize);

  const btn = document.getElementById("music-control");
  const audio = document.getElementById("bg-music");
  let playing = false;
  btn.addEventListener("click", () => {
    if (!playing) {
      audio.play();
      btn.textContent = "🔈";
      playing = true;
    } else {
      audio.pause();
      btn.textContent = "🔊";
      playing = false;
    }
  });
}

function getRandomWarmColor() {
  const hue = 0 + Math.random() * 25;
  const altHue = Math.random() < 0.4 ? 320 + Math.random() * 20 : hue;
  const sat = 70 + Math.random() * 30;
  const light = 55 + Math.random() * 15;
  return `hsl(${altHue}, ${sat}%, ${light}%)`;
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
  testCtx.font = isIcon ? `bold ${fontSize}px 'Segoe UI Emoji'` : `900 ${fontSize}px 'Poppins'`;
  const textWidth = testCtx.measureText(message).width;
  const padding = 300;
  const canvasWidth = Math.min(4096, textWidth + padding);
  const canvasHeight = 1024;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  const fillColor = getRandomWarmColor();

  ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
  ctx.shadowBlur = 20;
  ctx.font = testCtx.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
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

function createTeacherPhotos(urls) {
  const loader = new THREE.TextureLoader();
  for (let i = 0; i < CONFIG.teacherImageCount; i++) {
    const url = urls[Math.floor(Math.random() * urls.length)];
    loader.load(url, (texture) => {
      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
      });
      const photo = new THREE.Sprite(mat);
      const scale = 200 + Math.random() * 100;
      photo.scale.set(scale, scale, 1);
      photo.position.set(
        (Math.random() - 0.5) * CONFIG.areaSize * 3,
        Math.random() * CONFIG.areaSize,
        (Math.random() - 0.5) * CONFIG.areaSize * 3
      );
      scene.add(photo);
      teacherPhotos.push(photo);
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

  [...wishes, ...fallingIcons, ...teacherPhotos].forEach((obj) => {
    obj.position.y -= CONFIG.fallSpeed;
    if (obj.position.y < -CONFIG.areaSize / 2) {
      obj.position.y = CONFIG.areaSize / 2;
      obj.position.x = (Math.random() - 0.5) * CONFIG.areaSize * 3;
      obj.position.z = (Math.random() - 0.5) * CONFIG.areaSize * 3;
    }
    obj.rotation.z += 0.002;
  });

  updateShootingStars();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}
