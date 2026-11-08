import 'server-only';
import { one, run, nowStamp } from './db';

const DAY = 86400000;
const stamp = (ms) => {
  const d = new Date(Date.now() - ms);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

// Applique la politique de conservation, au plus une fois par jour (appelée à l'envoi d'une demande et à l'ouverture de l'admin).
export async function purgeIfDue() {
  try {
    const now = Date.now();
    const row = await one("SELECT v FROM settings WHERE k = 'last_purge'");
    if (row && now - Number(row.v) < DAY) return;
    if (row) await run("UPDATE settings SET v = ? WHERE k = 'last_purge'", [String(now)]);
    else await run("INSERT INTO settings (k, v) VALUES ('last_purge', ?)", [String(now)]);
    await run('DELETE FROM rate_limits WHERE reset_at < ?', [now]);
    await run('DELETE FROM audit WHERE created_at < ?', [stamp(365 * DAY)]);
    await run("DELETE FROM leads WHERE status IN ('nouveau','contacté','perdu') AND created_at < ?", [stamp(3 * 365 * DAY)]);
  } catch {
    /* ne bloque jamais l'utilisateur */
  }
}
