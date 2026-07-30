'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './SmoothScroll';

const q = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel));

/**
 * Wires every scroll-driven animation on the page from data attributes:
 *
 *   [data-reveal]      section reveal: y 48 → 0, opacity, blur(6px) → 0
 *   [data-valword]     masked word: yPercent 108 → 0
 *   [data-stepline]    masked method heading, same
 *   [data-scrollline]  gold journey line: scaleY 0 → 1, scrubbed
 *   [data-parallax]    blobs / arch SVGs: yPercent = amount × 100, scrubbed
 *   [data-panel]       program panels: depth entrance, desktop only
 *   [data-draw]        SVG stroke draw
 *   [data-step]        writes 01 to 06 into [data-stepcount]
 *
 * Sections stay server components and carry only these attributes.
 * Under reduced motion every entrance tween is skipped, but the sticky rail and
 * the step counter still run, since those are layout, not decoration.
 */
export function useReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = prefersReducedMotion();

    // --- layout behaviours that run in every motion mode -------------------
    const setupSticky = () => {
      const el = document.querySelector<HTMLElement>('[data-sticky]');
      if (!el) return;
      if (window.innerWidth >= 900) {
        el.style.position = 'sticky';
        el.style.top = '22vh';
      } else {
        el.style.position = 'relative';
        el.style.top = '0px';
      }
    };
    setupSticky();
    const onResize = () => setupSticky();
    window.addEventListener('resize', onResize);

    const counter = document.querySelector<HTMLElement>('[data-stepcount]');
    const triggers: ScrollTrigger[] = [];
    q('[data-step]').forEach((el, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (s) => {
            if (s.isActive && counter) {
              counter.textContent = String(i + 1).padStart(2, '0');
            }
          },
        }),
      );
    });

    if (reduced) {
      return () => {
        window.removeEventListener('resize', onResize);
        triggers.forEach((t) => t.kill());
      };
    }

    // --- decorative motion -------------------------------------------------
    const ctx = gsap.context(() => {
      // Hero headline lines, inside overflow:hidden masks.
      const heroLines = q('[data-hero-line]');
      if (heroLines.length) {
        gsap.set(heroLines, { yPercent: 112 });
        gsap
          .timeline({ delay: 0.15 })
          .to(heroLines, {
            yPercent: 0,
            duration: 1.25,
            ease: 'expo.out',
            stagger: 0.09,
          });
      }

      // Nav links.
      q('[data-navlink]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'expo.out',
            delay: 0.35 + i * 0.06,
          },
        );
      });

      // Arch / logo SVG stroke draw.
      q('[data-draw]').forEach((p, i) => {
        const path = p as unknown as SVGPathElement;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: 'power2.inOut',
          delay: 0.2 + i * 0.16,
        });
      });

      // Hero journey line.
      const jl = document.querySelector('[data-journeyline]');
      if (jl) {
        const len = (jl as unknown as SVGPathElement).getTotalLength();
        gsap.set(jl, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(jl, {
          strokeDashoffset: 0,
          duration: 1.4,
          delay: 1.6,
          ease: 'power2.out',
        });
      }

      gsap.fromTo(
        '[data-diamonds] rect',
        { opacity: 0, scale: 0.4, transformOrigin: 'center' },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'back.out(2)',
          stagger: 0.12,
          delay: 1.1,
        },
      );

      gsap.fromTo(
        '[data-star]',
        { opacity: 0, rotation: -18, transformOrigin: 'center' },
        {
          opacity: 0.07,
          rotation: 0,
          duration: 2.4,
          ease: 'power2.out',
          delay: 0.8,
        },
      );

      // Generic section reveals. The blur lives on a transform-only element and
      // is cleared once the tween completes.
      q('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0, filter: 'blur(6px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onComplete: () => {
              el.style.filter = '';
            },
          },
        );
      });

      // Masked word reveals (values, method headings, about statement).
      q('[data-valword],[data-stepline]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 108 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          },
        );
      });

      // Gold journey lines.
      q('[data-scrollline]').forEach((line) => {
        gsap.to(line, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: line.parentElement as HTMLElement,
            start: 'top 78%',
            end: 'bottom 62%',
            scrub: 0.6,
          },
        });
      });

      // Parallax blobs and arch SVGs, 3-6% only.
      q('[data-parallax]').forEach((el) => {
        const amt = parseFloat(el.dataset.parallax || '') || 0.04;
        gsap.to(el, {
          yPercent: amt * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Program panel depth, desktop only.
      if (window.innerWidth >= 900) {
        q('[data-panel]').forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: i === 0 ? 70 : 110, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          );
        });
      }
    });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', onResize);
      triggers.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);
}
