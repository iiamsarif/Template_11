(function () {
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  const navLinks = [...document.querySelectorAll(".site-nav__link")];
  const progressBar = document.getElementById("progressBar");
  const backToTop = document.getElementById("backToTop");
  const loader = document.getElementById("loader");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) document.body.classList.add("reduced-motion");

  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 650);
  });

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  const updateScrollUi = () => {
    const top = window.scrollY;
    header.classList.toggle("is-scrolled", top > 40);

    const winHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = winHeight > 0 ? (top / winHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;

    backToTop.classList.toggle("visible", top > 420);
  };

  window.addEventListener("scroll", updateScrollUi);
  updateScrollUi();

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const sections = [...document.querySelectorAll("main section[id]")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((lnk) => {
          const active = lnk.getAttribute("href") === `#${id}`;
          lnk.classList.toggle("active", active);
        });
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((sec) => observer.observe(sec));

  const counterEls = [...document.querySelectorAll("[data-counter]")];
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.counted) return;
        entry.target.dataset.counted = "1";
        animateCounter(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counterEls.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = Number(el.dataset.counter || 0);
    const duration = reducedMotion ? 100 : 1400;
    const start = performance.now();

    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased).toString();
      if (p < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const parallaxEls = [...document.querySelectorAll("[data-parallax]")];
  document.addEventListener("mousemove", (e) => {
    if (reducedMotion || window.innerWidth < 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    parallaxEls.forEach((el) => {
      const depth = Number(el.dataset.parallax || 0.1);
      el.style.transform = `translate3d(${x * depth * 18}px, ${y * depth * 18}px, 0)`;
    });
  });

  const tiltEls = [...document.querySelectorAll(".tilt-card")];
  tiltEls.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (reducedMotion || window.innerWidth < 768) return;
      const box = card.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width;
      const y = (e.clientY - box.top) / box.height;
      const rx = (0.5 - y) * 12;
      const ry = (x - 0.5) * 12;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
    });
  });

  const servicesTrack = document.getElementById("servicesTrack");
  let pointerDown = false;
  let startX = 0;
  let left = 0;

  servicesTrack.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        servicesTrack.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );

  servicesTrack.addEventListener("pointerdown", (e) => {
    pointerDown = true;
    startX = e.clientX;
    left = servicesTrack.scrollLeft;
    servicesTrack.setPointerCapture(e.pointerId);
  });

  servicesTrack.addEventListener("pointermove", (e) => {
    if (!pointerDown) return;
    const dx = e.clientX - startX;
    servicesTrack.scrollLeft = left - dx;
  });

  servicesTrack.addEventListener("pointerup", () => {
    pointerDown = false;
  });

  const filterBtns = [...document.querySelectorAll(".filter-btn")];
  const projectCards = [...document.querySelectorAll(".project-card")];

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.style.display = show ? "block" : "none";
      });
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCategory = document.getElementById("lightboxCategory");

  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const title = card.querySelector("h3")?.textContent || "Project";
      const category = card.querySelector("p")?.textContent || "Category";

      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxTitle.textContent = title;
      lightboxCategory.textContent = category;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  const slides = [
    {
      avatar: "https://i.pravatar.cc/150?img=12",
      quote:
        "Obsidian Nova translated a complex product into a launch narrative that audiences immediately understood.",
      author: "Maya Chen, VP Product at Helix Systems"
    },
    {
      avatar: "https://i.pravatar.cc/150?img=33",
      quote:
        "The team moved with urgency and precision. Every animation supported the message instead of distracting from it.",
      author: "Jordan Blake, Head of Marketing at ArcLight"
    },
    {
      avatar: "https://i.pravatar.cc/150?img=47",
      quote:
        "From first concept to launch day, the process was clear, collaborative, and deeply strategic.",
      author: "Sofia Reyes, Creative Director at Lumen Ventures"
    }
  ];

  let idx = 0;
  const avatarEl = document.getElementById("testimonialAvatar");
  const quoteEl = document.getElementById("testimonialQuote");
  const authorEl = document.getElementById("testimonialAuthor");

  setInterval(() => {
    idx = (idx + 1) % slides.length;
    const s = slides[idx];

    if (window.gsap && !reducedMotion) {
      gsap.to("#testimonial", {
        opacity: 0.3,
        y: 10,
        duration: 0.25,
        onComplete: () => {
          avatarEl.src = s.avatar;
          quoteEl.textContent = `“${s.quote}”`;
          authorEl.textContent = s.author;
          gsap.to("#testimonial", { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
        }
      });
    } else {
      avatarEl.src = s.avatar;
      quoteEl.textContent = `“${s.quote}”`;
      authorEl.textContent = s.author;
    }
  }, 4200);

  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const particleCount = reducedMotion ? 30 : 65;
  let particles = [];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function initParticles() {
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,229,255,0.8)";
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          ctx.strokeStyle = `rgba(162,0,255,${(1 - d / 120) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    if (!reducedMotion) requestAnimationFrame(drawParticles);
  }

  if (canvas && ctx) {
    resizeCanvas();
    initParticles();
    drawParticles();
    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
      if (reducedMotion) drawParticles();
    });
  }
})();