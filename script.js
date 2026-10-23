// JavaScript inicial da To-do List
// Compatível com o HTML da Aula 07/08.

class Tarefa {
  constructor(titulo, tempo) {
    this.titulo = titulo;
    this.tempo = tempo;
    this.concluida = false;
  }

  concluir() {
    this.concluida = true;
  }
}

// Array de objetos: cada objeto representa uma tarefa.

const tarefa1 = new Tarefa("Revisar HTML", 5);
tarefa1.concluir();
const tarefa2 = new Tarefa("Revisar JavaScript", 6);
const tarefas = [tarefa1, tarefa2];

// Localizamos os elementos do HTML pelo id.
const formulario = document.querySelector("#form-tarefa");
const campoTarefa = document.querySelector("#nova-tarefa");
const campoTempo = document.querySelector("#tempo");
const listaTarefas = document.querySelector("#lista-tarefas");
const contador = document.querySelector("#contador");
const mensagem = document.querySelector("#mensagem");
const excluirItem = document.querySelector("#exclude");

/**
 * Atualiza o contador e a mensagem exibida na página.
 */
function atualizarResumo() {
  const total = tarefas.length;
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;
  const pendentes = calcularPendentes(total, concluidas);

  if (total === 0) {
    mensagem.innerText = "Lista vazia. Adicione uma tarefa!";
  } else if (pendentes === 0) {
    mensagem.innerText = "Parabéns!!!!! Todas as tarefas foram concluídas.";
  } else {
    mensagem.innerText = `${pendentes} tarefa(s) pendente(s). Vamos continuar?`;
  }

  const revisar = tarefas.filter((tarefa) => tarefa.titulo === "Revisar");
  const revisar2 = tarefas.find((tarefa) => tarefa.titulo === "Revisar");

  console.log(`REVISAR FILTER: ${revisar}
    REVISAR FIND: ${revisar2}
    `);
  contador.innerText = total;
}

/**
 * Calcular tarefas pendentes
 */
function calcularPendentes(total, concluidas) {
  return total - concluidas;
}

/**
 * Cria um elemento <li> para uma tarefa.
 */
function criarItemTarefa(tarefa) {
  const item = document.createElement("li");

  const { titulo, tempo, concluida } = tarefa;
  if (concluida) {
    item.innerText = `✓ ${titulo} — concluída  - ${tempo} gasto`;
    item.style.borderLeftColor = "#16835b";
    item.style.opacity = "0.7";
  } else {
    item.innerText = `${titulo}  - ${tempo} a gastar`;
  }

  return item;
}

/**
 * Apaga a lista visual e desenha novamente as tarefas do array.
 */
function renderizarTarefas() {
  listaTarefas.innerHTML = "";

  for (const tarefa of tarefas) {
    const item = criarItemTarefa(tarefa);
    listaTarefas.appendChild(item);
  }

  atualizarResumo();
}

/**
 * Formata o título da tarefa
 */
const formatarTarefa = (titulo) => titulo.trim();

/**
 * Adiciona uma nova tarefa ao array quando o formulário é enviado.
 */
formulario.addEventListener("submit", (evento) => {
  // Evita que o navegador recarregue a página.
  evento.preventDefault();
  try {
    const titulo = formatarTarefa(campoTarefa.value);
    const tempoTarefa = Number(campoTempo.value);
    console.log(tempoTarefa);
    if (!Number.isFinite(tempoTarefa) || tempoTarefa < 0) {
      console.log("Entrou no erro!!!");
      throw new Error("O tempo precisa ser um número não negativo!");
    }

    if (titulo === "") {
      mensagem.innerText = "Digite uma tarefa antes de adicionar.";
      campoTarefa.focus();
      return;
    }
    tarefas.push({
      titulo: titulo,
      tempo: tempoTarefa,
      concluida: false,
    });

    campoTarefa.value = "";
    campoTempo.value = "";
    campoTarefa.focus();
    renderizarTarefas();
  } catch (error) {
    mensagem.innerText = error.message;
    campoTempo.value = "";
    campoTempo.focus();
  }
});

/**
 * Excluir uma tarefa do array quando o formulário é enviado
 */
excluirItem.addEventListener("click", () => {
  tarefas.shift();
  renderizarTarefas();
});

// Primeira renderização ao carregar a página.
renderizarTarefas();
