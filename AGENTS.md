# InnerFormValidation

## Regras do projeto

- Preserve a API standalone em `window.InnerFormValidation`.
- Mantenha a compatibilidade com `$.innerForm` e os métodos `jQuery.fn` quando jQuery estiver carregado.
- Prefira JavaScript nativo, DOM acessível e mudanças pequenas nas regras de validação.
- A documentação publicada fica em `docs/` e deve permanecer responsiva, indexável e disponível em pt-BR, inglês e espanhol.

## Estrutura

- `InnerFormValidation.js`: biblioteca e adaptador jQuery opcional.
- `docs/`: site interativo de documentação, SEO, `llms.txt`, sitemap e robots.
- `README.md`: visão geral e quickstart.
