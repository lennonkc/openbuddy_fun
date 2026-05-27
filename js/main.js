/* ==========================================================
   openbuddy.fun — Horizontal Scroll + GSAP Animations
   Works on both desktop and mobile (vertical swipe → horizontal move)
   ========================================================== */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Text Splitting Utilities ---------- */

function splitIntoWords(el) {
  const nodes = [];
  el.childNodes.forEach(function (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(function (w) {
        if (/^\s+$/.test(w)) {
          frag.appendChild(document.createTextNode(w));
          return;
        }
        if (w === "") return;
        const span = document.createElement("span");
        span.className = "word";
        span.style.display = "inline-block";
        span.textContent = w;
        frag.appendChild(span);
      });
      nodes.push({ original: node, replacement: frag });
    }
  });
  nodes.forEach(function (n) {
    n.original.parentNode.replaceChild(n.replacement, n.original);
  });
  return el.querySelectorAll(".word");
}

/* ---------- Responsive helper ---------- */

const isNarrow = window.innerWidth <= 900;

/* ---------- Core: Horizontal Scroll (always active) ---------- */

let scrollTween;
const progressFill = document.querySelector(".progress__fill");

function initHorizontalScroll() {
  const track = document.querySelector(".h-track");

  const getScrollAmount = function () {
    return track.scrollWidth - window.innerWidth;
  };

  scrollTween = gsap.to(track, {
    x: function () {
      return -getScrollAmount();
    },
    ease: "none",
    scrollTrigger: {
      trigger: ".h-wrapper",
      pin: true,
      scrub: isNarrow ? 0.6 : 1,
      end: function () {
        return "+=" + getScrollAmount();
      },
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        if (progressFill) progressFill.style.width = (self.progress * 100).toFixed(1) + "%";
      },
    },
  });
}

/* ---------- Helper: Create containerAnimation trigger ---------- */

function animateIn(selector, fromVars, triggerEl) {
  if (!scrollTween) return;

  const config = {
    trigger: triggerEl || selector,
    start: "left 85%",
    toggleActions: "play none none reset",
    containerAnimation: scrollTween,
  };

  gsap.from(selector, Object.assign({}, fromVars, { scrollTrigger: config }));
}

/* ---------- Helper: Parallax within horizontal scroll ---------- */

function addParallax(el, yOffset) {
  if (!scrollTween) return;

  gsap.to(el, {
    y: yOffset,
    ease: "none",
    scrollTrigger: {
      containerAnimation: scrollTween,
      trigger: el,
      start: "left right",
      end: "right left",
      scrub: 1,
    },
  });
}

/* ---------- Panel 1: Hero ---------- */

function initHero() {
  const title = document.querySelector(".hero__title");
  const tagline = document.querySelector(".hero__tagline");

  let mainText = null;
  title.childNodes.forEach(function (node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      mainText = node;
    }
  });
  if (mainText) {
    const frag = document.createDocumentFragment();
    const text = mainText.textContent;
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement("span");
      span.className = "char";
      span.style.display = "inline-block";
      span.textContent = text[i];
      frag.appendChild(span);
    }
    mainText.parentNode.replaceChild(frag, mainText);
  }

  const chars = title.querySelectorAll(".char");
  const dot = title.querySelector(".hero__dot");
  const words = splitIntoWords(tagline);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(chars, {
    y: 40,
    opacity: 0,
    rotateX: -40,
    duration: 0.8,
    stagger: 0.04,
  });

  if (dot) {
    tl.from(
      dot,
      {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.3"
    );
  }

  tl.from(
    words,
    {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
    },
    "-=0.3"
  );

  tl.from(
    ".hero__desc",
    {
      y: 20,
      opacity: 0,
      duration: 0.6,
    },
    "-=0.2"
  );

  tl.from(
    ".hero__device",
    {
      y: 60,
      opacity: 0,
      scale: 0.85,
      rotation: 5,
      duration: 1.2,
      ease: "back.out(1.4)",
    },
    "-=0.5"
  );

  tl.from(
    ".hero__scroll-hint",
    {
      opacity: 0,
      x: -10,
      duration: 0.5,
    },
    "-=0.3"
  );

  gsap.to(".hero__device", {
    y: -12,
    duration: 2.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 2,
  });
}

/* ---------- Panel 2: Problem ---------- */

function initProblem() {
  const heading = document.querySelector(".panel--problem .panel__heading");
  if (heading) splitIntoWords(heading);

  animateIn(".panel--problem .panel__label", {
    opacity: 0,
    y: 15,
    duration: 0.5,
  });

  const words = document.querySelectorAll(".panel--problem .panel__heading .word");
  if (words.length) {
    animateIn(words, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
    });
  }

  animateIn(
    ".panel--problem .panel__sub",
    {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.3,
    },
    ".panel--problem .panel__heading"
  );

  const items = document.querySelectorAll(".problem__item");
  if (items.length) {
    animateIn(
      items,
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
      },
      ".problem__items"
    );
  }

  document.querySelectorAll(".problem__strike").forEach(function (strike, i) {
    if (!scrollTween) return;
    gsap.to(strike, {
      width: "80%",
      duration: 0.5,
      ease: "power2.inOut",
      delay: 0.6 + i * 0.2,
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: strike.closest(".problem__item"),
        start: "left 70%",
        toggleActions: "play none none reset",
      },
    });
  });
}

