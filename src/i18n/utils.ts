import { ui, defaultLang, languages, type Lang, type UIKey } from './ui';

export { languages, defaultLang };
export type { Lang };

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Prefix a path with the locale. Default locale (de) has no prefix. */
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean}`;
}

/** Remove locale prefix from a pathname → canonical path used to build alternates. */
export function stripLangFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && parts[0] in languages) {
    return '/' + parts.slice(1).join('/');
  }
  return pathname;
}
