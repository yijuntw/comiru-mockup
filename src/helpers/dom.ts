export function waitForDOMReady() {
  return new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))
}

