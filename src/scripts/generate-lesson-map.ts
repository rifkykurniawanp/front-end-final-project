// import fs from 'fs';
// import path from 'path';

// const LESSONS_DIR = path.join(__dirname, '../app/data/courses/tea/lessons');
// const OUTPUT_LESSON_MAP = path.join(__dirname, '../app/data/courses/tea/lessonMap.ts');
// const OUTPUT_INDEX = path.join(__dirname, '../app/data/courses/tea/index.ts');

// function toCamelCase(str: string) {
//   return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
// }

// function generate() {
//   const files = fs.readdirSync(LESSONS_DIR);

//   const lessonImports: string[] = [];
//   const lessonMapEntries: string[] = [];
//   const indexExports: string[] = [];

//   for (const dir of files) {
//     const metaPath = path.join(LESSONS_DIR, dir, 'meta.ts');
//     if (fs.existsSync(metaPath)) {
//       const lessonId = dir;
//       const importName = toCamelCase(lessonId);

//       lessonImports.push(`import { ${importName} } from './lessons/${lessonId}/meta';`);
//       lessonMapEntries.push(`  '${lessonId}': ${importName},`);
//       indexExports.push(`export { ${importName} } from './lessons/${lessonId}/meta';`);
//     }
//   }

//   // Write lessonMap.ts
//   const lessonMapContent = `${lessonImports.join('\n')}

// export const teaLessonMap = {
// ${lessonMapEntries.join('\n')}
// };
// `;
//   fs.writeFileSync(OUTPUT_LESSON_MAP, lessonMapContent, 'utf-8');

//   // Append to index.ts
//   let indexContent = indexExports.join('\n');
//   indexContent += `\n\nexport { teaCourse } from './course';\nexport { teaModules } from './module';\n`;
//   fs.writeFileSync(OUTPUT_INDEX, indexContent, 'utf-8');

//   console.log('✅ Lesson map and index.ts generated.');
// }

// generate();
