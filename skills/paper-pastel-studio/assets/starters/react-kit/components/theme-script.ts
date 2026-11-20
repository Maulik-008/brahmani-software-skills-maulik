/* Server-safe on purpose (no 'use client'): Next's server layout calls this.
   Put the result in <head> as an inline <script> so the saved theme is applied before first paint (no flash).
   Keep storageKey in sync with <ThemeProvider storageKey>. */
type Theme = 'light' | 'dark';

/** Put this in <head> (inline) so the right theme is applied before first paint, no flash. */
export const themeInitScript = (storageKey = 'pp-theme', defaultTheme: Theme = 'light', enableSystem = false) =>
  `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)});` +
  `if(t!=='light'&&t!=='dark'){t=${enableSystem ? "(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')" : JSON.stringify(defaultTheme)};}` +
  `document.documentElement.classList.toggle('dark',t==='dark');` +
  `document.documentElement.style.colorScheme=t;}catch(e){}})();`;
