/**
 * Gets the current Hijri Date.
 */
export function getHijriDate(date = new Date()) {
  const locale = navigator.language
  return new Intl.DateTimeFormat(locale + '-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}
