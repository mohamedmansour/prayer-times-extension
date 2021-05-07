import { browser } from 'webextension-polyfill-ts'

/**
 * Checks if the version has changed or initially installed.
 * Needed to make the user experience easy to use instead of
 * it being discoverable.
 */
export async function init() {
  // Version Check.
  const currVersion = browser.runtime.getManifest().version
  const { version } = await browser.storage.sync.get(['version'])
  
  if (currVersion != version) {
    // Check if we just installed this extension.
    if (typeof version == 'undefined') {
      onInstall()
    }

    // Update the version incase we want to do something in future.
    chrome.storage.sync.set({ version: currVersion })
  }
}

/**
 * When the extension first installed.
 */
function onInstall() {
  chrome.runtime.openOptionsPage()
}
