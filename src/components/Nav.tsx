'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLenis } from './motion/SmoothScroll';
import { ArrowCircle } from './ui/Motifs';
import s from './Nav.module.css';

const LINKS = [
  {
    href: '#ballina',
    label: 'Ballina',
    icon: (
      <path
        d="M2.6 7.6 9 2.4l6.4 5.2v7.2a.8.8 0 0 1-.8.8H3.4a.8.8 0 0 1-.8-.8V7.6Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: '#misioni',
    label: 'Misioni',
    icon: (
      <path
        d="M9 15.4C9 12.9 6.9 11 4.3 11H2.4V3.8h1.9C6.9 3.8 9 5.7 9 8.2m0 7.2c0-2.5 2.1-4.4 4.7-4.4h1.9V3.8h-1.9C11.1 3.8 9 5.7 9 8.2m0 7.2V8.2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: '#programi',
    label: 'Programi',
    icon: (
      <path
        d="M3.2 3.4h4.2a1.6 1.6 0 0 1 1.6 1.6v9.6a1.2 1.2 0 0 0-1.2-1.2H3.2V3.4Zm11.6 0h-4.2A1.6 1.6 0 0 0 9 5v9.6a1.2 1.2 0 0 1 1.2-1.2h4.6V3.4Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: '#metoda',
    label: 'Metoda',
    icon: (
      <>
        <path
          d="M9 2.2 10.4 6l3.8 1.4-3.8 1.4L9 12.6 7.6 8.8 3.8 7.4 7.6 6 9 2.2Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path d="M4.2 13.4h9.6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </>
    ),
  },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  /* --- compact morph on scroll ------------------------------------------- */
  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;

    const word = pill.querySelector<HTMLElement>('[data-nav-word]');
    const ctaLabel = pill.querySelector<HTMLElement>('[data-cta-label]');
    const links = Array.from(pill.querySelectorAll<HTMLElement>('[data-navlink]'));

    let on: boolean | null = null;

    // Below 480px the CTA label is collapsed by CSS regardless of scroll, so
    // the hamburger stays on-screen. Leave those properties to the stylesheet
    // there rather than writing inline values that would override it.
    const narrowQuery = window.matchMedia('(max-width: 479px)');

    const update = (force = false) => {
      const y = window.scrollY;
      // Hysteresis band: compact past 140, expand below 60. A single threshold
      // makes the pill flip-flop.
      const next = on === null ? y > 140 : on ? y > 60 : y > 140;
      if (next === on && !force) return;
      on = next;

      pill.style.background = next
        ? 'rgba(244,240,230,.52)'
        : 'rgba(251,250,244,.86)';
      pill.style.backdropFilter = next
        ? 'blur(26px) saturate(1.7)'
        : 'blur(18px) saturate(1.4)';
      pill.style.setProperty('-webkit-backdrop-filter', pill.style.backdropFilter);
      pill.style.borderColor = next
        ? 'rgba(244,240,230,.5)'
        : 'rgba(30,90,75,.10)';
      pill.style.padding = next ? '5px 5px 5px 12px' : '9px 9px 9px 16px';
      // Animate max-width only: width 100% → auto is not interpolatable.
      pill.style.maxWidth = next ? '430px' : '1200px';
      pill.style.boxShadow = next
        ? '0 1px 0 rgba(255,255,255,.6) inset,0 18px 50px -30px rgba(18,63,51,.4)'
        : '0 1px 2px rgba(18,63,51,.05),0 20px 44px -28px rgba(18,63,51,.28)';

      // Never reset an inline style to ''. Write the explicit value back.
      if (word) {
        word.style.fontSize = next ? '11px' : 'clamp(11px,1.3vw,13.5px)';
        word.style.letterSpacing = next ? '.14em' : '.17em';
        word.style.marginLeft = next ? '9px' : '11px';
      }
      if (ctaLabel) {
        if (narrowQuery.matches) {
          // Hand control back to the stylesheet.
          ctaLabel.style.removeProperty('max-width');
          ctaLabel.style.removeProperty('opacity');
          ctaLabel.style.removeProperty('margin-right');
          ctaLabel.style.removeProperty('margin-left');
        } else {
          ctaLabel.style.maxWidth = next ? '0px' : '160px';
          ctaLabel.style.opacity = next ? '0' : '1';
          ctaLabel.style.marginRight = next ? '0px' : '10px';
          ctaLabel.style.marginLeft = next ? '0px' : '10px';
        }
      }
      links.forEach((l, i) => {
        const text = l.querySelector<HTMLElement>('[data-navtext]');
        const icon = l.querySelector<HTMLElement>('[data-navicon]');
        const delay = `${(next ? i : links.length - 1 - i) * 55}ms`;
        if (text) {
          text.style.transitionDelay = delay;
          text.style.maxWidth = next ? '0px' : '160px';
          text.style.opacity = next ? '0' : '1';
        }
        if (icon) {
          icon.style.transitionDelay = delay;
          icon.style.opacity = next ? '1' : '0';
          icon.style.width = next ? '20px' : '0px';
        }
      });
    };

    const onScroll = () => update();
    // Crossing the 480px boundary has to re-apply the CTA label state.
    const onNarrowChange = () => update(true);

    window.addEventListener('scroll', onScroll, { passive: true });
    narrowQuery.addEventListener('change', onNarrowChange);
    update(true);

    return () => {
      window.removeEventListener('scroll', onScroll);
      narrowQuery.removeEventListener('change', onNarrowChange);
    };
  }, []);

  /* --- mobile overlay: scroll lock, focus trap, Escape -------------------- */
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    burgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    document.documentElement.style.overflow = 'hidden';
    lenis?.stop();

    const overlay = overlayRef.current;
    const focusables = () =>
      Array.from(
        overlay?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !overlay?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Resizing up to desktop dismisses the overlay.
    const onResize = () => {
      if (window.innerWidth >= 900) setMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      document.documentElement.style.overflow = '';
      lenis?.start();
    };
  }, [menuOpen, lenis, closeMenu]);

  return (
    <>
      <nav aria-label="Navigimi kryesor" className={s.nav}>
        <div ref={pillRef} className={s.pill}>
          <a href="#ballina" className={s.brand}>
            <Image
              src="/logo-dark.png"
              alt=""
              width={34}
              height={34}
              priority
              className={s.logo}
            />
            <span data-nav-word="1" className={s.wordmark}>
              Akademia Tenzil
            </span>
          </a>

          <ul className={s.links}>
            {LINKS.map((l) => (
              <li key={l.href}>
                {/* Collapsed labels stay reachable via aria-label + title. */}
                <a
                  data-navlink="1"
                  href={l.href}
                  aria-label={l.label}
                  title={l.label}
                  className={s.link}
                >
                  <span data-navicon="1" aria-hidden="true" className={s.linkIcon}>
                    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                      {l.icon}
                    </svg>
                  </span>
                  <span data-navtext="1" className={s.linkText}>
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            data-magnetic="1"
            href="#apliko"
            aria-label="Apliko tani"
            className={s.cta}
          >
            <span data-cta-label="1" className={s.ctaLabel}>
              Apliko tani
            </span>
            <ArrowCircle tone="nav" />
          </a>

          <button
            ref={burgerRef}
            type="button"
            className={s.burger}
            aria-label="Hap menynë"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menyja"
          className={s.overlay}
        >
          <div className={s.overlayHead}>
            <Image
              src="/logo-white.png"
              alt="Akademia Tenzil"
              width={40}
              height={40}
              style={{ width: 40, height: 40 }}
            />
            <button
              type="button"
              className={s.close}
              aria-label="Mbyll menynë"
              onClick={closeMenu}
            >
              ×
            </button>
          </div>

          <ul className={s.overlayLinks}>
            {[...LINKS, { href: '#apliko', label: 'Apliko' }].map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={closeMenu}
                  className={`${s.overlayLink}${
                    l.href === '#apliko' ? ` ${s.overlayApply}` : ''
                  }`}
                  style={{ animationDelay: `${0.06 + i * 0.07}s` }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <p className={s.overlayFoot}>Memorizim · Përforcim · Përsosje</p>
        </div>
      )}
    </>
  );
}
