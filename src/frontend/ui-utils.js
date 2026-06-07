(function(root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.GeoUIUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(root) {
  function toText(value) {
    return value == null ? '' : String(value);
  }

  function clearElement(element) {
    if (!element) return null;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    return element;
  }

  function setText(element, text) {
    if (!element) return null;
    element.textContent = toText(text);
    return element;
  }

  function appendChildren(parent, children) {
    if (!parent || !children) return parent || null;
    const list = Array.isArray(children) ? children : [children];
    list.forEach(child => {
      if (child) parent.appendChild(child);
    });
    return parent;
  }

  function createElement(tagName, options = {}) {
    const documentRef = options.documentRef || root.document;
    if (!documentRef || typeof documentRef.createElement !== 'function') {
      throw new Error('document.createElement is unavailable');
    }

    const element = documentRef.createElement(tagName);
    if (options.className) element.className = options.className;
    if (options.text != null) setText(element, options.text);
    if (options.title != null) element.title = toText(options.title);
    if (options.type != null) element.type = toText(options.type);
    if (options.value != null) element.value = toText(options.value);
    if (options.dataset && element.dataset) {
      Object.entries(options.dataset).forEach(([key, value]) => {
        element.dataset[key] = toText(value);
      });
    }
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        if (value != null) element.setAttribute(key, toText(value));
      });
    }
    if (options.styles) {
      Object.entries(options.styles).forEach(([key, value]) => {
        if (value != null) element.style[key] = value;
      });
    }
    if (typeof options.onClick === 'function') {
      element.addEventListener('click', options.onClick);
    }
    if (options.children) {
      appendChildren(element, options.children);
    }
    return element;
  }

  function createButton(label, options = {}) {
    return createElement('button', {
      ...options,
      type: options.type || 'button',
      text: label,
      onClick: options.onClick,
    });
  }

  function createOption(value, label, selected = false, options = {}) {
    const option = createElement('option', {
      documentRef: options.documentRef,
      value,
      text: label,
    });
    if (selected) option.selected = true;
    return option;
  }

  function renderEmptyState(message, options = {}) {
    const element = createElement(options.tagName || 'div', {
      documentRef: options.documentRef,
      className: options.className || 'empty-state',
      text: message,
    });
    return element;
  }

  async function copyToClipboard(text, options = {}) {
    const value = toText(text);
    const navigatorRef = options.navigatorRef || root.navigator;
    if (navigatorRef && navigatorRef.clipboard && typeof navigatorRef.clipboard.writeText === 'function') {
      try {
        await navigatorRef.clipboard.writeText(value);
        return true;
      } catch {
        // Fall through to the textarea fallback for browsers that reject clipboard writes.
      }
    }

    const documentRef = options.documentRef || root.document;
    if (!documentRef || typeof documentRef.createElement !== 'function') {
      return false;
    }

    const textarea = documentRef.createElement('textarea');
    textarea.value = value;
    const body = documentRef.body;
    if (!body || typeof body.appendChild !== 'function') return false;
    body.appendChild(textarea);
    if (typeof textarea.select === 'function') textarea.select();
    const copied = typeof documentRef.execCommand === 'function'
      ? documentRef.execCommand('copy')
      : false;
    if (typeof body.removeChild === 'function') body.removeChild(textarea);
    return !!copied;
  }

  function isDebugEnabled(options = {}) {
    const storage = options.storage || root.localStorage;
    if (!storage || typeof storage.getItem !== 'function') return false;
    try {
      return storage.getItem('GEO_WORKBENCH_DEBUG') === '1';
    } catch {
      return false;
    }
  }

  function debugLog(...args) {
    if (!isDebugEnabled()) return;
    const consoleRef = root.console;
    if (consoleRef && typeof consoleRef.debug === 'function') {
      consoleRef.debug(...args);
    }
  }

  return {
    clearElement,
    setText,
    createElement,
    createButton,
    createOption,
    appendChildren,
    renderEmptyState,
    copyToClipboard,
    isDebugEnabled,
    debugLog,
  };
});