/* ---------- Panel 3: Solution ---------- */

function initSolution() {
  const heading = document.querySelector(".panel--solution .panel__heading");
  if (heading) splitIntoWords(heading);

  animateIn(".panel--solution .panel__label", {
    opacity: 0,
    y: 15,
    duration: 0.5,
  });

  const words = document.querySelectorAll(
    ".panel--solution .panel__heading .word"
  );
  if (words.length) {
    animateIn(words, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
    });
  }

  const cards = document.querySelectorAll(".solution__card");
  if (cards.length) {
    animateIn(
      cards,
      {
        y: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        stagger: 0.15,
        ease: "back.out(1.4)",
      },
      ".solution__cards"
    );
  }
}

/* ---------- Panel 4: Showcase ---------- */

function initShowcase() {
  const heading = document.querySelector(".panel--showcase .panel__heading");
  if (heading) splitIntoWords(heading);

  animateIn(".panel--showcase .panel__label", {
    opacity: 0,
    y: 15,
    duration: 0.5,
  });

  const words = document.querySelectorAll(
    ".panel--showcase .panel__heading .word"
  );
  if (words.length) {
    animateIn(words, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
    });
  }

  animateIn(
    ".panel--showcase .panel__sub",
    {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.2,
    },
    ".panel--showcase .panel__heading"
  );

  document.querySelectorAll(".showcase__item").forEach(function (item) {
    const offset = parseFloat(item.dataset.parallax) || 0;

    animateIn(
      item,
      {
        y: 60 + Math.abs(offset),
        opacity: 0,
        rotation: offset > 0 ? -3 : 3,
        duration: 0.8,
        ease: "back.out(1.2)",
      },
      item
    );

    addParallax(item, offset);
  });
}

/* ---------- Panel 5: Screenshots ---------- */

function initScreens() {
  const heading = document.querySelector(".panel--screens .panel__heading");
  if (heading) splitIntoWords(heading);

  animateIn(".panel--screens .panel__label", {
    opacity: 0,
    y: 15,
    duration: 0.5,
  });

  const words = document.querySelectorAll(
    ".panel--screens .panel__heading .word"
  );
  if (words.length) {
    animateIn(words, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
    });
  }

  document.querySelectorAll(".screens__item").forEach(function (item) {
    const offset = parseFloat(item.dataset.parallax) || 0;

    animateIn(
      item,
      {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        ease: "power3.out",
      },
      item
    );

    addParallax(item, offset);
  });
}

/* ---------- Panel 6: Video ---------- */

const VIDEO_ID = "VIDEO_ID_HERE";

function initVideo() {
  const heading = document.querySelector(".panel--video .panel__heading");
  if (heading) splitIntoWords(heading);

  animateIn(".panel--video .panel__label", {
    opacity: 0,
    y: 15,
    duration: 0.5,
  });

  const words = document.querySelectorAll(".panel--video .panel__heading .word");
  if (words.length) {
    animateIn(words, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
    });
  }

  animateIn(
    ".panel--video .panel__sub",
    {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.2,
    },
    ".panel--video .panel__heading"
  );

  animateIn(
    ".video__wrapper",
    {
      y: 50,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: "power3.out",
    },
    ".video__wrapper"
  );

  gsap.to(".video__play", {
    scale: 1.08,
    duration: 1,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  const playBtn = document.getElementById("videoPlay");
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      if (VIDEO_ID === "VIDEO_ID_HERE") return;

      const wrapper = playBtn.closest(".video__wrapper");
      const iframe = document.createElement("iframe");
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

/* ---------- Panel 7: CTA ---------- */

function initCTA() {
  const heading = document.querySelector(".panel--cta .panel__heading");
  if (heading) splitIntoWords(heading);

  const words = document.querySelectorAll(".panel--cta .panel__heading .word");
  if (words.length) {
    animateIn(words, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.04,
    });
  }

  const links = document.querySelectorAll(".cta__link");
  if (links.length) {
    animateIn(
      links,
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "elastic.out(1, 0.6)",
      },
      ".cta__links"
    );
  }

  animateIn(
    ".footer",
    {
      opacity: 0,
      y: 10,
      duration: 0.5,
      delay: 0.5,
    },
    ".cta__links"
  );
}

/* ---------- Decorations Parallax ---------- */

function initDecorations() {
  document.querySelectorAll(".deco").forEach(function (el) {
    if (!scrollTween) return;

    gsap.to(el, {
      x: function () {
        return gsap.utils.random(-40, 40);
      },
      y: function () {
        return gsap.utils.random(-30, 30);
      },
      ease: "none",
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: el.closest(".panel"),
        start: "left right",
        end: "right left",
        scrub: 1,
      },
    });
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", function () {
  initHorizontalScroll();
  initHero();
  initProblem();
  initSolution();
  initShowcase();
  initScreens();
  initVideo();
  initCTA();
  initDecorations();
});
