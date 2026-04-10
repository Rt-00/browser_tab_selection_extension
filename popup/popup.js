'use strict';

// Busca fuzzy simples: retorna score > 0 se todos os chars da query aparecem
// em ordem no texto. Bonus por chars consecutivos e por match no início.
function fuzzyMatch(text, query) {
  if (!query) return { matched: true, score: 0, indices: [] };

  const lText = text.toLowerCase();
  const lQuery = query.toLowerCase();
  const indices = [];

  let qi = 0;
  let consecutive = 0;
  let score = 0;

  for (let i = 0; i < lText.length && qi < lQuery.length; i++) {
    if (lText[i] === lQuery[qi]) {
      indices.push(i);
      consecutive++;
      score += consecutive * 2 + (i === 0 ? 10 : 0);
      qi++;
    } else {
      consecutive = 0;
    }
  }

  if (qi < lQuery.length) return { matched: false, score: 0, indices: [] };

  // Penaliza matches muito espalhados
  const spread = indices[indices.length - 1] - indices[0] + 1;
  score -= spread * 0.1;

  return { matched: true, score, indices };
}

// Envolve os índices matched com <span class="match">
function highlightText(text, indices) {
  if (!indices || indices.length === 0) return escapeHtml(text);

  const indexSet = new Set(indices);
  let result = '';
  let inMatch = false;

  for (let i = 0; i < text.length; i++) {
    const ch = escapeHtml(text[i]);
    if (indexSet.has(i)) {
      if (!inMatch) { result += '<span class="match">'; inMatch = true; }
      result += ch;
    } else {
      if (inMatch) { result += '</span>'; inMatch = false; }
      result += ch;
    }
  }
  if (inMatch) result += '</span>';
  return result;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Estado
let allTabs = [];
let filteredTabs = [];
let selectedIndex = 0;
let currentWindowId = null;

const searchInput = document.getElementById('search-input');
const tabList = document.getElementById('tab-list');

function renderTabs() {
  if (filteredTabs.length === 0) {
    tabList.innerHTML = '<div id="empty-state">Nenhuma aba encontrada</div>';
    return;
  }

  tabList.innerHTML = filteredTabs
    .map((entry, i) => {
      const tab = entry.tab;
      const titleHtml = highlightText(tab.title, entry.titleIndices);
      const urlHtml = highlightText(tab.url, entry.urlIndices);

      const faviconHtml = tab.favIconUrl
        ? `<img class="tab-favicon" src="${escapeHtml(tab.favIconUrl)}" onerror="this.replaceWith(makePlaceholder())" />`
        : `<div class="tab-favicon-placeholder">🌐</div>`;

      const badges = [];
      if (tab.active) badges.push('<span class="badge active">ativa</span>');
      if (tab.audible) badges.push('<span class="badge audible">♪</span>');

      return `
        <div class="tab-item${i === selectedIndex ? ' selected' : ''}" data-index="${i}">
          ${faviconHtml}
          <div class="tab-info">
            <div class="tab-title">${titleHtml}</div>
            <div class="tab-url">${urlHtml}</div>
          </div>
          ${badges.length ? `<div class="tab-badges">${badges.join('')}</div>` : ''}
        </div>
      `;
    })
    .join('');

  // Garante que o item selecionado está visível
  const selected = tabList.querySelector('.tab-item.selected');
  if (selected) selected.scrollIntoView({ block: 'nearest' });
}

function filterTabs(query) {
  if (!query.trim()) {
    filteredTabs = allTabs
      .map((tab) => ({ tab, score: 0, titleIndices: [], urlIndices: [] }))
      .sort((a, b) => {
        const aLocal = a.tab.windowId === currentWindowId ? 0 : 1;
        const bLocal = b.tab.windowId === currentWindowId ? 0 : 1;
        return aLocal - bLocal;
      });
  } else {
    filteredTabs = allTabs
      .map((tab) => {
        const titleMatch = fuzzyMatch(tab.title, query);
        const urlMatch = fuzzyMatch(tab.url, query);

        if (!titleMatch.matched && !urlMatch.matched) return null;

        const score = Math.max(
          titleMatch.matched ? titleMatch.score + 10 : 0,
          urlMatch.matched ? urlMatch.score : 0
        );

        return {
          tab,
          score,
          titleIndices: titleMatch.matched ? titleMatch.indices : [],
          urlIndices: !titleMatch.matched && urlMatch.matched ? urlMatch.indices : [],
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  }

  selectedIndex = 0;
  renderTabs();
}

function switchToSelected() {
  const entry = filteredTabs[selectedIndex];
  if (!entry) return;
  searchInput.value = '';
  filterTabs('');
  chrome.runtime.sendMessage({
    type: 'SWITCH_TAB',
    tabId: entry.tab.id,
    windowId: entry.tab.windowId,
  });
}

// Carrega abas do service worker
chrome.runtime.sendMessage({ type: 'GET_TABS' }, (response) => {
  allTabs = response.tabs;
  currentWindowId = response.currentWindowId;
  filterTabs('');

  // Pré-seleciona a aba que estava ativa antes do popup abrir
  if (response.previousTabId) {
    const idx = filteredTabs.findIndex((e) => e.tab.id === response.previousTabId);
    if (idx !== -1) {
      selectedIndex = idx;
      renderTabs();
    }
  }

  searchInput.focus();
});

// Input de busca
searchInput.addEventListener('input', () => {
  filterTabs(searchInput.value);
});

// Navegação por teclado
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredTabs.length;
      renderTabs();
      break;

    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredTabs.length) % filteredTabs.length;
      renderTabs();
      break;

    case 'n':
      if (!e.ctrlKey) break;
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredTabs.length;
      renderTabs();
      break;

    case 'p':
      if (!e.ctrlKey) break;
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredTabs.length) % filteredTabs.length;
      renderTabs();
      break;

    case 'Enter':
      e.preventDefault();
      switchToSelected();
      break;

    case 'Delete':
      e.preventDefault();
      if (filteredTabs.length === 0) break;
      chrome.runtime.sendMessage({ type: 'CLOSE_TAB', tabId: filteredTabs[selectedIndex].tab.id }, (response) => {
        allTabs = response.tabs;
        filterTabs(searchInput.value);
        selectedIndex = Math.min(selectedIndex, filteredTabs.length - 1);
        renderTabs();
      });
      break;

    case 'Escape':
      e.preventDefault();
      chrome.runtime.sendMessage({ type: 'CLOSE_POPUP' });
      break;
  }
});

// Clique na aba
tabList.addEventListener('click', (e) => {
  const item = e.target.closest('.tab-item');
  if (!item) return;
  selectedIndex = parseInt(item.dataset.index, 10);
  switchToSelected();
});

// Hover atualiza seleção visual (sem mudar selectedIndex globalmente)
tabList.addEventListener('mouseover', (e) => {
  const item = e.target.closest('.tab-item');
  if (!item) return;
  document.querySelectorAll('.tab-item.selected').forEach((el) => el.classList.remove('selected'));
  item.classList.add('selected');
  selectedIndex = parseInt(item.dataset.index, 10);
});
