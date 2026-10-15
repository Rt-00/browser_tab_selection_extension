-- Regra do Hyprland (config em Lua, 0.55+) para o popup do Tab Selector.
-- Troque <EXTENSION_ID> pelo ID mostrado em brave://extensions (ou chrome://extensions).
-- No Wayland o navegador abre o popup com a classe <navegador>-<EXTENSION_ID>-<perfil>,
-- e sem esta regra o Hyprland o trata como uma janela comum (tile).
o.window("^(brave|chrom(e|ium)|google-chrome)-<EXTENSION_ID>-.*$", {
  float = true,
  center = true,
  size = { 640, 500 },
  focus_on_activate = true,
})
