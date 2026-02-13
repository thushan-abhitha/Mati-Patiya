/* ========= Helpers ========= */
const $ = (sel) => document.querySelector(sel);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

/* ========= Login Gate (NEW) ========= */
const LOGIN_USER = "Ieshi&Abhi";
const LOGIN_PASS = "25/04/2025";

const loginForm = $("#loginForm");
const loginUser = $("#loginUser");
const loginPass = $("#loginPass");
const loginError = $("#loginError");
const loginBtn = $("#loginBtn");
const loginCard = document.querySelector(".loginCard");

let typingStarted = false;

function startIntroTypingIfNeeded(){
  if (typingStarted) return;
  typingStarted = true;
  typeNext();
}

function goToIntro(){
  showScreen("#screen-intro");
  // small heart burst for “logged in” vibe
  burstHearts(10);
  setTimeout(() => startIntroTypingIfNeeded(), 150);
}

function validateLogin(u, p){
  return u === LOGIN_USER && p === LOGIN_PASS;
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const u = (loginUser.value || "").trim();
    const p = (loginPass.value || "").trim();

    if (validateLogin(u, p)) {
      loginError.textContent = "Access granted 😌💗";
      loginBtn.disabled = true;

      // cute success animation
      loginCard?.classList.remove("loginShake");
      loginCard?.classList.add("loginSuccess");
      startConfetti(900);
      burstHearts(14);

      setTimeout(() => {
        loginBtn.disabled = false;
        document.activeElement?.blur();
        window.scrollTo(0, 0);
        goToIntro();
      }, 650);

    } else {
      loginError.textContent = "That’s not it, counselor. Try again😤";
      // shake + clear pass
      loginCard?.classList.remove("loginSuccess");
      loginCard?.classList.remove("loginShake");
      void loginCard?.offsetWidth;
      loginCard?.classList.add("loginShake");
      loginPass.value = "";
      loginPass.focus();
      // tiny “angry” hearts burst
      burstHearts(6);
    }
  });
}

/* ========= Typing Intro ========= */
const typeTextEl = $("#typeText");
const introContinue = $("#introContinue");

const introLine = "Hey Ieshiii 💗";
let typeIdx = 0;
let typingDone = false;

function typeNext() {
  if (typeIdx <= introLine.length) {
    typeTextEl.textContent = introLine.slice(0, typeIdx);
    typeIdx++;
    setTimeout(typeNext, 90);
  } else {
    typingDone = true;
    introContinue.disabled = false;
  }
}

// NOTE: typing starts only after login success via startIntroTypingIfNeeded()

document.addEventListener("pointerdown", () => {
  // only allow skip typing if we are actually on intro
  const introActive = $("#screen-intro")?.classList.contains("active");
  if (introActive && !typingDone) {
    typeIdx = introLine.length + 1;
    typeTextEl.textContent = introLine;
    typingDone = true;
    introContinue.disabled = false;
  }
}, { once: false });

introContinue?.addEventListener("click", () => {
  showScreen("#screen-question");
});

/* ========= No button dodge + angry cat ========= */
const noBtn = $("#noBtn");
const noZone = $("#noZone");
const noTaunt = $("#noTaunt");
const noMeter = $("#noMeter");

let consecutiveNo = 0;

const taunts = [
  "Hmm? that finger slipped 😤",
  "No? are you suuure? 🙃",
  "That button is in its villain era.",
  "Try again… if you can 👀",
  "Plot twist: it refuses to be pressed."
];

function updateNoMeter() {
  const icons = ["🤍", "🤍", "🤍"];
  for (let i = 0; i < 3; i++) icons[i] = i < consecutiveNo ? "💢" : "🤍";
  noMeter.textContent = icons.join(" ");
}

function moveNoButton() {
  const rect = noZone.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const pad = 12;

  const maxX = rect.width - btnRect.width - pad * 2;
  const maxY = rect.height - btnRect.height - pad * 2;

  if (maxX < 10 || maxY < 10) {
    noBtn.classList.remove("shake");
    void noBtn.offsetWidth;
    noBtn.classList.add("shake");
    return;
  }

  const x = pad + Math.random() * maxX;
  const y = pad + Math.random() * maxY;

  noBtn.style.left = `${x + btnRect.width / 2}px`;
  noBtn.style.top = `${y + btnRect.height / 2}px`;

  noZone.classList.remove("pulseAngry");
  void noZone.offsetWidth;
  noZone.classList.add("pulseAngry");

  noBtn.classList.remove("shake");
  void noBtn.offsetWidth;
  noBtn.classList.add("shake");

  noTaunt.textContent = taunts[Math.floor(Math.random() * taunts.length)];
}

