
/* ==========================================
   1. ELEMENTS & SETTINGS
========================================== */

const pages = [...document.querySelectorAll(".page")];

const backgroundSong = document.getElementById("backgroundSong");
const specialSong = document.getElementById("song");
const musicToggle = document.getElementById("musicToggle");

const hugBtn = document.getElementById("hugBtn");
const hugMessage = document.getElementById("hugMessage");
const restartBtn = document.getElementById("restartBtn");

const heartLayer = document.querySelector(".floating-hearts");

const SPECIAL_PAGE = "page4";

// Background music চালু রাখার পছন্দ
let backgroundEnabled = true;

// বর্তমান page
let currentPage = "page1";


/* ==========================================
   2. PAGE NAVIGATION
========================================== */

function showPage(pageId) {
  const targetPage = document.getElementById(pageId);

  // Page না পেলে কিছু করব না
  if (!targetPage || !targetPage.classList.contains("page")) {
    return;
  }

  // আগের page-এর special song বন্ধ করব
  if (currentPage === SPECIAL_PAGE && pageId !== SPECIAL_PAGE) {
    specialSong.pause();

    // Page ছাড়ার সময় special song আবার শুরু থেকে বাজবে
    specialSong.currentTime = 0;
  }

  currentPage = pageId;

  // নতুন page দেখানো
  pages.forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  // নতুন page অনুযায়ী music control
  updateMusicForPage();

  // Page-এর শুরুতে নিয়ে যাওয়া
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* ==========================================
   3. MUSIC CONTROL
========================================== */

function updateMusicButton() {
  if (currentPage === SPECIAL_PAGE) {
    musicToggle.textContent = "♫ এই পেজে আলাদা গান";
    musicToggle.setAttribute("aria-pressed", "false");
    return;
  }

  if (!backgroundEnabled) {
    musicToggle.textContent = "♫ গান চালাও";
    musicToggle.setAttribute("aria-pressed", "false");
    return;
  }

  if (backgroundSong.paused) {
    musicToggle.textContent = "♫ গান চালাও";
    musicToggle.setAttribute("aria-pressed", "false");
  } else {
    musicToggle.textContent = "♫ গান থামাও";
    musicToggle.setAttribute("aria-pressed", "true");
  }
}


async function playBackgroundMusic() {
  // Special page-এ background music চলবে না
  if (currentPage === SPECIAL_PAGE) {
    return;
  }

  if (!backgroundEnabled) {
    updateMusicButton();
    return;
  }

  try {
    await backgroundSong.play();
  } catch (error) {
    // Browser autoplay আটকালে button দিয়ে চালানো যাবে
    console.info(
      "Background music চালাতে user interaction প্রয়োজন হতে পারে।"
    );
  }

  updateMusicButton();
}


function updateMusicForPage() {
  if (currentPage === SPECIAL_PAGE) {
    // Page 4-এ background music বন্ধ
    backgroundSong.pause();
    updateMusicButton();
    return;
  }

  // অন্য পেজে special song চলবে না
  specialSong.pause();

  // Background music চালু করার চেষ্টা
  playBackgroundMusic();

  updateMusicButton();
}


/* ==========================================
   4. BACKGROUND MUSIC BUTTON
========================================== */

musicToggle.addEventListener("click", async () => {
  // Page 4-এর গান শুধু তার নিজের Play button দিয়ে চালু হবে
  if (currentPage === SPECIAL_PAGE) {
    return;
  }

  if (backgroundSong.paused) {
    backgroundEnabled = true;
    await playBackgroundMusic();
  } else {
    backgroundEnabled = false;
    backgroundSong.pause();
    updateMusicButton();
  }
});


/* ==========================================
   5. SPECIAL SONG — PAGE 4
========================================== */

// Special song নিজে থেকে চালু হবে না
specialSong.autoplay = false;

// Special song চালু হলে background music থামবে
specialSong.addEventListener("play", () => {
  backgroundSong.pause();
  updateMusicButton();
});

// Page 4-এ special song pause হলে background music
// আবার শুরু হবে না। Page বদলানোর পরেই resume হবে।
specialSong.addEventListener("pause", () => {
  updateMusicButton();
});

// Background music-এর অবস্থা পরিবর্তন হলে button update
backgroundSong.addEventListener("play", updateMusicButton);
backgroundSong.addEventListener("pause", updateMusicButton);
backgroundSong.addEventListener("ended", updateMusicButton);


/* ==========================================
   6. NEXT & PREVIOUS BUTTONS
========================================== */

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    showPage(button.dataset.next);
  });
});


document.querySelectorAll("[data-prev]").forEach((button) => {
  button.addEventListener("click", () => {
    showPage(button.dataset.prev);
  });
});


/* ==========================================
   7. BRAND — GO TO HOME
========================================== */

document.querySelectorAll("[data-home]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage("page1");
  });
});


/* ==========================================
   8. AUTOPLAY ON WEBSITE OPEN
========================================== */

window.addEventListener("load", () => {
  // Browser অনুমতি দিলে background music শুরু হবে।
  // অনুমতি না দিলে button দিয়ে চালানো যাবে।
  playBackgroundMusic();

  updateMusicButton();
});


/* ==========================================
   9. VIRTUAL HUG BUTTON
========================================== */

if (hugBtn && hugMessage) {
  hugBtn.addEventListener("click", () => {
    hugMessage.textContent =
      "মণি, তোর জন্য একটা বড়্ট্ট ভার্চুয়াল আলিঙ্গন রইল! 🫂💗";

    // একসঙ্গে কয়েকটা heart animation
    for (let i = 0; i < 12; i++) {
      createHeart(true);
    }

    hugBtn.textContent = "আরও একটা আলিঙ্গন? 💗";
  });
}


/* ==========================================
   10. RESTART WEBSITE
========================================== */

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    showPage("page1");

    // Hug message আবার খালি করা
    if (hugMessage) {
      hugMessage.textContent = "";
    }

    if (hugBtn) {
      hugBtn.textContent = "একটা ভার্চুয়াল আলিঙ্গন? 🫂";
    }
  });
}


/* ==========================================
   11. FLOATING HEARTS ANIMATION
========================================== */

function createHeart(burst = false) {
  if (!heartLayer) return;

  const heart = document.createElement("span");

  heart.className = "floating-heart";

  // Random heart symbol
  heart.textContent = Math.random() > 0.5 ? "♥" : "♡";

  // Position
  heart.style.left =
    (burst ? 25 + Math.random() * 50 : Math.random() * 100) + "%";

  // Random size
  heart.style.fontSize =
    12 + Math.random() * 20 + "px";

  // Animation duration
  heart.style.animationDuration =
    (burst ? 2.5 : 7 + Math.random() * 8) + "s";

  if (burst) {
    heart.style.bottom = "25%";
  }

  heartLayer.appendChild(heart);

  // Animation শেষে element মুছে ফেলা
  setTimeout(() => {
    heart.remove();
  }, burst ? 3000 : 16000);
}


// Regular floating hearts
setInterval(() => {
  createHeart();
}, 1200);


/* ==========================================
   12. INITIAL STATE
========================================== */

showPage("page1");
const bgMusic = document.getElementById("backgroundSong");

bgMusic.volume = 0.7;

window.addEventListener("load", () => {
  bgMusic.play().catch((error) => {
    console.log("Browser autoplay block koreche:", error);
  });
});