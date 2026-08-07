import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Akademia Tenzil — Memorizim dhe Përforcim i Kuranit';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * White logo on deep emerald, wordmark in Cinzel Wolf, gold arch + diamonds.
 * Satori supports flexbox only (no grid), so everything here is flex or
 * absolutely positioned.
 */
export default async function Image() {
  const root = process.cwd();
  const [cinzel, logo] = await Promise.all([
    readFile(join(root, 'public/fonts/CinzelWolf.ttf')),
    readFile(join(root, 'public/logo-white.png')),
  ]);

  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#123F33',
          padding: '76px 88px',
          position: 'relative',
        }}
      >
        {/* Mihrab arch, right */}
        <svg
          width="620"
          height="700"
          viewBox="0 0 600 700"
          fill="none"
          style={{ position: 'absolute', right: -110, top: -40, opacity: 0.32 }}
        >
          <path
            d="M60 700V300C60 200 110 140 300 -40c190 180 240 240 240 340v400"
            stroke="#B08A4C"
            strokeWidth="1.6"
          />
          <path
            d="M140 700V330C140 250 180 200 300 60c120 140 160 190 160 270v370"
            stroke="#B08A4C"
            strokeWidth="1.6"
          />
          <path
            d="M220 700V356C220 296 250 254 300 180c50 74 80 116 80 176v344"
            stroke="rgba(176,138,76,.6)"
            strokeWidth="1.4"
          />
        </svg>

        {/* Eyebrow: 34×1px gold rule + uppercase label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 1, background: '#B08A4C' }} />
          <div
            style={{
              fontFamily: 'Cinzel Wolf',
              fontSize: 19,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#B08A4C',
            }}
          >
            Akademia Tenzil
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontFamily: 'Cinzel Wolf',
              fontSize: 66,
              lineHeight: 1.14,
              color: '#F4F0E6',
              letterSpacing: '-0.01em',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div>Një rrugëtim me Kuranin,</div>
            <div style={{ color: '#B08A4C' }}>i ndërtuar për të qëndruar.</div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <img src={logoSrc} width={72} height={72} alt="" />
            <div
              style={{
                fontFamily: 'Cinzel Wolf',
                fontSize: 27,
                letterSpacing: '0.17em',
                textTransform: 'uppercase',
                color: '#F4F0E6',
              }}
            >
              Akademia Tenzil
            </div>
          </div>

          <div style={{ display: 'flex', gap: 11 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 13,
                  height: 13,
                  background: '#B08A4C',
                  transform: 'rotate(45deg)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Cinzel Wolf',
          data: cinzel as unknown as ArrayBuffer,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );
}
