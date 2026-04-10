# Tab Selector

Extensão para Chrome/Brave que abre um seletor de abas estilo VSCode — busca fuzzy, navegação por teclado, zero dependências externas.

![Tab Selector](docs/_screenshot.png)

## Funcionalidades

- Busca fuzzy por título e URL das abas abertas, com destaque dos caracteres que fazem match
- Navegação inteiramente por teclado — setas ou atalhos estilo vim (`Ctrl+N` / `Ctrl+P`)
- Navegação circular: ao chegar no final da lista, volta ao início (e vice-versa)
- Pré-seleciona a aba anterior ao abrir — `Enter` imediato alterna entre as duas últimas abas (comportamento Alt+Tab)
- Abas da janela atual aparecem primeiro na lista padrão
- Fecha abas diretamente pelo seletor com `Delete`, sem precisar abrir cada uma
- Exibe favicon, badge de aba ativa e badge de áudio
- Contador de resultados no rodapé (`X de Y` durante a busca)
- Abre centralizado na janela atual
- Funciona em qualquer página, incluindo `chrome://` e PDFs

## Instalação

### Via Chrome Web Store

*(em breve)*

### Manual (modo desenvolvedor)

1. Clone o repositório:
   ```bash
   git clone https://github.com/Rt-00/browser_tab_selection_extension.git
   ```
2. Acesse `chrome://extensions` (ou `brave://extensions`)
3. Ative **Modo do desenvolvedor** no canto superior direito
4. Clique em **Carregar sem compactação** e selecione a pasta `browser_tab_selection_extension`

## Uso

| Ação | Atalho |
|------|--------|
| Abrir o seletor | `Ctrl+Q` (Windows/Linux) · `Cmd+Q` (Mac) · clique no ícone |
| Navegar na lista | `↑` / `↓` · `Ctrl+N` / `Ctrl+P` |
| Abrir a aba selecionada | `Enter` |
| Fechar aba selecionada | `Delete` |
| Fechar o seletor | `Esc` |

> O atalho de abertura pode ser alterado em `chrome://extensions/shortcuts`.

## Estrutura do projeto

```
browser_tab_selection_extension/
├── manifest.json       # Configuração da extensão (Manifest V3)
├── service-worker.js   # Background: atalho, abertura do popup, troca de abas
├── docs/               # Arquivos utilizados no README.md
├── icons/              # Ícones da extensão (16, 32, 48, 128px)
└── popup/
    ├── popup.html
    ├── popup.css
    └── popup.js        # Busca fuzzy + renderização + navegação por teclado
```

## Licença

MIT
