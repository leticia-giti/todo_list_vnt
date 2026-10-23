# 📘 Tutorial de Evolução da To-Do List

Bem-vindo(a) ao seu guia prático de aprendizado! Este documento foi elaborado para que **você** coloque a mão na massa, entenda o funcionamento do código e implemente novas funcionalidades no seu ritmo, entendendo o porquê de cada linha.

---

## 🧭 Sumário

1. [Parte 1: Customizando o Visual (Cores, Fontes e Efeitos)](#-parte-1-customizando-o-visual)
   - [Trabalhando com Variáveis CSS (`:root`)](#1-trabalhando-com-variáveis-css-root)
   - [Sugestões de Paletas de Cores (Dark Mode, Pastel, etc.)](#2-sugestões-de-paletas-de-cores)
   - [Como alterar e importar novas fontes (Google Fonts)](#3-como-alterar-e-importar-novas-fontes)
   - [Melhorando os efeitos visuais dos itens da lista](#4-melhorando-os-efeitos-visuais-dos-itens)
2. [Parte 2: Seleção e Exclusão de Tarefas Específicas](#-parte-2-seleção-e-exclusão-de-tarefas-específicas)
   - [Entendendo o problema do código atual](#1-o-problema-atual-tarefasshift)
   - [Abordagem A: Botão de exclusão individual por item (🗑️)](#2-abordagem-a-botão-de-exclusão-individual-por-tarefa)
   - [Abordagem B: Caixa de seleção (Checkbox) + Botão de exclusão em massa](#3-abordagem-b-seleção-com-checkbox-e-exclusão-em-massa)
3. [Parte 3: Arrastar e Reordenar Elementos (Drag & Drop)](#-parte-3-arrastar-e-reordenar-elementos-drag--drop)
   - [Como funciona a API nativa de Drag & Drop do HTML5](#1-o-conceito-do-drag--drop-nativo)
   - [Passo 1: Estilos visuais para o arrasto no CSS](#2-passo-1-estilos-visuais-no-css)
   - [Passo 2: Configurando os eventos de arrastar no JavaScript](#3-passo-2-configurando-os-eventos-no-javascript)
   - [Passo 3: Reordenando os itens no Array e atualizando a tela](#4-passo-3-reordenando-o-array-e-atualizando-a-tela)
4. [Parte 4: Dicas de Depuração e Próximos Desafios](#-parte-4-dicas-de-depuração-e-próximos-passos)

---

## 🎨 Parte 1: Customizando o Visual

### 1. Trabalhando com Variáveis CSS (`:root`)

No topo do seu arquivo `style.css`, você já possui um bloco `:root`. As variáveis CSS começam sempre com dois traços (`--nome-da-variavel`).

Para usá-las em qualquer lugar do CSS, usamos a função `var(--nome-da-variavel)`. A grande vantagem é que, ao mudar uma cor no `:root`, **toda a interface muda automaticamente**.

```css
:root {
  --cor-fundo: #f4f7fb;
  --cor-cartao: #ffffff;
  --cor-principal: #635bff;
  --cor-principal-hover: #4f46e5;
  --cor-texto: #202235;
  --cor-texto-secundario: #6b7280;
  --cor-borda: #dfe3ec;
  --cor-sucesso: #16835b;
}
```

---

### 2. Sugestões de Paletas de Cores

Experimente substituir os valores do `:root` no `style.css` por uma das opções abaixo para ver a mudança imediata:

#### 🌙 Opção 1: Dark Mode Moderno (Modo Escuro)
```css
:root {
  --cor-fundo: #0f172a;            /* Azul escuro profundo */
  --cor-cartao: #1e293b;           /* Cartão em tom grafite */
  --cor-principal: #38bdf8;        /* Azul ciano brilhante */
  --cor-principal-hover: #0ea5e9;  /* Azul vivo no hover */
  --cor-texto: #f8fafc;            /* Texto branco gelo */
  --cor-texto-secundario: #94a3b8; /* Cinza claro suave */
  --cor-borda: #334155;            /* Borda discreta */
  --cor-sucesso: #4ade80;          /* Verde neon */
  --sombra: 0 14px 35px rgba(0, 0, 0, 0.45);
}
```

#### 🌿 Opção 2: Minimalista Natureza (Tons Terrosos e Verdes)
```css
:root {
  --cor-fundo: #f2f5f3;
  --cor-cartao: #ffffff;
  --cor-principal: #2d6a4f;        /* Verde floresta */
  --cor-principal-hover: #1b4332;  /* Verde escuro */
  --cor-texto: #1f2421;
  --cor-texto-secundario: #52796f;
  --cor-borda: #d8f3dc;
  --cor-sucesso: #40916c;
  --sombra: 0 12px 30px rgba(45, 106, 79, 0.08);
}
```

---

### 3. Como alterar e importar novas fontes

Por padrão, o arquivo `style.css` utiliza fontes genéricas do sistema:
```css
font-family: Arial, Helvetica, sans-serif;
```

Para usar fontes modernas do [Google Fonts](https://fonts.google.com/) (como **Poppins**, **Inter** ou **Plus Jakarta Sans**):

#### Passo A: Importar no `<head>` do `index.html`
Abra o `index.html` e cole o link do Google Fonts antes do `<link rel="stylesheet" href="style.css">`:

```html
<!-- Importando a fonte Inter do Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Passo B: Aplicar no `style.css`
No seletor `body` do `style.css`, substitua a linha do `font-family`:

```css
body {
  /* ... outros estilos ... */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

### 4. Melhorando os efeitos visuais dos itens

Para deixar a lista mais dinâmica e responsiva às ações do mouse, você pode adicionar efeitos de hover nos itens da lista no `style.css`:

```css
/* Efeito de destaque ao passar o mouse sobre cada tarefa */
#lista-tarefas li {
  padding: 14px 16px;
  border-left: 4px solid var(--cor-principal);
  border-radius: 8px;
  background: #f7f7ff;
  font-size: 1rem;
  
  /* Transição suave para qualquer mudança de posição e sombra */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

#lista-tarefas li:hover {
  transform: translateX(4px); /* Desloca o item 4px para a direita */
  box-shadow: 0 4px 12px rgba(99, 91, 255, 0.12);
}
```

---

## 🗑️ Parte 2: Seleção e Exclusão de Tarefas Específicas

### 1. O problema atual: `tarefas.shift()`

Atualmente, no seu `script.js`, existe o seguinte código:

```javascript
excluirItem.addEventListener("click", () => {
  tarefas.shift(); // O método .shift() remove sempre o PRIMEIRO item do array!
  renderizarTarefas();
});
```
Se você tiver 5 tarefas e quiser apagar a 3ª, não conseguirá: o botão sempre apaga a 1ª da fila.

Existem duas formas excelentes de resolver isso. Escolha a que melhor se adapta à experiência que você quer construir:

---

### 2. Abordagem A: Botão de exclusão individual por tarefa (Recomendada para começar)

Nesta abordagem, cada tarefa terá seu próprio botão "Excluir" (ou um ícone 🗑️). Ao clicar nele, **apenas aquela tarefa específica** é removida.

#### Como fazer:

1. Modifique a função `criarItemTarefa` no seu `script.js` para receber também a posição (`indice`) do item na lista:

```javascript
// Note que agora recebemos 'tarefa' e 'indice'
function criarItemTarefa(tarefa, indice) {
  const item = document.createElement("li");
  const { titulo, tempo, concluida } = tarefa;

  // Cria um elemento span para guardar o texto da tarefa
  const textoTarefa = document.createElement("span");
  if (concluida) {
    textoTarefa.innerText = `✓ ${titulo} — concluída - ${tempo} gasto`;
    item.style.borderLeftColor = "#16835b";
    item.style.opacity = "0.7";
  } else {
    textoTarefa.innerText = `${titulo} - ${tempo} a gastar`;
  }

  // Cria um botão de exclusão exclusivo para este item
  const botaoExcluir = document.createElement("button");
  botaoExcluir.innerText = "✕"; // ou "Excluir" ou "🗑️"
  botaoExcluir.title = "Excluir esta tarefa";
  botaoExcluir.className = "btn-excluir-item";

  // Evento de clique para remover esta tarefa do array
  botaoExcluir.addEventListener("click", () => {
    // .splice(indice, 1) remove 1 elemento a partir da posição 'indice'
    tarefas.splice(indice, 1);
    
    // Atualiza a tela após remover
    renderizarTarefas();
  });

  // Adiciona o texto e o botão dentro do <li>
  item.appendChild(textoTarefa);
  item.appendChild(botaoExcluir);

  return item;
}
```

2. Na função `renderizarTarefas()`, atualize o loop para passar o índice de cada tarefa:

```javascript
function renderizarTarefas() {
  listaTarefas.innerHTML = "";

  // O método forEach passa o elemento (tarefa) e a sua posição no array (indice)
  tarefas.forEach((tarefa, indice) => {
    const item = criarItemTarefa(tarefa, indice);
    listaTarefas.appendChild(item);
  });

  atualizarResumo();
}
```

3. No `style.css`, organize o item com `display: flex` para que o texto fique à esquerda e o botão à direita:

```css
#lista-tarefas li {
  display: flex;
  justify-content: space-between; /* Afasta o texto para a esquerda e o botão para a direita */
  align-items: center;            /* Alinha verticalmente no centro */
  padding: 12px 16px;
  border-left: 4px solid var(--cor-principal);
  border-radius: 8px;
  background: #f7f7ff;
}

/* Botão individual de exclusão */
.btn-excluir-item {
  background: #ef4444; /* Vermelho */
  color: white;
  border: 0;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.85rem;
  cursor: pointer;
  margin: 0;
}

.btn-excluir-item:hover {
  background: #dc2626; /* Vermelho mais escuro no hover */
}
```

---

### 3. Abordagem B: Seleção com Checkbox e exclusão em massa

Se você prefere que o usuário marque caixas de seleção (checkboxes) e depois clique em um botão "Excluir Selecionadas":

1. Adicione a propriedade `selecionada: false` na classe `Tarefa`:
```javascript
class Tarefa {
  constructor(titulo, tempo) {
    this.titulo = titulo;
    this.tempo = tempo;
    this.concluida = false;
    this.selecionada = false; // Novo controle de seleção
  }
}
```

2. Dentro de `criarItemTarefa`, crie um `<input type="checkbox">`:
```javascript
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = tarefa.selecionada;

// Quando o usuário marcar ou desmarcar a caixinha:
checkbox.addEventListener("change", (e) => {
  tarefa.selecionada = e.target.checked;
});

// Insira o checkbox no início do <li> antes do texto
item.prepend(checkbox);
```

3. Modifique o evento do botão `#exclude` no `script.js` para filtrar apenas o que **NÃO** foi selecionado:
```javascript
excluirItem.addEventListener("click", () => {
  // Mantemos no array apenas as tarefas cujo 'selecionada' é false
  // Dica: como 'tarefas' foi declarado como 'const', altere para 'let tarefas = [...]' no topo do script.js
  tarefas = tarefas.filter((tarefa) => !tarefa.selecionada);

  // Redesenha a lista atualizada
  renderizarTarefas();
});
```

---

## ✋ Parte 3: Arrastar e Reordenar Elementos (Drag & Drop)

O HTML5 possui uma API nativa excelente para arrastar e soltar elementos chamada **HTML Drag and Drop API**.

### 1. O conceito do Drag & Drop nativo

Para tornar um elemento arrastável, precisamos de três coisas:
1. Definir o atributo HTML `draggable="true"` no elemento `<li>`.
2. Escutar quando o usuário **começou a arrastar** (`dragstart`).
3. Escutar quando o usuário **arrasta por cima de outro item** (`dragover`) e **solta o item** (`drop`).

---

### 2. Passo 1: Estilos visuais no CSS

Adicione estas classes ao seu `style.css` para que o usuário veja visualmente o que está acontecendo enquanto arrasta:

```css
/* O cursor vira a 'mão de segurar' indicando que o elemento pode ser arrastado */
#lista-tarefas li {
  cursor: grab;
}

#lista-tarefas li:active {
  cursor: grabbing;
}

/* Estilo aplicado no item que está sendo puxado no ar */
#lista-tarefas li.arrastando {
  opacity: 0.35;
  border: 2px dashed var(--cor-principal);
}

/* Linha azul destacada indicando onde o item vai cair */
#lista-tarefas li.drag-over {
  border-top: 3px solid var(--cor-principal);
}
```

---

### 3. Passo 2: Configurando os eventos no JavaScript

No seu `script.js`, declare uma variável global para memorizar qual item está sendo arrastado:

```javascript
// Variável que guarda o índice do item que está sendo arrastado
let itemArrastadoIndice = null;
```

Agora, dentro da função `criarItemTarefa(tarefa, indice)`, adicione os eventos de arrasto:

```javascript
function criarItemTarefa(tarefa, indice) {
  const item = document.createElement("li");

  // 1. Torna o <li> arrastável
  item.draggable = true;

  // 2. Quando o usuário INICIA o arrasto:
  item.addEventListener("dragstart", () => {
    itemArrastadoIndice = indice; // Salva o índice de quem está sendo arrastado
    item.classList.add("arrastando");
  });

  // 3. Quando o arrasto TERMINA (soltou ou cancelou):
  item.addEventListener("dragend", () => {
    item.classList.remove("arrastando");
  });

  // 4. Quando o item arrastado passa POR CIMA de outro item da lista:
  item.addEventListener("dragover", (evento) => {
    // OBRIGATÓRIO: preventDefault() permite que o navegador aceite a soltura (drop)
    evento.preventDefault();
    item.classList.add("drag-over");
  });

  // 5. Quando o item sai de cima sem soltar:
  item.addEventListener("dragleave", () => {
    item.classList.remove("drag-over");
  });

  // 6. Quando o item é SOLTO (drop) sobre este item:
  item.addEventListener("drop", (evento) => {
    evento.preventDefault();
    item.classList.remove("drag-over");

    // Reordena o array e atualiza a tela!
    reordenarTarefas(itemArrastadoIndice, indice);
  });

  // ... (restante do código da criação da tarefa) ...
  return item;
}
```

---

### 4. Passo 3: Reordenando o Array e atualizando a tela

Crie a função auxiliar `reordenarTarefas` no seu `script.js`:

```javascript
/**
 * Remove o item da posição de origem e o insere na nova posição de destino.
 * @param {number} origem - Índice do item que foi puxado
 * @param {number} destino - Índice do item onde foi solto
 */
function reordenarTarefas(origem, destino) {
  // Se soltou em cima dele mesmo, não precisa fazer nada
  if (origem === destino || origem === null) return;

  // 1. Remove o item da posição de origem e guarda em uma constante
  const [tarefaMovida] = tarefas.splice(origem, 1);

  // 2. Insere o item na nova posição de destino
  tarefas.splice(destino, 0, tarefaMovida);

  // 3. Redesenha a lista na tela com a nova ordem!
  renderizarTarefas();
}
```

> 💡 **Como o `.splice()` funciona nessa função?**
> - `tarefas.splice(origem, 1)`: remove 1 elemento na posição `origem` e o retorna.
> - `tarefas.splice(destino, 0, tarefaMovida)`: na posição `destino`, remove `0` elementos e insere a `tarefaMovida`.

---

## 🚀 Parte 4: Dicas de Depuração e Próximos Passos

### Como testar e encontrar erros como um desenvolvedor:
1. **Abra o Console do Navegador**: Pressione `F12` (ou `Ctrl + Shift + I`) e vá para a aba **Console**. Qualquer erro de digitação de JavaScript aparecerá em vermelho com o número exato da linha!
2. **Use `console.log()`**: Se uma função não estiver fazendo o que você espera, adicione `console.log("Variável X:", x)` para inspecionar os valores passo a passo.

### Desafios extras para o seu aprendizado:
- [ ] **Marcar como concluída ao clicar**: Adicione um clique no texto da tarefa que execute `tarefa.concluir()` e depois chame `renderizarTarefas()`.
- [ ] **Persistência com LocalStorage**: Salve as tarefas no navegador usando `localStorage.setItem('tarefas', JSON.stringify(tarefas))` para que elas não sumam ao dar F5 na página!

Bons estudos e mãos ao código! 💻✨
