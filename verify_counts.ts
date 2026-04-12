
import { QUESTIONS } from './src/data/questions';

const themes = [...new Set(QUESTIONS.map(q => q.theme))];
const levels = ['basico', 'intermedio', 'avanzado'];

const report = {};

themes.forEach(theme => {
  report[theme] = {};
  levels.forEach(level => {
    const count = QUESTIONS.filter(q => q.theme === theme && q.level === level).length;
    report[theme][level] = count;
  });
});

console.table(report);

const belowTarget = [];
themes.forEach(theme => {
  levels.forEach(level => {
    if (report[theme][level] < 20) {
      belowTarget.push(`${theme} - ${level}: ${report[theme][level]}`);
    }
  });
});

if (belowTarget.length > 0) {
  console.log('\x1b[31m%s\x1b[0m', 'BELOW TARGET (20):');
  console.log(belowTarget.join('\n'));
} else {
  console.log('\x1b[32m%s\x1b[0m', 'ALL THEMES AND LEVELS HAVE AT LEAST 20 QUESTIONS!');
}
