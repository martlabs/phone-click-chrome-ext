// content.ts (MV3) — add a 📞 tel: link after plain-text phone numbers on the page
;(() => {
  const EMOJI_ATTR = 'data-phone-emoji'
  const LINK_CLASS = 'phone-emoji-link'
  const STORAGE_KEY = 'clickToCallEnabled'

  let isEnabled = false
  let currentDomain = ''

  // Initialize the extension for this domain
  async function initialize() {
    currentDomain = window.location.hostname

    // Check if extension is enabled for this domain
    const result = await chrome.storage.local.get([STORAGE_KEY])
    const enabledDomains = result[STORAGE_KEY] || {}
    isEnabled = enabledDomains[currentDomain] || false

    if (isEnabled) {
      startExtension()
    }

    // Listen for enable/disable messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TOGGLE_EXTENSION') {
        isEnabled = message.enabled
        if (isEnabled) {
          startExtension()
        } else {
          stopExtension()
        }
      }
    })
  }

  function startExtension() {
    if (document.body.dataset.clickToCallActive) return // Already active

    document.body.dataset.clickToCallActive = 'true'

    // Initial scan + watch for dynamic content
    processSubtree(document.body)
    observeMutations(document.body)
  }

  function stopExtension() {
    document.body.dataset.clickToCallActive = 'false'

    // Remove all existing phone emoji links
    const existingLinks = document.querySelectorAll(`[${EMOJI_ATTR}]`)
    existingLinks.forEach((link) => {
      const parent = link.parentNode
      if (parent) {
        // Replace the link with just the phone number text
        const phoneNumber = link.previousSibling?.textContent || ''
        parent.replaceChild(document.createTextNode(phoneNumber), link)
      }
    })
  }

  injectStyle(`
    .${LINK_CLASS} {
      text-decoration: none !important;
      margin-left: 0.25em;
      font-size: 0.95em;
      line-height: 1;
      vertical-align: baseline;
    }
  `)

  // Permissive finder; we filter by digit count (7–15) to avoid false positives.
  // Matches: +1 (555) 123-4567, 555-123-4567, 555 123 4567, (555)1234567, +44 20 7123 4567, etc.
  const PHONE_RE: RegExp =
    /(?<!\w)(\+?\s*\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}(?:[\s.-]*\d{2,4})*)(?!\w)/g

  // Initialize the extension
  initialize()

  function injectStyle(css: string): void {
    const style = document.createElement('style')
    style.textContent = css
    document.documentElement.appendChild(style)
  }

  function observeMutations(root: Node): void {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE ||
              node.nodeType === Node.DOCUMENT_FRAGMENT_NODE
            ) {
              processSubtree(node as Element | DocumentFragment)
            }
          })
        } else if (m.type === 'characterData' && m.target?.parentNode) {
          processTextNode(m.target as Text)
        }
      }
    })

    obs.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
    })
  }

  function processSubtree(root: Element | DocumentFragment): void {
    const filter: NodeFilter = {
      acceptNode(node: Node): number {
        if (node.nodeType !== Node.TEXT_NODE) return NodeFilter.FILTER_REJECT

        const text = (node as Text).nodeValue ?? ''
        if (!text.trim()) return NodeFilter.FILTER_REJECT

        const parent = (node as Text).parentElement
        if (!parent) return NodeFilter.FILTER_REJECT

        // Skip inside links (especially tel:), code blocks, inputs, SVG, or editable regions
        if (
          parent.closest(
            "a[href^='tel:'], a[href^='callto:'], a, script, style, textarea, svg, code, pre, input, select, option",
          )
        ) {
          return NodeFilter.FILTER_REJECT
        }
        const editableHost = parent.closest('[contenteditable]')
        if (editableHost && (editableHost as HTMLElement).isContentEditable) {
          return NodeFilter.FILTER_REJECT
        }

        // Skip if already within our own emoji link
        if (parent.closest(`[${EMOJI_ATTR}]`)) return NodeFilter.FILTER_REJECT

        return NodeFilter.FILTER_ACCEPT
      },
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, filter)
    const nodes: Text[] = []
    let current: Node | null
    while ((current = walker.nextNode())) nodes.push(current as Text)
    nodes.forEach(processTextNode)
  }

  function processTextNode(textNode: Text): void {
    const text = textNode.nodeValue ?? ''
    if (!text) return

    PHONE_RE.lastIndex = 0

    let match: RegExpExecArray | null
    let lastIndex = 0
    let frag: DocumentFragment | null = null
    let changed = false

    while ((match = PHONE_RE.exec(text))) {
      const raw = match[1]
      const digitsCount = countDigits(raw)

      // Basic plausibility: avoid short/very long numbers
      if (digitsCount < 7 || digitsCount > 15) continue

      // Avoid typical date-like strings (e.g., 2025-10-15)
      if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(raw.trim())) continue

      const telHref = toTelHref(raw)
      if (!telHref) continue

      // If the next sibling is already our emoji for this number, skip (prevents duplicates on minor DOM churn)
      if (
        textNode.nextSibling &&
        textNode.nextSibling.nodeType === Node.ELEMENT_NODE &&
        (textNode.nextSibling as Element).getAttribute(EMOJI_ATTR) === 'true'
      ) {
        continue
      }

      if (!frag) frag = document.createDocumentFragment()

      // Keep the original text up to and including the matched number
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)))
      }
      frag.appendChild(document.createTextNode(raw))

      // Append the 📞 tel: link after the number
      const link = document.createElement('a')
      link.setAttribute(EMOJI_ATTR, 'true')
      link.className = LINK_CLASS
      link.href = telHref
      link.textContent = '📞'
      link.setAttribute('aria-label', `Call ${raw.trim()}`)
      link.title = `Call ${raw.trim()}`
      link.rel = 'noopener noreferrer'
      frag.appendChild(link)

      changed = true
      lastIndex = match.index + raw.length
    }

    if (changed && frag) {
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)))
      }
      textNode.replaceWith(frag)
    }
  }

  function toTelHref(raw: string): string | null {
    const trimmed = raw.trim()
    const hasPlus = trimmed.startsWith('+')
    const digits = trimmed.replace(/[^\d]/g, '')
    if (!digits) return null
    return hasPlus ? `tel:+${digits}` : `tel:${digits}`
  }

  function countDigits(s: string): number {
    let n = 0
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i)
      if (c >= 48 && c <= 57) n++
    }
    return n
  }
})()
