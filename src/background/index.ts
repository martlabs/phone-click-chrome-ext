console.log('background is running')

const STORAGE_KEY = 'clickToCallEnabled'

// Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url) return

  try {
    const url = new URL(tab.url)
    const domain = url.hostname

    // Get current state for this domain
    const result = await chrome.storage.local.get([STORAGE_KEY])
    const enabledDomains = result[STORAGE_KEY] || {}
    const currentState = enabledDomains[domain] || false

    // Toggle the state
    const newState = !currentState
    enabledDomains[domain] = newState

    // Save the new state
    await chrome.storage.local.set({ [STORAGE_KEY]: enabledDomains })

    // Update the icon to reflect the current state
    updateIcon(newState)

    // Handle state change for all tabs on this domain
    chrome.tabs.query({ url: `*://${domain}/*` }, (tabs) => {
      tabs.forEach((t) => {
        if (t.id) {
          if (newState) {
            // Enabling: send message to start the extension
            chrome.tabs
              .sendMessage(t.id, {
                type: 'TOGGLE_EXTENSION',
                enabled: newState,
              })
              .catch(() => {
                // Ignore errors for tabs that don't have the content script loaded
              })
          } else {
            // Disabling: reload the page to completely remove extension effects
            chrome.tabs.reload(t.id)
          }
        }
      })
    })
  } catch (error) {
    console.error('Error handling icon click:', error)
  }
})

// Update icon based on enabled state
function updateIcon(enabled: boolean) {
  const iconPath = enabled
    ? {
        16: 'img/enabled16.png',
        32: 'img/enabled32.png',
        48: 'img/enabled48.png',
        128: 'img/enabled128.png',
      }
    : {
        16: 'img/disabled16.png',
        32: 'img/disabled32.png',
        48: 'img/disabled48.png',
        128: 'img/disabled128.png',
      }

  const title = 'Click to Call'

  chrome.action.setIcon({ path: iconPath })
  chrome.action.setTitle({ title })
}

// Update icon when tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId)
  if (!tab.url) return

  try {
    const url = new URL(tab.url)
    const domain = url.hostname

    const result = await chrome.storage.local.get([STORAGE_KEY])
    const enabledDomains = result[STORAGE_KEY] || {}
    const isEnabled = enabledDomains[domain] || false

    updateIcon(isEnabled)
  } catch (error) {
    // Ignore errors for invalid URLs
  }
})

// Update icon when tab URL changes
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const url = new URL(tab.url)
      const domain = url.hostname

      const result = await chrome.storage.local.get([STORAGE_KEY])
      const enabledDomains = result[STORAGE_KEY] || {}
      const isEnabled = enabledDomains[domain] || false

      updateIcon(isEnabled)
    } catch (error) {
      // Ignore errors for invalid URLs
    }
  }
})

// Initialize icon state
chrome.runtime.onStartup.addListener(() => {
  chrome.action.setTitle({ title: 'Click to Call - Click to enable on this site' })
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setTitle({ title: 'Click to Call - Click to enable on this site' })
})
