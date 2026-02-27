(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  gsap.from(".hero__title", { y: 45, opacity: 0, duration: 1, ease: "power3.out" });
  gsap.from(".hero__subtitle", { y: 35, opacity: 0, duration: 1, delay: 0.15, ease: "power3.out" });
  gsap.from(".hero__actions .btn", {
    y: 30,
    duration: 0.75,
    stagger: 0.1,
    delay: 0.25,
    clearProps: "opacity,visibility",
    ease: "power2.out"
  });

  gsap.to(".hero-geo__shape", {
    rotate: 360,
    repeat: -1,
    duration: 18,
    ease: "none"
  });

  gsap.to(".hero-geo__shape", {
    y: 18,
    repeat: -1,
    yoyo: true,
    duration: 2.6,
    ease: "sine.inOut"
  });

  const revealItems = gsap.utils.toArray(
    ".about__media, .about__content, .feature-card, .service-card, .project-card, .fact-card, .contact__info, .contact-form, .flow-copy, .flow-media"
  );

  revealItems.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 48,
      scale: 0.94,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 82%"
      }
    });
  });

  gsap.to(".services__track", {
    xPercent: -10,
    ease: "none",
    scrollTrigger: {
      trigger: ".services",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".project-card img", {
    yPercent: -8,
    filter: "contrast(1.08) saturate(1.15)",
    stagger: 0.03,
    scrollTrigger: {
      trigger: ".portfolio",
      start: "top 78%",
      end: "bottom 20%",
      scrub: true
    }
  });

  const flowSections = gsap.utils.toArray(".flow-section");
  const largeScreen = window.innerWidth >= 1024;
  const mediumScreen = window.innerWidth >= 768 && window.innerWidth < 1024;
  const bgTravel = largeScreen ? 360 : mediumScreen ? 300 : 240;
  const fgTravel = largeScreen ? 300 : mediumScreen ? 250 : 210;

  flowSections.forEach((section) => {
    const bg = section.querySelector(".flow-layer--bg");
    const fg = section.querySelector(".flow-layer--fg");
    if (!bg || !fg) return;

    gsap.fromTo(
      bg,
      { y: bgTravel, rotateZ: -6, scale: 1.2 },
      {
        y: -bgTravel,
        rotateZ: 6,
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 95%",
          end: "bottom 5%",
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      }
    );

    gsap.fromTo(
      fg,
      { y: -fgTravel, rotateZ: 8, x: 30, scale: 1.03 },
      {
        y: fgTravel,
        rotateZ: -8,
        x: -30,
        scale: 1.16,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 95%",
          end: "bottom 5%",
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      }
    );

    gsap.to(fg, {
      rotationY: "+=6",
      rotationX: "-=4",
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "50% 50%"
    });
  });

  gsap.to(".fact-card", {
    boxShadow: "0 0 18px rgba(0,229,255,0.35)",
    repeat: -1,
    yoyo: true,
    duration: 1.8,
    stagger: 0.2
  });

  gsap.from(".site-footer__grid > div", {
    y: 30,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".site-footer",
      start: "top 88%"
    }
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
  window.addEventListener("resize", () => ScrollTrigger.refresh());
})();
