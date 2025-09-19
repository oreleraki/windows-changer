let currentWindowsIds = [];
let currentFocusedWindowId;

async function init() {
  const windows = await chrome.windows.getAll();
  currentWindowsIds = windows.map(win => win.id);

  const window = await chrome.windows.getCurrent();
  if (window && window.focused) {
    currentFocusedWindowId = window.id;
  } else {
    console.log("Couldn't locate initial focused window.");
  }
}

async function setCurrentFocusedWindowId() {
  const window = await chrome.windows.getCurrent();
  if (window) currentFocusedWindowId = window.id;
}

function getNextFocusedWindowId() {
  const currentFocusPos = currentWindowsIds.indexOf(currentFocusedWindowId);
  if (currentFocusPos === -1 || currentWindowsIds.length === 0) return undefined;
  const nextWindowPos = (currentFocusPos + 1) % currentWindowsIds.length;
  const nextWindowId = currentWindowsIds[nextWindowPos];
  return nextWindowId;
}

async function onClicked() {
  const focusWinId = getNextFocusedWindowId();
  if (focusWinId === undefined) {
    console.log("There is no current focused window.");
    return;
  }
  const window = await chrome.windows.update(focusWinId, { focused: true });
  if (window && window.focused === true) {
    currentFocusedWindowId = window.id;
  }
}

chrome.windows.onRemoved.addListener(init);
chrome.windows.onCreated.addListener(init);
chrome.windows.onFocusChanged.addListener(setCurrentFocusedWindowId);
chrome.action.onClicked.addListener(onClicked);

init();