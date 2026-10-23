// JavaScript inicial da To-do List
// Compatível com o HTML da Aula 07/08.

/**
 * ============================================================================
 * 1. MODELO DE DADOS (CLASSE TAREFA)
 * ============================================================================
 * Usamos a sintaxe de 'class' (Programação Orientada a Objetos) como um molde
 * para criar objetos de tarefas com as mesmas propriedades e comportamentos.
 */
class Tarefa {
  /**
   * O constructor é chamado toda vez que usamos 'new Tarefa(...)'.
   * @param {string} titulo - O nome ou descrição da tarefa.
   * @param {number} tempo - O tempo estimado ou gasto na tarefa.
   */
  constructor(titulo, tempo) {
    this.titulo = titulo;       // Guarda o texto da tarefa nesta instância
    this.tempo = tempo;         // Guarda o tempo da tarefa
    this.concluida = false;     // Toda nova tarefa começa como pendente (false)
  }

  /**
   * Método para marcar a tarefa atual como concluída.
   */
  concluir() {
    this.concluida = true;
  }
}

/**
 * ============================================================================
 * 2. ESTADO DA APLICAÇÃO (DADOS NA MEMÓRIA)
 * ============================================================================
 * Criamos tarefas de exemplo e as armazenamos em um Array chamado 'tarefas'.
 * É esse array que representa a "fonte da verdade" do nosso aplicativo.
 */
const tarefa1 = new Tarefa("Revisar HTML", 5);
tarefa1.concluir(); // Marca a primeira tarefa como concluída para exemplo inicial
const tarefa2 = new Tarefa("Revisar JavaScript", 6);

// O array 'tarefas' guarda a lista de todas as tarefas cadastradas
const tarefas = [tarefa1, tarefa2];

/**
 * ============================================================================
 * 3. SELEÇÃO DE ELEMENTOS DO DOM (HTML)
 * ============================================================================
 * document.querySelector() busca elementos na página usando seletores CSS (como '#id').
 * Guardamos esses elementos em constantes para que possamos manipulá-los no código.
 */
const formulario = document.querySelector("#form-tarefa");    // O formulário de cadastro
const campoTarefa = document.querySelector("#nova-tarefa");   // O campo <input> do texto da tarefa
const campoTempo = document.querySelector("#tempo");          // O campo <input> do tempo
const listaTarefas = document.querySelector("#lista-tarefas");// A lista <ul> onde os itens vão aparecer
const contador = document.querySelector("#contador");         // O elemento <strong> com o total de tarefas
const mensagem = document.querySelector("#mensagem");         // O parágrafo de feedback e status
const excluirItem = document.querySelector("#exclude");       // O botão "Excluir"

/**
 * ============================================================================
 * 4. FUNÇÕES DE CÁLCULO E ATUALIZAÇÃO DA INTERFACE
 * ============================================================================
 */

/**
 * Atualiza o texto do contador numérico e a mensagem motivacional exibida na tela.
 */
