/* ==========================================================
   openbuddy.fun — GSAP Scroll Animations
   ========================================================== */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Hero ---------- */
function initHero() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".hero__logo", {
    y: 30,
    opacity: 0,
    duration: 1,
  })
    .from(".hero__tagline", {
      y: 20,
      opacity: 0,
      duration: 0.8,
    }, "-=0.5")
    .from(".hero__device", {
      y: 60,
      opacity: 0,
      scale: 0.9,
      duration: 1.2,
      ease: "back.out(1.4)",
    }, "-=0.4")
    .from(".hero__cta", {
      y: 20,
      opacity: 0,
      duration: 0.8,
    }, "-=0.3");
}

/* ---------- Problem ---------- */
function initProblem() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".problem",
      start: "top 75%",
    },
  });

  tl.from(".problem .section__title", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  })
    .from(".problem .section__subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }, "+=0.2")
    .from(".problem__item", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out",
    });

  // Strikethrough animations
  const items = document.querySelectorAll(".problem__item .strike");
  items.forEach(function (strike, i) {
    gsap.to(strike, {
      width: "100%",
      duration: 0.5,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".problem",
        start: "top 75%",
      },
      delay: 0.8 + i * 0.2,
    });
  });
}

/* ---------- Solution ---------- */
function initSolution() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".solution",
      start: "top 75%",
    },
  });

  tl.from(".solution .section__title", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  })
    .from(".solution .section__subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }, "+=0.2");

  gsap.from(".solution__card", {
    y: 50,
    opacity: 0,
    scale: 0.9,
    duration: 0.8,
    stagger: 0.15,
    ease: "back.out(1.4)",
    scrollTrigger: {
      trigger: ".solution__cards",
      start: "top 80%",
    },
  });
}

/* ---------- Showcase ---------- */
function initShowcase() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".showcase",
      start: "top 75%",
    },
  });

  tl.from(".showcase .section__title", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  });

  gsap.from(".showcase__device", {
    y: 60,
    opacity: 0,
    rotation: -5,
    duration: 0.8,
    stagger: 0.12,
    ease: "back.out(1.2)",
    scrollTrigger: {
      trigger: ".showcase__gallery",
      start: "top 80%",
    },
  });

  gsap.from(".showcase__dot", {
    scale: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(2)",
    scrollTrigger: {
      trigger: ".showcase__dots",
      start: "top 85%",
    },
  });
}

/* ---------- Video ---------- */
function initVideo() {
  var VIDEO_ID = "VIDEO_ID_HERE";

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".video",
      start: "top 75%",
    },
  });

  tl.from(".video .section__title", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  })
    .from(".video .section__subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }, "+=0.2")
    .from(".video__wrapper", {
      y: 50,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: "power3.out",
    });

  // Pulse animation on play icon
  gsap.to(".video__play-icon", {
    scale: 1.1,
    repeat: -1,
    yoyo: true,
    duration: 0.8,
    ease: "sine.inOut",
  });

  // YouTube lazy load
  var playBtn = document.getElementById("videoPlay");
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      if (VIDEO_ID === "VIDEO_ID_HERE") return;

      var wrapper = playBtn.closest(".video__wrapper");
      var iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube.com/embed/" + VIDEO_ID + "?autoplay=1&rel=0";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:20px;";

      wrapper.innerHTML = "";
      wrapper.appendChild(iframe);
    });
  }
}

/* ---------- CTA ---------- */
function initCTA() {
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".cta",
      start: "top 75%",
    },
  });

  tl.from(".cta .section__title", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  });

  gsap.from(".cta__link", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "elastic.out(1, 0.5)",
    scrollTrigger: {
      trigger: ".cta__links",
      start: "top 80%",
    },
  });
}

/* ---------- Decorations (Parallax) ---------- */
function initDecorations() {
  document.querySelectorAll(".decor").forEach(function (el) {
    var speed = parseFloat(el.dataset.speed) || 0.5;

    gsap.to(el, {
      y: function () {
        return -ScrollTrigger.maxScroll(window) * speed * 0.1;
      },
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  initHero();
  initProblem();
  initSolution();
  initShowcase();
  initVideo();
  initCTA();
  initDecorations();
});
