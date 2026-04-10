let popupWindowId = null;
let previousTabId = null;
let currentWindowId = null;

async function openPopup() {
  // Salva a aba ativa e a janela atual antes de abrir o popup
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab) {
    previousTabId = activeTab.id;
    currentWindowId = activeTab.windowId;
  }

  // Se já existe uma janela aberta, foca nela
  if (popupWindowId !== null) {
    try {
      await chrome.windows.update(popupWindowId, { focused: true });
      return;
    } catch {
      popupWindowId = null;
    }
  }

  // Descobre a posição da janela atual para centralizar o popup
  const win = await chrome.windows.getCurrent();

  const popupWidth = 640;
  const popupHeight = 500;
  const left = Math.round(win.left + (win.width - popupWidth) / 2);
  const top = Math.round(win.top + (win.height - popupHeight) / 3);

  const popup = await chrome.windows.create({
    url: chrome.runtime.getURL('popup/popup.html'),
    type: 'popup',
    width: popupWidth,
    height: popupHeight,
    left,
    top,
    focused: true,
  });

  popupWindowId = popup.id;
}

chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-tab-switcher') openPopup();
});

chrome.action.onClicked.addListener(() => openPopup());

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    popupWindowId = null;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_TABS') {
    chrome.tabs.query({}).then((tabs) => {
      const tabData = tabs.map((tab) => ({
        id: tab.id,
        windowId: tab.windowId,
        title: tab.title || '(sem título)',
        url: tab.url || '',
        favIconUrl: tab.favIconUrl || '',
        active: tab.active,
        audible: tab.audible,
      }));
      sendResponse({ tabs: tabData, previousTabId, currentWindowId });
    });
    return true; // resposta assíncrona
  }

  if (message.type === 'SWITCH_TAB') {
    const { tabId, windowId } = message;
    chrome.windows.update(windowId, { focused: true }).then(() => {
      chrome.tabs.update(tabId, { active: true });
    });
    // Fecha o popup após trocar de aba
    if (popupWindowId !== null) {
      chrome.windows.remove(popupWindowId);
    }
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === 'CLOSE_TAB') {
    chrome.tabs.remove(message.tabId).then(() => {
      chrome.tabs.query({}).then((tabs) => {
        const tabData = tabs.map((tab) => ({
          id: tab.id,
          windowId: tab.windowId,
          title: tab.title || '(sem título)',
          url: tab.url || '',
          favIconUrl: tab.favIconUrl || '',
          active: tab.active,
          audible: tab.audible,
        }));
        sendResponse({ tabs: tabData });
      });
    });
    return true;
  }

  if (message.type === 'CLOSE_POPUP') {
    if (popupWindowId !== null) {
      chrome.windows.remove(popupWindowId);
    }
    sendResponse({ ok: true });
    return true;
  }
});