/* --- Random angry cat images (from your /public folder) --- */
const angryCatPaths = [
  "public/angry_cat_1.webp",
  "public/angry_cat_2.jpg",
  "public/angry_cat_3.png"
];

function pickRandomAngryCat() {
  return angryCatPaths[Math.floor(Math.random() * angryCatPaths.length)];
}

function openCatModal() {
  const modal = $("#catModal");
  const img = $("#angryCatImg");
  img.src = pickRandomAngryCat();

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeCatModal() {
  const modal = $("#catModal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");

  consecutiveNo = 0;
  updateNoMeter();
  noTaunt.textContent = "Okay… back to choices 😇";
}

noBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  consecutiveNo++;
  updateNoMeter();
  moveNoButton();

  if (consecutiveNo >= 3) openCatModal();
});

function resetNoStreak(){
  consecutiveNo = 0;
  updateNoMeter();
}

$("#catClose")?.addEventListener("click", closeCatModal);
$("#catOk")?.addEventListener("click", closeCatModal);

$("#catModal")?.addEventListener("click", (e) => {
  if (e.target.id === "catModal") closeCatModal();
});

if (noMeter) updateNoMeter();

/* ========= YES flow + happy animations ========= */
const yesBtn = $("#yesBtn");
const confettiCanvas = $("#confetti");

yesBtn?.addEventListener("click", () => {
  resetNoStreak();
  burstHearts(18);
  startConfetti(1800);
  showScreen("#screen-success");
  enableSuccessParallax(true);
  enableDragCards(true);
});

/* ========= Restart / Exit ========= */
$("#restartBtn")?.addEventListener("click", () => {
  stopConfetti();
  enableSuccessParallax(false);
  enableDragCards(false);

  // Reset intro typing (FIX: allow typing to run again)
  typingStarted = false;               // ✅ FIX
  typeIdx = 0;
  typingDone = false;
  typeTextEl.textContent = "";
  introContinue.disabled = true;

  // Reset No state
  noTaunt.textContent = "";
  consecutiveNo = 0;
  updateNoMeter();

  showScreen("#screen-intro");
  startIntroTypingIfNeeded(); // re-run typing safely
});

$("#exitBtn")?.addEventListener("click", () => {
  stopConfetti();
  const note = $("#exitNote");
  note.textContent = "You can close this tab now 💗 (or press Try me again if you want another round)";
  burstHearts(10);
});

/* ========= Floating Hearts Burst ========= */
function burstHearts(count = 18) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "floatHeart";
    heart.textContent = Math.random() < 0.25 ? "💖" : (Math.random() < 0.5 ? "💗" : "💘");

    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 20;

    const drift = (Math.random() * 120 - 60);
    const dur = 1400 + Math.random() * 1000;
    const size = 18 + Math.random() * 18;

    heart.style.left = `${startX}px`;
    heart.style.top = `${startY}px`;
    heart.style.fontSize = `${size}px`;
    heart.style.opacity = "0.95";
    heart.style.position = "fixed";
    heart.style.zIndex = "5";
    heart.style.pointerEvents = "none";
    heart.style.transform = "translate(-50%, 0)";
    heart.style.filter = "drop-shadow(0 10px 16px rgba(35,9,20,.22))";
    document.body.appendChild(heart);

    const anim = heart.animate([
      { transform: "translate(-50%, 0) scale(1)", opacity: 0.0 },
      { transform: "translate(-50%, -60px) scale(1)", opacity: 0.95, offset: 0.15 },
      { transform: `translate(calc(-50% + ${drift}px), -${window.innerHeight * 0.75}px) scale(1.12)`, opacity: 0.0 }
    ], { duration: dur, easing: "cubic-bezier(.2,.8,.2,1)" });

    anim.onfinish = () => heart.remove();
  }
}

/* ========= Confetti (simple canvas particles) ========= */
const ctx = confettiCanvas?.getContext("2d");
let particles = [];
let rafId = null;

function resizeCanvas() {
  if (!confettiCanvas || !ctx) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  confettiCanvas.height = Math.floor(window.innerHeight * dpr);
  confettiCanvas.style.width = `${window.innerWidth}px`;
  confettiCanvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function makeParticles(n=160) {
  const colors = ["#ff2f7d", "#ff6aa6", "#ffd1e3", "#ffffff", "#ffb2c8", "#ffe6f0"];
  particles = new Array(n).fill(0).map(() => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight,
    r: 3 + Math.random() * 4,
    vx: -1.5 + Math.random() * 3,
    vy: 2.2 + Math.random() * 4.4,
    rot: Math.random() * Math.PI,
    vr: -0.15 + Math.random() * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: Math.random() < 0.25 ? "heart" : "rect"
  }));
}

