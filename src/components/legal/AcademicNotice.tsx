'use client';

import { Info } from 'lucide-react';

export function AcademicNotice() {
  return (
    <aside className="not-prose mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-200">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <strong>Aviso académico:</strong> Quetzalito es un proyecto educativo sin fines comerciales.
        El contenido de esta página es de carácter referencial, sigue las prácticas estándar de la
        industria y <strong>no constituye un acuerdo vinculante</strong> entre las partes.
      </p>
    </aside>
  );
}
