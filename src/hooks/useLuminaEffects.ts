'use client';

import { RefObject, useEffect } from 'react';

/**
 * useLuminaEffects — every interactive behavior on the page, in one place.
 *
 * Attach to the page root. Behaviors are discovered by class / data attribute,
 * so section components stay purely presentational:
 *
 *   .lum-canvas          gold dust particle canvas + random sparkles
 *   .lum-cursor-dot/ring gilded diamond cursor (fine pointers only)
 *   .lum-preloader       lifted away after the intro, then display:none
 *   .lum-header          gains shadow + compact top row past 70px of scroll
 *   [data-hero-media]    scroll parallax (shift / scale / rotate)
 *   [data-magnetic]      buttons that lean toward the cursor
 *   [data-tilt]          3D tilt cards with a [data-glare] highlight layer
 *   [data-spothost]      cards with a cursor-following [data-spot] spotlight
 *   [data-reveal]        reversible scroll reveals (up/left/right/scale/flip/
 *                        clip/tracking/stagger), optional [data-reveal-delay]
 *   [data-count]         count-up numbers when scrolled into view
 *   (wheel)              buttery lerp-based smooth scrolling
 */

const DUST_DENSITY = 22;
const REVEAL_SPEED = 1;
const CANVAS_FPS = 24; // ambient dust doesn't need 60fps; keeps laptops cool

type Particle = {
  x: number; y: number; r: number; vy: number; vx: number;
  phase: number; speed: number; hue: 'gold' | 'white';
};
type Sparkle = { x: number; y: number; life: number; max: number; size: number };

