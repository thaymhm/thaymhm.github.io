# Fontes do site

Os arquivos `.woff2` desta pasta são hospedados no próprio site, em vez de
carregados do Google Fonts. Isso evita que o navegador de quem visita faça
requisição para servidor de terceiro só para desenhar texto.

Todos vêm dos pacotes `@fontsource` correspondentes, no subconjunto `latin`,
que é o que o português usa. As declarações `@font-face` estão em
`assets/css/fonts.css`.

| Família | Pesos aqui | Onde aparece no site |
|---|---|---|
| Sora | 400, 600, 700 | Títulos, manchetes, botões |
| Inter | 400, 500, 600 | Texto corrido |
| IBM Plex Mono | 400, 500 | Tags, metadados, linhas de reforço |

## Licenças

As três famílias são distribuídas sob a **SIL Open Font License 1.1**, que
permite uso, modificação e redistribuição, inclusive em site comercial, desde
que as fontes não sejam vendidas isoladamente e o aviso de licença seja
mantido junto dos arquivos. É o que este arquivo faz.

- **Sora**: Copyright 2019 The Sora Project Authors
  (https://github.com/sora-xor/sora-font)
- **Inter**: Copyright 2016 The Inter Project Authors
  (https://github.com/rsms/inter)
- **IBM Plex Mono**: Copyright 2017 IBM Corp.
  (https://github.com/IBM/plex)

Texto completo da licença: https://scripts.sil.org/OFL

## Como trocar ou acrescentar um peso

```
npm pack @fontsource/sora
```

Descompacte, pegue o arquivo `files/sora-latin-<peso>-normal.woff2`, coloque
nesta pasta e acrescente o bloco `@font-face` correspondente em
`assets/css/fonts.css`. Cada peso novo é um arquivo a mais para o visitante
baixar, então só acrescente o que for mesmo usar.
