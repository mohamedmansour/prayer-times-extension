import { browser } from 'webextension-polyfill-ts';

export const localizedPrayerTimeMessages = {
  imsak: browser.i18n.getMessage('imsak'),
  fajr: browser.i18n.getMessage('fajr'),
  sunrise: browser.i18n.getMessage('sunrise'),
  dhuhr: browser.i18n.getMessage('dhuhr'),
  asr: browser.i18n.getMessage('asr'),
  sunset: browser.i18n.getMessage('sunset'),
  maghrib: browser.i18n.getMessage('maghrib'),
  isha: browser.i18n.getMessage('isha'),
  midnight: browser.i18n.getMessage('midnight')
}
