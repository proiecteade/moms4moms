// Transformă un fișier lunar (ex. 2026-11.json) în SQL de import ca ciornă.
// Folosire: node scripts/horoscop/to-sql.js scripts/horoscop/2026-11.json > out.sql
const fs = require('fs')
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const q = v => v == null ? 'null' : "'" + String(v).replace(/'/g, "''") + "'"
let sql = `insert into public.horoscope_months (month, status, title, intro, watchouts, sources, pair_notes, updated_by)
values (${q(d.month)}, 'draft', ${q(d.title)}, ${q(d.intro)}, ${q(JSON.stringify(d.watchouts))}::jsonb, ${q(JSON.stringify(d.sources))}::jsonb, ${q(JSON.stringify(d.pair_notes || {}))}::jsonb, 'claude')
on conflict (month) do update set title=excluded.title, intro=excluded.intro, watchouts=excluded.watchouts, sources=excluded.sources, pair_notes=excluded.pair_notes, updated_at=now(), updated_by='claude'
where public.horoscope_months.status = 'draft';\n`
const cols = ['teaser','general','love','career','health','moms','lucky_days','lucky_color','lucky_number','tip','family','kids']
for (const [sign, e] of Object.entries(d.entries)) {
  sql += `insert into public.horoscope_entries (month, sign, status, ${cols.join(', ')}, updated_by)
values (${q(d.month)}, ${q(sign)}, 'draft', ${cols.map(c => q(e[c])).join(', ')}, 'claude')
on conflict (month, sign) do update set ${cols.map(c => `${c}=excluded.${c}`).join(', ')}, updated_at=now(), updated_by='claude'
where public.horoscope_entries.status = 'draft';\n`
}
process.stdout.write(sql)
