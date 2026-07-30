'use client';

import { useReveal } from './useReveal';
import { useMagnetic } from './useMagnetic';

/**
 * The one animating primitive on the page.
 *
 * Every section is a server component carrying plain data attributes
 * ([data-reveal], [data-parallax], [data-panel], …); this client component is
 * what reads them and drives GSAP. That keeps the whole content tree out of the
 * client bundle while reproducing the prototype's motion selector-for-selector.
 */
export function PageMotion() {
  useReveal();
  useMagnetic();
  return null;
}