function atualizarResumo() {
  const total = tarefas.length; // Quantidade total de itens no array

  // O método .filter() cria um novo array contendo apenas as tarefas que atendem à condição (tarefa.concluida === true)
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;

  // Chama a função auxiliar para subtrair as concluídas do total
  const pendentes = calcularPendentes(total, concluidas);

  // Altera o texto da mensagem com base no estado atual da lista
  if (total === 0) {
    mensagem.innerText = "Lista vazia. Adicione uma tarefa!";
  } else if (pendentes === 0) {
    mensagem.innerText = "Parabéns!!!!! Todas as tarefas foram concluídas.";
  } else {
    // Template literal (delimitado por crases ``) permite interpolar variáveis facilmente com ${}
    mensagem.innerText = `${pendentes} tarefa(s) pendente(s). Vamos continuar?`;
  }

  // Exemplos de métodos de array:
  // .filter() retorna todas as tarefas encontradas em formato de array
  const revisar = tarefas.filter((tarefa) => tarefa.titulo === "Revisar");
  // .find() retorna o PRIMEIRO objeto que bate com a busca, ou undefined se não achar
  const revisar2 = tarefas.find((tarefa) => tarefa.titulo === "Revisar");

  console.log(`REVISAR FILTER: ${revisar}
    REVISAR FIND: ${revisar2}
    `);

  // Atualiza o número dentro do elemento <strong> na página
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
 * @param {Object} tarefa - O objeto contendo titulo, tempo e status de conclusao
 * @returns {HTMLLIElement} O elemento <li> pronto para ser inserido na página
 */
function criarItemTarefa(tarefa) {
  // document.createElement() cria um novo elemento HTML na memória do navegador
  const item = document.createElement("li");

  // Desestruturação (Destructuring): extrai as propriedades do objeto diretamente em variáveis
  const { titulo, tempo, concluida } = tarefa;

  if (concluida) {
    // Se a tarefa foi concluída, adiciona o símbolo de 'check', muda a borda para verde e diminui a opacidade
    item.innerText = `✓ ${titulo} — concluída  - ${tempo} gasto`;
    item.style.borderLeftColor = "#16835b";
    item.style.opacity = "0.7";
  } else {
    // Se está pendente, exibe o tempo a gastar normalmente
    item.innerText = `${titulo}  - ${tempo} a gastar`;
  }

  return item;
}

/**
 * Renderiza (desenha) todas as tarefas do array na tela.
 * Técnica: Limpa a lista inteira e reconstrói elemento por elemento para manter a tela sempre sincronizada com o array.
 */
function renderizarTarefas() {
  // Apaga todo o conteúdo HTML existente dentro da <ul>
  listaTarefas.innerHTML = "";

  // Percorre cada objeto 'tarefa' do array usando o loop 'for...of'
  for (const tarefa of tarefas) {
    const item = criarItemTarefa(tarefa);
    // appendChild() insere o novo <li> como filho da nossa <ul>
    listaTarefas.appendChild(item);
  }

  // Atualiza os contadores e mensagens de status
  atualizarResumo();
}

/**
 * Função em formato arrow function que remove espaços em branco extras do início e fim do texto com .trim()
 */
const formatarTarefa = (titulo) => titulo.trim();

/**
 * ============================================================================
 * 5. TRATAMENTO DE EVENTOS (INTERAÇÃO DO USUÁRIO)
 * ============================================================================
 */

/**
 * Escuta quando o usuário envia o formulário (clicando no botão "Adicionar" ou apertando Enter).
 */
formulario.addEventListener("submit", (evento) => {
  // Por padrão, ao enviar um formulário o navegador recarrega a página.
  // evento.preventDefault() impede esse comportamento padrão para mantermos os dados em tela.
  evento.preventDefault();

  // O bloco try...catch serve para tratar possíveis erros de validação sem travar o aplicativo
  try {
    const titulo = formatarTarefa(campoTarefa.value);
    const tempoTarefa = Number(campoTempo.value); // Converte o texto digitado para número

    console.log(tempoTarefa);

    // Validação: verifica se não é um número válido ou se é negativo
    if (!Number.isFinite(tempoTarefa) || tempoTarefa < 0) {
      console.log("Entrou no erro!!!");
      // Lança um erro propositalmente, que será capturado pelo bloco 'catch' logo abaixo
      throw new Error("O tempo precisa ser um número não negativo!");
    }

    // Validação: impede a inserção de tarefas com texto vazio
    if (titulo === "") {
      mensagem.innerText = "Digite uma tarefa antes de adicionar.";
      campoTarefa.focus();
      return; // Interrompe a execução da função aqui
    }

    // Adiciona o novo objeto de tarefa ao final do array usando .push()
    tarefas.push({
      titulo: titulo,
      tempo: tempoTarefa,
      concluida: false,
    });

    // Limpa os campos de texto do formulário para o próximo preenchimento
    campoTarefa.value = "";
    campoTempo.value = "";

    // Coloca o cursor de digitação de volta no campo de tarefa para agilidade do usuário
    campoTarefa.focus();

    // Redesenha a lista na tela com o novo item adicionado
    renderizarTarefas();
  } catch (error) {
    // Se algum erro foi lançado no 'try', o 'catch' recebe o erro e exibe a mensagem na interface
    mensagem.innerText = error.message;
    campoTempo.value = "";
    campoTempo.focus();
  }
});

/**
 * Escuta o clique no botão "Excluir".
 * Atualmente, utiliza tarefas.shift(), que remove o primeiro item do array.
 */
excluirItem.addEventListener("click", () => {
  // .shift() remove o primeiro elemento de um array
  tarefas.shift();

  // Atualiza a visualização da tela
  renderizarTarefas();
});

/**
 * ============================================================================
 * 6. INICIALIZAÇÃO
 * ============================================================================
 * Chamada inicial para desenhar as tarefas de exemplo na tela assim que o script é carregado.
 */
renderizarTarefas();
