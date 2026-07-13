// Barrel file — re-exports from the Svelte 5 runes module so TypeScript
// can resolve `$lib/i18n` without needing to understand `.svelte.ts` extensions.
export { t, state, setLang, initI18n } from './i18n/index.svelte.ts';
