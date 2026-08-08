import s from './AdminBrand.module.css';

/**
 * Login screen graphic. Both logo files are rendered and CSS shows whichever
 * suits the active theme, since the admin can be light or dark.
 */
export function Logo() {
  return (
    <div className={s.logo}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-dark.png"
        alt="Akademia Tenzil"
        className={`${s.mark} ${s.onLight}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-white.png" alt="" className={`${s.mark} ${s.onDark}`} />
      <div>
        <p className={s.wordmark}>Akademia Tenzil</p>
        {/* The site's tagline belongs on the public site; this is the tool. */}
        <p className={s.tagline}>Control Panel</p>
      </div>
    </div>
  );
}