export function useLuminaEffects(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const cleanup: (() => void)[] = [];
    let raf = 0;

    const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
    const $$ = <T extends HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));

    // ── Broken image fallback ─────────────────────────────────────────
    // Missing /uploads/* files fall back to the gold gradient behind them.
    // Deferred a tick: hiding an <img> writes an inline style, and any image
    // still inside an unhydrated <Suspense> boundary would then mismatch on
    // hydration. By the next macrotask those boundaries have hydrated.
    const sweepImages = setTimeout(() => {
      $$('img').forEach(img => {
        const image = img as HTMLImageElement;
        const hide = () => { image.style.visibility = 'hidden'; };
        if (image.complete && image.naturalWidth === 0) hide();
        image.addEventListener('error', hide);
        cleanup.push(() => image.removeEventListener('error', hide));
      });
    }, 0);
    cleanup.push(() => clearTimeout(sweepImages));

    // ── Preloader lift ────────────────────────────────────────────────
    const pre = $('.lum-preloader');
    if (pre) {
      const t1 = setTimeout(() => {
        pre.style.transform = 'translateY(-101%)';
        const t2 = setTimeout(() => { pre.style.display = 'none'; }, 1500);
        cleanup.push(() => clearTimeout(t2));
      }, reduced ? 400 : 2400);
      cleanup.push(() => clearTimeout(t1));
    }

    // ── Gold dust canvas ──────────────────────────────────────────────
    const canvas = $('canvas.lum-canvas') as HTMLCanvasElement | null;
    const particles: Particle[] = [];
    const sparkles: Sparkle[] = [];
    let ctx: CanvasRenderingContext2D | null = null;
    let dpr = 1;
    let drawDust: ((t: number, boost: number) => void) | null = null;

    if (canvas && !reduced) {
      ctx = canvas.getContext('2d');
      const resize = () => {
        dpr = Math.min(1.5, window.devicePixelRatio || 1);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
      };
      resize();
      window.addEventListener('resize', resize);
      cleanup.push(() => window.removeEventListener('resize', resize));

      const W = () => canvas.width;
      const H = () => canvas.height;

      for (let i = 0; i < DUST_DENSITY; i++) {
        particles.push({
          x: Math.random(), y: Math.random(),
          r: 0.6 + Math.random() * 1.7,
          vy: -(0.008 + Math.random() * 0.03) / 100,
          vx: (Math.random() - 0.5) * 0.00012,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.9,
          hue: Math.random() < 0.75 ? 'gold' : 'white',
        });
      }

      drawDust = (t, scrollBoost) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, W(), H());
        for (const p of particles) {
          p.y += p.vy * (1 + scrollBoost * 6);
          p.x += p.vx + Math.sin(t / 4000 + p.phase) * 0.00005;
          if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
          if (p.x < -0.02) p.x = 1.02;
          if (p.x > 1.02) p.x = -0.02;
          const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((t / 900) * p.speed + p.phase));
          const alpha = tw * (p.hue === 'gold' ? 0.5 : 0.7);
          ctx.beginPath();
          ctx.arc(p.x * W(), p.y * H(), p.r * dpr, 0, Math.PI * 2);
          ctx.fillStyle = p.hue === 'gold'
            ? `rgba(218, 168, 88, ${alpha.toFixed(3)})`
            : `rgba(250, 238, 208, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
        // Random cross-shaped sparkles, more frequent while scrolling fast
        if (Math.random() < 0.035 + scrollBoost * 0.25 && sparkles.length < 14) {
          sparkles.push({
            x: Math.random() * W(), y: Math.random() * H(),
            life: 0, max: 60 + Math.random() * 50,
            size: (5 + Math.random() * 11) * dpr,
          });
        }
        for (let i = sparkles.length - 1; i >= 0; i--) {
          const s = sparkles[i];
          s.life++;
          if (s.life > s.max) { sparkles.splice(i, 1); continue; }
          const k = Math.sin((s.life / s.max) * Math.PI);
          const sz = s.size * k;
          ctx.strokeStyle = `rgba(255, 250, 232, ${(0.85 * k).toFixed(3)})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(s.x - sz, s.y); ctx.lineTo(s.x + sz, s.y);
          ctx.moveTo(s.x, s.y - sz); ctx.lineTo(s.x, s.y + sz);
          ctx.moveTo(s.x - sz * 0.4, s.y - sz * 0.4); ctx.lineTo(s.x + sz * 0.4, s.y + sz * 0.4);
          ctx.moveTo(s.x + sz * 0.4, s.y - sz * 0.4); ctx.lineTo(s.x - sz * 0.4, s.y + sz * 0.4);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(s.x, s.y, Math.max(0.5, sz * 0.1), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 253, 244, ${(0.9 * k).toFixed(3)})`;
          ctx.fill();
        }
      };
    }

    // ── Diamond cursor ────────────────────────────────────────────────
    let mx = -100, my = -100, rx = -100, ry = -100, ringAngle = 45;
    let cursorShown = false;
    const dot = $('.lum-cursor-dot');
    const ring = $('.lum-cursor-ring');

    if (fine && dot && ring && !reduced) {
      // Hide the native cursor with a single class on the (already-hydrated)
      // root, never by writing inline styles onto descendants. Content inside
      // a <Suspense> boundary hydrates AFTER this effect runs, so touching
      // those nodes here makes React find attributes it never rendered — a
      // hydration mismatch. The `.lum-no-cursor *` rule does the same job with
      // zero DOM mutation.
      root.classList.add('lum-no-cursor');
      cleanup.push(() => root.classList.remove('lum-no-cursor'));

      const move = (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY;
        if (!cursorShown) {
          cursorShown = true;
          dot.style.opacity = '1';
          ring.style.opacity = '1';
        }
        const target = e.target as HTMLElement | null;
        const overLink = target?.closest?.('a, button, [data-magnetic], svg, [data-tilt], [data-spothost]');
        if (overLink) {
          ring.style.width = '52px'; ring.style.height = '52px';
          ring.style.margin = '-26px 0 0 -26px';
          ring.style.borderColor = 'rgba(218, 168, 88, 0.95)';
        } else {
          ring.style.width = '34px'; ring.style.height = '34px';
          ring.style.margin = '-17px 0 0 -17px';
          ring.style.borderColor = 'rgba(218, 168, 88, 0.55)';
        }
      };
      window.addEventListener('mousemove', move, { passive: true });
      cleanup.push(() => window.removeEventListener('mousemove', move));
    }

    // ── Magnetic buttons ──────────────────────────────────────────────
    if (fine && !reduced) {
      $$('[data-magnetic]').forEach(el => {
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          el.style.transform = `translate(${(dx * 10).toFixed(1)}px, ${(dy * 8).toFixed(1)}px)`;
        };
        const onLeave = () => {
          el.style.transition =
            'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.8s ease, filter 0.8s ease, background 0.8s ease, color 0.8s ease, border-color 0.8s ease';
          el.style.transform = 'translate(0, 0)';
          setTimeout(() => {
            el.style.transition =
              'box-shadow 0.8s ease, filter 0.8s ease, background 0.8s ease, color 0.8s ease, border-color 0.8s ease';
          }, 900);
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanup.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    // ── 3D tilt + glare (hero visual, collection cards) ───────────────
    if (fine && !reduced) {
      $$('[data-tilt]').forEach(el => {
        const glare = el.querySelector<HTMLElement>('[data-glare]');
        const onEnter = () => {
          el.dataset.rvLock = '1';
          el.style.transition = 'transform 0.18s ease-out, opacity 0.4s ease, filter 0.4s ease';
        };
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform =
            `perspective(1100px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-6px)`;
          if (glare) {
            glare.style.background =
              `radial-gradient(circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, rgba(255, 248, 224, 0.5) 0%, rgba(255, 248, 224, 0) 55%)`;
            glare.style.opacity = '1';
          }
        };
        const onLeave = () => {
          el.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, filter 0.4s ease';
          el.style.transform = 'none';
          if (glare) glare.style.opacity = '0';
          setTimeout(() => {
            delete el.dataset.rvLock;
            if (el.dataset.rvTr) el.style.transition = el.dataset.rvTr;
          }, 950);
        };
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanup.push(() => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });

      // ── Spotlight (product + testimonial cards) ─────────────────────
      $$('[data-spothost]').forEach(card => {
        const spot = card.querySelector<HTMLElement>('[data-spot]');
        if (!spot) return;
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          spot.style.background =
            `radial-gradient(260px circle at ${x.toFixed(0)}px ${y.toFixed(0)}px, rgba(255, 242, 208, 0.55) 0%, rgba(255, 242, 208, 0) 70%)`;
          spot.style.opacity = '1';
        };
        const onLeave = () => { spot.style.opacity = '0'; };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        cleanup.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    // ── Scroll: solid nav + hero parallax ─────────────────────────────
    let lastY = window.scrollY;
    let scrollBoost = 0;
    let navSolid: boolean | null = null;
    let heroScrollTarget = 0;
    let heroScrollProgress = 0;
    const nav = $('.lum-header');
    const heroMedia = $('[data-hero-media]');
    const heroSection = heroMedia?.closest('section') ?? null;

    const applyScroll = () => {
      const y = window.scrollY || 0;
      const solid = y > 70;
      if (nav && solid !== navSolid) {
        navSolid = solid;
        nav.classList.toggle('is-scrolled', solid);
      }
      if (heroMedia && heroSection) {
        const sectionTop = heroSection.offsetTop;
        const sectionHeight = heroSection.offsetHeight || window.innerHeight;
        const start = sectionTop - window.innerHeight * 0.28;
        const end = sectionTop + sectionHeight * 0.72;
        const raw = (y - start) / Math.max(1, end - start);
        heroScrollTarget = Math.max(0, Math.min(1, raw));
        if (Math.abs(heroScrollTarget - heroScrollProgress) < 0.001) return; // settled — skip DOM write
        heroScrollProgress += (heroScrollTarget - heroScrollProgress) * 0.16;
        const eased = heroScrollProgress * heroScrollProgress * (3 - 2 * heroScrollProgress);
        heroMedia.style.transform =
          `translate3d(0px, ${(eased * 24).toFixed(2)}px, 0) scale(${(1 + eased * 0.035).toFixed(3)}) rotate(${(-eased * 1.25).toFixed(2)}deg)`;
      }
    };

    const onScroll = () => {
      const y = window.scrollY || 0;
      scrollBoost = Math.min(1, Math.abs(y - lastY) / 60);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanup.push(() => window.removeEventListener('scroll', onScroll));

    // ── rAF loop: parallax + canvas + cursor (canvas capped at CANVAS_FPS;
    //    native scrolling — no wheel hijack) ────────────────────────────
    const frameInterval = 1000 / CANVAS_FPS;
    let lastFrame = 0;
    const loop = (t: number) => {
      applyScroll();
      if (t - lastFrame >= frameInterval) {
        lastFrame = t;
        drawDust?.(t, scrollBoost);
        scrollBoost *= 0.88;
      }
      if (fine && dot && ring && !reduced) {
        dot.style.transform = `translate(${mx}px, ${my}px) rotate(45deg)`;
        rx += (mx - rx) * 0.13;
        ry += (my - ry) * 0.13;
        ringAngle += 0.35;
        ring.style.transform = `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px) rotate(${ringAngle.toFixed(1)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    cleanup.push(() => cancelAnimationFrame(raf));

    // ── Reversible multi-style reveals ────────────────────────────────
    const speed = Math.max(0.3, Math.min(3, REVEAL_SPEED));
    const dur = (1.45 / speed).toFixed(2);
    const E = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const HIDDEN: Record<string, string> = {
      up: 'translateY(48px)',
      left: 'translateX(-70px)',
      right: 'translateX(70px)',
      scale: 'scale(0.86)',
      flip: 'perspective(1000px) rotateX(18deg) translateY(30px)',
      clip: 'translateY(30px)',
      tracking: 'translateY(16px)',
    };
    const initEl = (el: HTMLElement, kind: string) => {
      if (!el.dataset.rvInit) {
        el.dataset.rvInit = '1';
        el.dataset.rvT = el.style.transform || '';
        el.dataset.rvLs = el.style.letterSpacing || '';
        el.dataset.rvTr =
          `opacity ${dur}s ${E}, transform ${dur}s ${E}, clip-path ${dur}s ${E}, letter-spacing ${dur}s ${E}`;
        el.style.transition = el.dataset.rvTr;
        el.style.willChange = 'transform, opacity';
        if (kind === 'flip') el.style.transformOrigin = 'center bottom';
      }
    };
    const hideEl = (el: HTMLElement, kind: string) => {
      initEl(el, kind);
      if (el.dataset.rvLock) return;
      el.style.transitionDelay = '0s';
      el.style.opacity = '0';
      el.style.transform = HIDDEN[kind] || HIDDEN.up;
      if (kind === 'clip') el.style.clipPath = 'inset(0 0 92% 0)';
      if (kind === 'tracking') el.style.letterSpacing = '0.24em';
    };
    const showEl = (el: HTMLElement, kind: string, delay = 0) => {
      if (el.dataset.rvLock) return;
      const extra = parseFloat(el.getAttribute('data-reveal-delay') || '') || 0;
      el.style.transitionDelay = `${extra + delay}s`;
      el.style.opacity = '1';
      el.style.transform = el.dataset.rvT || 'none';
      if (kind === 'clip') el.style.clipPath = 'inset(0 0 0% 0)';
      if (kind === 'tracking') el.style.letterSpacing = el.dataset.rvLs || '';
    };

    let io: IntersectionObserver | null = null;
    if (!reduced) {
      const els = $$('[data-reveal]');
      els.forEach(el => {
        const kind = el.getAttribute('data-reveal') || 'up';
        if (kind === 'stagger') Array.from(el.children).forEach(ch => hideEl(ch as HTMLElement, 'up'));
        else hideEl(el, kind);
      });
      io = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const el = entry.target as HTMLElement;
            const kind = el.getAttribute('data-reveal') || 'up';
            if (!entry.isIntersecting) return;
            // Reveal. The element stays OBSERVED (it used to be unobserved here,
            // which is what made every reveal one-shot) so that once it is
            // re-armed below the fold it can play again.
            if (kind === 'stagger') {
              Array.from(el.children).forEach((ch, i) => showEl(ch as HTMLElement, 'up', i * 0.18));
            } else {
              const sibs = el.parentElement
                ? Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-reveal'))
                : [];
              const idx = Math.max(0, sibs.indexOf(el));
              showEl(el, kind, (idx % 4) * 0.24 + Math.floor(idx / 4) * 0.08);
            }
          });
        },
        // threshold 0 — fire as soon as any part of the element is inside the
        // band, and NOT on a fraction of it.
        //
        // A fraction deadlocks the `clip` reveal. Its hidden style is
        // `clip-path: inset(0 0 92% 0)`, and Chrome measures an element's
        // intersection from its CLIPPED box — so a hidden card can never report
        // more than 0.08 of itself, which was exactly the threshold this
        // observer used. Landing on the boundary, it came down to how the card's
        // pixel height rounded: on some widths the reveal fired, on others it
        // missed by a rounding step, and an element that never reveals never
        // drops the clip that is holding its ratio down. That is why the
        // Collections cards came up blank on a phone, and why the first one
        // sometimes never appeared on a desktop either.
        //
        // The -12% margin, not a ratio, is what keeps a reveal from playing the
        // instant an element's first pixel clears the fold.
        { threshold: 0, rootMargin: '0px 0px -12% 0px' },
      );
      els.forEach(el => io!.observe(el));
      cleanup.push(() => io!.disconnect());

      // Re-arm anything that has gone back BELOW the fold, so scrolling up and
      // then down again replays it — the "reverse scroll" effect.
      //
      // Only below. An element that leaves upwards is left alone: re-hiding
      // THAT is what made content vanish under the reader, and nobody is about
      // to watch an animation happen above their scroll position anyway.
      let rearmTick = 0;
      const rearm = () => {
        rearmTick = 0;
        const h = window.innerHeight;
        els.forEach(el => {
          if (el.dataset.rvLock) return;
          if (el.getBoundingClientRect().top < h) return;
          const kind = el.getAttribute('data-reveal') || 'up';
          if (kind === 'stagger') Array.from(el.children).forEach(ch => hideEl(ch as HTMLElement, 'up'));
          else hideEl(el, kind);
        });
      };
      const onRearmScroll = () => {
        if (!rearmTick) rearmTick = requestAnimationFrame(rearm);
      };
      window.addEventListener('scroll', onRearmScroll, { passive: true });
      cleanup.push(() => {
        window.removeEventListener('scroll', onRearmScroll);
        if (rearmTick) cancelAnimationFrame(rearmTick);
      });
    }

    // ── Count-up numbers ──────────────────────────────────────────────
    const counters = $$('[data-count]');
    if (counters.length) {
      const ioCount = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const target = parseInt(el.getAttribute('data-count') || '0', 10) || 0;
            const t0 = performance.now();
            const D = reduced ? 1 : 2200;
            const tick = (now: number) => {
              const k = Math.min(1, (now - t0) / D);
              const ease = 1 - Math.pow(1 - k, 4);
              el.textContent = String(Math.round(target * ease));
              if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            ioCount.unobserve(el);
          });
        },
        { threshold: 0.6 },
      );
      counters.forEach(el => ioCount.observe(el));
      cleanup.push(() => ioCount.disconnect());
    }

    return () => cleanup.forEach(fn => fn());
  }, [rootRef]);
}
