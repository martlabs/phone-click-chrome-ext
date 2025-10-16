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

    // Handle state change for the current tab only
    if (newState) {
      // Enabling: inject content script and start the extension
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ['src/contentScript/index.ts']
      }).then(() => {
        // Send message to start the extension after injection
        chrome.tabs.sendMessage(tab.id!, {
          type: 'TOGGLE_EXTENSION',
          enabled: newState,
        }).catch(() => {
          // Ignore errors
        })
      }).catch(() => {
        // Ignore errors
      })
    } else {
      // Disabling: reload the page to completely remove extension effects
      chrome.tabs.reload(tab.id!)
    }
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


// Initialize icon state
chrome.runtime.onStartup.addListener(() => {
  chrome.action.setTitle({ title: 'Click to Call - Click to enable on this site' })
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setTitle({ title: 'Click to Call - Click to enable on this site' })
})
