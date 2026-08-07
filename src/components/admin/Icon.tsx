import s from './AdminBrand.module.css';

/** Small mark shown in the admin sidebar. */
export function Icon() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-dark.png"
        alt="Akademia Tenzil"
        className={`${s.icon} ${s.onLight}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-white.png" alt="" className={`${s.icon} ${s.onDark}`} />
    </>
  );
}
