# Tab Selector

Extensão para Chrome/Brave que abre um seletor de abas estilo VSCode — busca fuzzy, navegação por teclado, zero dependências externas.

![Tab Selector](icons/icon128.png)

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
   git clone https://github.com/seu-usuario/tab-selector.git
   ```
2. Acesse `chrome://extensions` (ou `brave://extensions`)
3. Ative **Modo do desenvolvedor** no canto superior direito
4. Clique em **Carregar sem compactação** e selecione a pasta `tab-selector`

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
tab-selector/
├── manifest.json       # Configuração da extensão (Manifest V3)
├── service-worker.js   # Background: atalho, abertura do popup, troca de abas
├── icons/              # Ícones da extensão (16, 32, 48, 128px)
└── popup/
    ├── popup.html
    ├── popup.css
    └── popup.js        # Busca fuzzy + renderização + navegação por teclado
```

## Licença

MIT
