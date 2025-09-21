'use strict';

const DEBUG = false; // Set to true for console logs
const log = (...args) => {
    if (DEBUG) console.log('[TUF Cleaner Extension]', ...args);
};

// --- ROBUST SELECTORS ---
// These must match the selectors in styles.css
const SIDEBAR_SELECTOR = 'div[class*="w-\\[20\\%\\]"][class*="block"], div[class*="w-\\[10\\%\\]"][class*="block"]';
const MAIN_CONTENT_SELECTOR = '*[class*="md\\:w-\\[80\\%\\]"], *[class*="lg\\:w-\\[80\\%\\]"]';

log('Content script loaded.');

// --- Efficient Fallback for Dynamic Content ---
// This watches for new elements added to the page after the CSS has been applied.
const applyStylesToNode = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    // Check if the added node itself is a target
    if (node.matches(SIDEBAR_SELECTOR)) {
        node.style.display = 'none';
        log('Observer: Hiding newly added sidebar', node);
    }
    if (node.matches(MAIN_CONTENT_SELECTOR)) {
        node.style.width = '100%';
        node.style.maxWidth = '100%';
        log('Observer: Expanding newly added main content', node);
    }

    // Check for targets within the added node's children
    node.querySelectorAll(SIDEBAR_SELECTOR).forEach(sb => {
        sb.style.display = 'none';
        log('Observer: Hiding sidebar in new content block', sb);
    });
    node.querySelectorAll(MAIN_CONTENT_SELECTOR).forEach(mc => {
        mc.style.width = '100%';
        mc.style.maxWidth = '100%';
        log('Observer: Expanding main content in new content block', mc);
    });
};

const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        for (const addedNode of mutation.addedNodes) {
            applyStylesToNode(addedNode);
        }
    }
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
