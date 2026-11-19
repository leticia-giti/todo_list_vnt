# To-Do List Avançada 🌸

Aplicação web de gerenciamento de tarefas desenvolvida com **HTML, CSS e JavaScript**. O projeto tem como objetivo aplicar e consolidar conceitos fundamentais e avançados de desenvolvimento web, incluindo manipulação do DOM, integração com APIs externas, algoritmos de busca e hospedagem.

🔗 **[Acesse o projeto ao vivo no GitHub Pages](https://leticia-giti.github.io/todo_list_vnt/)**

## Sobre o projeto

O To-Do List permite o gerenciamento de tarefas por meio de uma interface moderna e intuitiva.

O projeto está em constante evolução, acompanhando o aprendizado das tecnologias e incorporando funcionalidades, como assistente virtual com Inteligência Artificial, categorização e controle de prioridades.

## Funcionalidades

- [x] Adicionar tarefas
- [x] Listar tarefas
- [x] Marcar tarefas como concluídas
- [x] Remover tarefas
- [x] Editar tarefas existentes
- [x] Navegação entre seções com rolagem suave
- [x] Adicionar prioridade e categoria às tarefas
- [x] Definir tempo personalizável
- [x] Assistente de IA integrado (via API do ChatGPT)
- [x] Hospedagem online (GitHub Pages)
- [ ] Filtrar tarefas por status (Concluídas / Pendentes)
- [ ] Persistir tarefas utilizando `localStorage` ou Cookies
- [ ] Busca por proximidade (_Fuzzy Search_ com algoritmo de Distância de Levenshtein)
- [ ] Descrição detalhada da tarefa (botão "Ver mais")
- [ ] Dependência entre tarefas (ex.: Tarefa B só inicia após a Tarefa A)

> As funcionalidades são implementadas gradualmente durante o desenvolvimento do projeto.

## Tecnologias e Ferramentas

- **HTML5** — estruturação da aplicação.
- **CSS3** — estilização e construção do layout.
- **JavaScript (ES6+)** — implementação da lógica e interatividade.
- **OpenAI API (ChatGPT)** — integração do assistente de IA.
- **GitHub Pages** — hospedagem da aplicação.
- **Git e GitHub** — versionamento e gerenciamento do código-fonte.

## Conceitos praticados

Durante o desenvolvimento, estão sendo aplicados conceitos como:

- Estruturação semântica com HTML.
- Seletores, variáveis CSS e estilização avançada.
- Layout e responsividade (Flexbox, Grid e Media Queries).
- Posicionamento de elementos (`position: fixed`) e links de âncora (`href="#id"`).
- Rolagem suave (`scroll-behavior: smooth`).
- Programação Orientada a Objetos (classes e objetos).
- Manipulação do DOM e delegação de eventos.
- Consumo de APIs externas (`fetch`, `async/await` e `try/catch`).
- Algoritmos de busca e manipulação de strings (Levenshtein).
- Armazenamento de dados no navegador (`localStorage` e Cookies).

## Estrutura do projeto

```text
todo_list_vnt/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Como executar localmente

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/leticia-giti/todo_list_vnt.git
   ```

2. **Acesse o diretório do projeto:**

   ```bash
   cd todo_list_vnt
   ```

3. **Execute a aplicação:**

   Abra o arquivo `index.html` diretamente no navegador ou utilize a extensão Live Server no VS Code para executar a aplicação durante o desenvolvimento.

> **Nota:** Para testar a funcionalidade do assistente de IA localmente, pode ser necessário configurar uma chave de API válida. Evite expor chaves secretas diretamente no código-fonte ou em repositórios públicos.

## Próximos passos

- Implementar filtros visuais para tarefas concluídas e pendentes.
- Implementar busca inteligente (_Fuzzy Search_) utilizando a Distância de Levenshtein para tolerar erros de digitação.
- Adicionar campo de descrição detalhada com opção de expansão ("Ver mais").
- Criar sistema de dependência entre tarefas.
- Implementar persistência de dados com `localStorage` ou Cookies.
- Refatorar o código JavaScript para melhorar a modularização.

## Autores

**Letícia e Lucas**

- GitHub: [@leticia-giti](https://github.com/leticia-giti)
