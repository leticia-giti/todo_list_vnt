// JavaScript inicial da To-do List
// Compatível com o HTML da Aula 07/08.

class Tarefa {
  /**
   * O constructor é chamado toda vez que usamos 'new Tarefa(...)'.
   * @param {string} titulo 
   * @param {number} tempo 
   */
  constructor(titulo, tempo) {
    this.titulo = titulo;       
    this.tempo = tempo;        
    this.concluida = false;    
  }

  
  concluir() {
    this.concluida = true;
  }
}

const tarefa1 = new Tarefa("Revisar HTML", 5);
tarefa1.concluir();
const tarefa2 = new Tarefa("Revisar JavaScript", 6);
const tarefas = [tarefa1, tarefa2];
const formulario = document.querySelector("#form-tarefa");   
const campoTarefa = document.querySelector("#nova-tarefa");   
const campoTempo = document.querySelector("#tempo");          
const listaTarefas = document.querySelector("#lista-tarefas");
const contador = document.querySelector("#contador");         
const mensagem = document.querySelector("#mensagem");         
const excluirItem = document.querySelector("#exclude");       


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
 * Função utilitária que calcula quantas tarefas ainda faltam concluir.
 * @param {number} total 
 * @param {number} concluidas 
 * @returns {number} quantidade de tarefas pendentes
 */
function calcularPendentes(total, concluidas) {
  return total - concluidas;
}

/**
 * Cria e configura dinamicamente um elemento <li> HTML para representar uma tarefa visualmente.
 * @param {Object} tarefa 
 * @returns {HTMLLIElement}
 */
function criarItemTarefa(tarefa) {
  const item = document.createElement("li");
  const lixeira = document.createElement('button');
  const textoTarefa = document.createElement("span");
  const { titulo, tempo, concluida } = tarefa;

  lixeira.innerText = "🗑️"; 
  lixeira.classList.add("btn-lixeira"); 
  
  if (concluida) {
    textoTarefa.innerText = `✓ ${titulo} — concluída - ${tempo} gasto`;
    item.style.borderLeftColor = "#16835b";
    item.style.opacity = "0.7";
    textoTarefa.style.textDecoration = "line-through"; 
  } else {
    textoTarefa.innerText = `${titulo} - ${tempo} a gastar`;
  }

  textoTarefa.addEventListener("click", () => {
    tarefa.concluida = !tarefa.concluida; 
    renderizarTarefas(); 
  });
  
  textoTarefa.style.cursor = "pointer";

  lixeira.addEventListener('click', () => {
    const indice = tarefas.indexOf(tarefa);
    if (indice !== -1) {
      tarefas.splice(indice, 1);
    }
    renderizarTarefas();
  });

  item.appendChild(textoTarefa);
  item.appendChild(lixeira);

  return item;
}


function renderizarTarefas() {
  listaTarefas.innerHTML = "";

  for (const tarefa of tarefas) {
    const item = criarItemTarefa(tarefa);
    listaTarefas.appendChild(item);
  }

  atualizarResumo();
}

const formatarTarefa = (titulo) => titulo.trim();

formulario.addEventListener("submit", (evento) => {
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

excluirItem.addEventListener("click", () => {
  tarefas.shift();

  renderizarTarefas();
});

renderizarTarefas();
