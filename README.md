# Tab Selector

Extensão para Chrome/Brave que abre um seletor de abas estilo VSCode — busca fuzzy, navegação por teclado, zero dependências externas.

![Tab Selector](docs/_screenshot.png)

## Funcionalidades

- Busca fuzzy por título e URL das abas abertas
- Navegação inteiramente por teclado
- Destaca os caracteres que fazem match na busca
- Mostra favicon, badge de aba ativa e badge de áudio
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

| Ação | Como |
|------|------|
| Abrir o seletor | `Ctrl+Q` (Windows/Linux) · `Cmd+Q` (Mac) · clique no ícone |
| Navegar na lista | `↑` / `↓` |
| Abrir a aba selecionada | `Enter` |
| Fechar | `Esc` |

> O atalho pode ser alterado em `chrome://extensions/shortcuts`.

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