function drawHeart(x, y, s) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.bezierCurveTo(-2, -2, -6, 0, 0, 6);
  ctx.bezierCurveTo(6, 0, 2, -2, 0, 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function tick() {
  if (!ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    if (p.y > window.innerHeight + 30) {
      p.y = -20;
      p.x = Math.random() * window.innerWidth;
    }
    if (p.x < -30) p.x = window.innerWidth + 30;
    if (p.x > window.innerWidth + 30) p.x = -30;

    ctx.save();
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    if (p.shape === "rect") {
      ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.4);
      ctx.restore();
    } else {
      ctx.restore();
      ctx.fillStyle = p.color;
      drawHeart(p.x, p.y, p.r / 2.5);
    }
  }

  rafId = requestAnimationFrame(tick);
}

function startConfetti(ms=1400) {
  if (!confettiCanvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  confettiCanvas.classList.add("on");
  makeParticles(200);
  if (!rafId) tick();

  setTimeout(() => stopConfetti(), ms);
}

function stopConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.classList.remove("on");
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  particles = [];
}

/* ========= Success Page Parallax Tilt ========= */
let parallaxOn = false;
let moveHandler = null;

function enableSuccessParallax(enable){
  const card = document.querySelector(".successCard");
  if (!card) return;

  if (!enable){
    parallaxOn = false;
    if (moveHandler) window.removeEventListener("pointermove", moveHandler);
    card.style.transform = "";
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (parallaxOn) return;

  parallaxOn = true;

  moveHandler = (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    const rx = (-y * 4).toFixed(2);
    const ry = (x * 5).toFixed(2);

    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  window.addEventListener("pointermove", moveHandler, { passive:true });
}

/* ========= DRAGGABLE CARDS (YES PAGE) ========= */
let dragEnabled = false;
let dragCleanupFns = [];
let topZ = 10;

function enableDragCards(enable){
  const board = document.querySelector("#floatingBoard");
  const cards = document.querySelectorAll(".floatCard");
  if (!board || cards.length === 0) return;

  dragCleanupFns.forEach(fn => fn());
  dragCleanupFns = [];

  if (!enable){
    dragEnabled = false;
    return;
  }

  dragEnabled = true;
  board.style.touchAction = "none";
  board.style.position = "relative";

  cards.forEach(card => {
    card.style.cursor = "grab";
    card.style.userSelect = "none";
    normalizeCardPositionToPixels(card, board);

    const onDown = (e) => {
      if (!dragEnabled) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      card.setPointerCapture?.(e.pointerId);
      card.style.cursor = "grabbing";
      card.style.zIndex = String(++topZ);
      card.style.animation = "none";

      const boardRect = board.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      const offsetX = e.clientX - cardRect.left;
      const offsetY = e.clientY - cardRect.top;

      const onMove = (ev) => {
        const x = ev.clientX - boardRect.left - offsetX;
        const y = ev.clientY - boardRect.top - offsetY;

        const maxX = boardRect.width - cardRect.width;
        const maxY = boardRect.height - cardRect.height;

        card.style.left = `${clamp(x, 0, maxX)}px`;
        card.style.top = `${clamp(y, 0, maxY)}px`;
        card.style.transform = "translateZ(0)";
      };

      const onUp = () => {
        card.style.cursor = "grab";

        card.animate(
          [{ transform: "scale(1.02)" }, { transform: "scale(1)" }],
          { duration: 160, easing: "ease-out" }
        );

        const cls = card.classList.contains("c1") ? "cardFloat1"
                  : card.classList.contains("c2") ? "cardFloat2"
                  : "cardFloat3";
        card.style.animation = `${cls} 3.6s ease-in-out infinite alternate`;

        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true, once: true });
      window.addEventListener("pointercancel", onUp, { passive: true, once: true });

      e.preventDefault();
    };

    card.addEventListener("pointerdown", onDown);
    dragCleanupFns.push(() => card.removeEventListener("pointerdown", onDown));
  });
}

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function normalizeCardPositionToPixels(card, board){
  const boardRect = board.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  if ((card.style.left || "").includes("px") && (card.style.top || "").includes("px")) return;

  const leftPx = cardRect.left - boardRect.left;
  const topPx = cardRect.top - boardRect.top;

  card.style.left = `${leftPx}px`;
  card.style.top = `${topPx}px`;
}

window.addEventListener("resize", () => {
  const board = document.querySelector("#floatingBoard");
  if (!board) return;

  document.querySelectorAll(".floatCard").forEach(card => {
    if (!dragEnabled) return;

    const boardRect = board.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const left = parseFloat(card.style.left || "0");
    const top = parseFloat(card.style.top || "0");

    const maxX = boardRect.width - cardRect.width;
    const maxY = boardRect.height - cardRect.height;

    card.style.left = `${clamp(left, 0, maxX)}px`;
    card.style.top = `${clamp(top, 0, maxY)}px`;
  });

});
