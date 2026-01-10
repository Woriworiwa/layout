import { provideHighlightOptions } from 'ngx-highlightjs';

export function provideHighlightJs() {
  return provideHighlightOptions({
    coreLibraryLoader: () => import('highlight.js/lib/core'),
    languages: {
      css: () => import('highlight.js/lib/languages/css'),
      html: () => import('highlight.js/lib/languages/xml'),
      json: () => import('highlight.js/lib/languages/json'),
      tailwind: () => import('./tailwind-highlighter').then((m) => ({ default: m.tailwind })),
    },
    themePath: 'assets/styles/highlightjs.default.css',
  });
}
