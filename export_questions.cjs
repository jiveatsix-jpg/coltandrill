/**
 * export_questions.cjs
 * Genera un fichero .txt por módulo y nivel con todas las preguntas.
 * Uso: node export_questions.cjs
 */

const fs = require('fs');
const path = require('path');

// ---------- Leer questions.ts como texto y extraer los datos ----------
const src = fs.readFileSync(path.join(__dirname, 'src/data/questions.ts'), 'utf8');

// Extractar THEMES
const themesMatch = src.match(/export const THEMES[^=]*=\s*(\[[\s\S]*?\n\])/);
if (!themesMatch) { console.error('No se encontró THEMES'); process.exit(1); }

// Ejecutamos el TS compilado a través del import dinámico en un entorno CJS
// Mejor: leer el JSON intermedio de preguntas usando una regex sencilla

// Extraer todos los objetos de QUESTIONS con una regex
const questionsRaw = [];
// Capturamos cada { id: ... } de QUESTIONS
const qRegex = /\{\s*id:\s*(\d+),\s*prompt:\s*'([^']+)'[^}]+options:\s*\[([^\]]+)\][^}]+answer:\s*'([^']+)'[^}]+theme:\s*'([^']+)'[^}]+level:\s*'([^']+)'[^}]+subcategory:\s*'([^']+)'\s*\}/g;

let m;
while ((m = qRegex.exec(src)) !== null) {
  const opts = m[3].match(/'([^']+)'/g)?.map(o => o.replace(/'/g, '')) ?? [];
  questionsRaw.push({
    id:          parseInt(m[1]),
    prompt:      m[2],
    options:     opts,
    answer:      m[4],
    theme:       m[5],
    level:       m[6],
    subcategory: m[7],
  });
}

console.log(`Preguntas parseadas: ${questionsRaw.length}`);

// ---------- Definición de módulos y niveles ----------
const themes = [
  { id: 'intervalos', label: 'INTERVALOS' },
  { id: 'escalas',    label: 'ESCALAS'    },
  { id: 'acordes',    label: 'ACORDES'    },
  { id: 'teoria',     label: 'TEORIA_GENERAL' },
  { id: 'blues',      label: 'BLUES'      },
  { id: 'vaporwave',  label: 'VAPORWAVE'  },
  { id: 'chirigotas', label: 'CHIRIGOTAS' },
  { id: 'iluminacion',label: 'ILUMINACION'},
];
const levels = ['basico', 'intermedio', 'avanzado'];

const outDir = path.join(__dirname, 'preguntas_exportadas');
fs.mkdirSync(outDir, { recursive: true });

themes.forEach(t => {
  levels.forEach(l => {
    const qs = questionsRaw.filter(q => q.theme === t.id && q.level === l);
    if (!qs.length) return;

    const lines = [
      '='.repeat(60),
      `${t.label} — ${l.toUpperCase()}`,
      `Total: ${qs.length} preguntas`,
      '='.repeat(60),
      '',
    ];

    qs.forEach((q, i) => {
      lines.push(`${i + 1}. ${q.prompt}`);
      q.options.forEach((o, j) => {
        const letter = String.fromCharCode(65 + j);
        const mark = o === q.answer ? ' ✓' : '';
        lines.push(`   ${letter}) ${o}${mark}`);
      });
      lines.push(`   [Subcategoría: ${q.subcategory}]`);
      lines.push('');
    });

    const filename = `[${t.label}][${l.toUpperCase()}].txt`;
    fs.writeFileSync(path.join(outDir, filename), lines.join('\n'), 'utf8');
    console.log(`✓ ${filename}  (${qs.length} preguntas)`);
  });
});

console.log(`\nFicheros guardados en: ${outDir}`);
