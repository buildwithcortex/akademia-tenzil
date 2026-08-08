import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Mission } from '@/components/Mission';
import { About } from '@/components/About';
import { Programs } from '@/components/Programs';
import { Method } from '@/components/Method';
import { Guidance } from '@/components/Guidance';
import { Message } from '@/components/Message';
import { Values } from '@/components/Values';
import { Apply } from '@/components/Apply';
import { Footer } from '@/components/Footer';
import { PageMotion } from '@/components/motion/PageMotion';
import { PaperGrain } from '@/components/ui/Motifs';
import { JsonLd } from '@/components/JsonLd';

export default function Page() {
  return (
    <>
      <PaperGrain />

      {/* Skip link is first in the DOM. */}
      <a href="#apliko" className="tz-skip">
        Kalo te aplikimi
      </a>

      <Nav />

      <main
        id="ballina"
        style={{ display: 'block', position: 'relative', overflow: 'hidden' }}
      >
        <Hero />
        <Mission />
        <About />
        <Programs />
        <Method />
        <Guidance />
        <Message />
        <Values />
        <Apply />
      </main>

      <Footer />

      <PageMotion />
      <JsonLd />
    </>
  );
}
