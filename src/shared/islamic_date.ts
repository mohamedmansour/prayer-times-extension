
interface HijriDateOptions {
  showYear?: boolean
  showDay?: boolean
}
/**
 * Gets the current Hijri Date.
 */
export function getHijriDate(date = new Date(), opt: HijriDateOptions = {showYear: true, showDay: true}) {
  const locale = navigator.language
  const showYear =  opt.showYear === undefined ? true : opt.showYear
  const showDay =  opt.showDay === undefined ? true : opt.showDay
  return new Intl.DateTimeFormat(locale + '-u-ca-islamic', {
    day: showDay ? 'numeric' : undefined,
    month: 'long',
    year: showYear ? 'numeric' : undefined
  }).format(date)
}
