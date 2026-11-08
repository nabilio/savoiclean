// Illustration originale : chaîne de montagnes en couches, avec brillance de neige propre.
export default function Mountains({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="mt-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6f5" />
          <stop offset="1" stopColor="#e6f2fa" />
        </linearGradient>
        <linearGradient id="mt-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9cc7e4" />
          <stop offset="1" stopColor="#cde5f4" />
        </linearGradient>
        <linearGradient id="mt-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6aa6cf" />
          <stop offset="1" stopColor="#a9d0e8" />
        </linearGradient>
      </defs>
      <path fill="url(#mt-far)" d="M0 240 L110 150 L190 210 L300 110 L420 215 L520 150 L640 230 L760 120 L880 220 L990 160 L1110 235 L1230 140 L1340 210 L1440 160 L1440 360 L0 360Z" />
      <path fill="#fff" d="M300 110 L336 150 L318 144 L300 160 L284 142 L268 150Z" />
      <path fill="#fff" d="M760 120 L800 165 L778 158 L760 176 L742 156 L722 166Z" />
      <path fill="url(#mt-mid)" d="M0 290 L140 205 L250 265 L380 175 L510 270 L620 215 L760 290 L900 190 L1030 275 L1150 205 L1290 285 L1440 215 L1440 360 L0 360Z" />
      <path fill="#fff" d="M380 175 L410 212 L394 207 L380 222 L366 206 L350 212Z" />
      <path fill="#fff" d="M900 190 L930 228 L914 222 L900 238 L886 222 L868 229Z" />
      <path fill="url(#mt-near)" d="M0 330 L170 280 L300 320 L460 270 L620 325 L790 285 L960 330 L1120 280 L1280 325 L1440 290 L1440 360 L0 360Z" />
      <path fill="#fff" d="M0 352 L1440 352 L1440 360 L0 360Z" />
    </svg>
  );
}

export function LogoMark({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 84 84" aria-hidden="true" style={{ flex: 'none' }}>
      <defs>
        <linearGradient id="lm-drop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5fd0e8" />
          <stop offset="1" stopColor="#1aa39d" />
        </linearGradient>
      </defs>
      <path d="M42 6C58 26 70 38 70 52a28 28 0 0 1-56 0C14 38 26 26 42 6z" fill="url(#lm-drop)" />
      <path d="M50 40c-3-5-9-6-13-3s-3 8 3 10l6 2c6 2 6 8 1 10-4 2-10 1-14-3" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M64 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#ffc94d" />
    </svg>
  );
}

export function BrandName({ name }) {
  const m = /^(.*?)(Clean)$/.exec(name || '');
  if (!m || !m[1]) return <>{name}</>;
  return (
    <>
      {m[1]}
      <i>{m[2]}</i>
    </>
  );
}
