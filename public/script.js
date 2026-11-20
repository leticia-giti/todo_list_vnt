// configurações fixas do projeto
const CHAVE_STORAGE = 'inotes-tarefas-v1';
const PRIORIDADES = ['alta', 'media', 'baixa'];
const CATEGORIAS = ['estudos', 'trabalho', 'pessoal', 'saude', 'casa', 'compras', 'outros'];

// atalho para selecionar elementos do HTML
const $ = (seletor) => document.querySelector(seletor);

// elementos principais da interface
const listaTarefas = $('#lista-tarefas');
const mensagem = $('#mensagem');
const dialogEditar = $('#dialog-editar');
const abrirIA = $('#abrir-ia');
const painelIA = $('#painel-ia');

// variáveis de estado da aplicação
let filtro = 'todas';
let termoBusca = ''; // NOVO: guarda o que o usuário digitou na busca
let sugestoes = [];
let tarefaEmEdicao = null;

// modelo que guarda as informações de cada tarefa
class Tarefa {
  constructor({ titulo, tempo_minutos = null, tempo_estimado = false, prioridade = 'media', categoria = 'outros', data = null, horario = null, concluida = false, id = null }) {
    this.id = id || crypto.randomUUID();
    this.titulo = titulo;
    this.tempo = tempo_minutos;
    this.tempo_estimado = tempo_estimado;
    this.prioridade = prioridade;
    this.categoria = categoria;
    this.data = data;
    this.horario = horario;
    this.concluida = concluida;
  }

  // marca a tarefa como concluída
  concluir() {
    this.concluida = true;
  }
}

// função que recupera as tarefas salvas no navegador
function carregarTarefas() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || '[]');
    if (!Array.isArray(dados)) return [];
    return dados
      .filter(t => t && typeof t.titulo === 'string' && t.titulo.trim() && PRIORIDADES.includes(t.prioridade))
      .map(t => new Tarefa({ ...t, tempo_minutos: t.tempo }));
  } catch {
    return [];
  }
}

// lista principal de tarefas carregadas
const tarefas = carregarTarefas();

// função que salva a lista de tarefas no navegador
function salvar() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
}

// função que converte minutos em horas e minutos
function formatarTempo(minutos) {
  if (minutos === null) return 'tempo não informado';
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return `${horas}h${resto ? ` ${resto}min` : ''}`;
}

// função que formata a data para dia/mês/ano
function formatarData(data) {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// função que cria o item HTML de uma tarefa na lista
function criarItemTarefa(tarefa) {
  // cria o elemento principal da tarefa
  const li = document.createElement('li');
  li.className = `item-tarefa prioridade-${tarefa.prioridade}`;
  if (tarefa.concluida) li.classList.add('concluida');

  // cria o bloco de informações da tarefa
  const info = document.createElement('div');
  info.className = 'detalhes-tarefa';

  // cria botão com o título da tarefa
  const titulo = document.createElement('button');
  titulo.type = 'button';
  titulo.className = 'titulo-tarefa';
  titulo.textContent = `${tarefa.concluida ? '✓ ' : ''}${tarefa.titulo}`;
  titulo.title = 'Clique para marcar ou desmarcar como concluída';

  // marca ou desmarca como concluída ao clicar no título
  titulo.addEventListener('click', () => {
    tarefa.concluida = !tarefa.concluida;
    salvar();
    renderizarTarefas();
  });

  // cria texto com prioridade, categoria, tempo e prazo
  const detalhes = document.createElement('small');
  const prazo = [tarefa.data ? formatarData(tarefa.data) : '', tarefa.horario || ''].filter(Boolean).join(' às ');
  detalhes.textContent = `${tarefa.prioridade.toUpperCase()} · ${tarefa.categoria} · ${formatarTempo(tarefa.tempo)}${tarefa.tempo_estimado ? ' (estimado)' : ''}${prazo ? ` · ${prazo}` : ''}`;

  // cria botão de excluir tarefa
  const lixeira = document.createElement('button');
  lixeira.type = 'button';
  lixeira.className = 'btn-lixeira';
  lixeira.textContent = '🗑️';
  lixeira.setAttribute('aria-label', `Excluir ${tarefa.titulo}`);

  // remove a tarefa ao clicar na lixeira
  lixeira.addEventListener('click', () => {
    const i = tarefas.indexOf(tarefa);
    if (i !== -1) tarefas.splice(i, 1);
    salvar();
    renderizarTarefas();
  });

  // cria container dos botões de ação
  const acoes = document.createElement('div');
  acoes.className = 'acoes-tarefa';

  // cria botão de edição
  const editar = document.createElement('button');
  editar.type = 'button';
  editar.className = 'btn-editar';
  editar.textContent = '✎';
  editar.title = 'Editar tarefa';
  editar.setAttribute('aria-label', `Editar ${tarefa.titulo}`);

  // abre a janela de edição ao clicar no botão
  editar.addEventListener('click', () => abrirEdicao(tarefa));

  // monta a estrutura final do item
  acoes.append(editar, lixeira);
  info.append(titulo, detalhes);
  li.append(info, acoes);

  return li;
}

// função que atualiza a lista de tarefas na tela e aplica o filtro
function renderizarTarefas() {
  listaTarefas.replaceChildren();

  let visiveis = tarefas.filter(t => filtro === 'todas' || t.prioridade === filtro);

  // aplica a busca inteligente (Fuzzy Search) com Fuse.js
  if (termoBusca) {
    const fuse = new Fuse(visiveis, {
      keys: ['titulo', 'categoria'], 
      threshold: 0.4,                
      includeScore: true
    });

    const resultados = fuse.search(termoBusca);
    visiveis = resultados.map(resultado => resultado.item);
  }
  visiveis.forEach(t => listaTarefas.append(criarItemTarefa(t)));
  $('#contador').textContent = String(tarefas.length);
  const pendentes = tarefas.filter(t => !t.concluida).length;
  $('#pendentes').textContent = String(pendentes);
  mensagem.textContent = !tarefas.length
    ? 'Lista vazia. Adicione uma tarefa!'
    : !pendentes
      ? 'Parabéns! Todas as tarefas foram concluídas.'
      : `${pendentes} tarefa(s) pendente(s). Vamos continuar?`;

  document.querySelectorAll('.filtro').forEach(b => b.classList.toggle('ativo', b.dataset.filtro === filtro));
}

// função que abre a janela de edição com os dados da tarefa
function abrirEdicao(tarefa) {
  tarefaEmEdicao = tarefa;
  $('#editar-titulo').value = tarefa.titulo;
  $('#editar-horas').value = tarefa.tempo == null ? '' : String(Math.floor(tarefa.tempo / 60));
  $('#editar-minutos').value = tarefa.tempo == null ? '' : String(tarefa.tempo % 60);
  $('#editar-prioridade').value = PRIORIDADES.includes(tarefa.prioridade) ? tarefa.prioridade : 'media';
  $('#editar-categoria').value = CATEGORIAS.includes(tarefa.categoria) ? tarefa.categoria : 'outros';
  $('#erro-editar').textContent = '';
  dialogEditar.showModal();
  $('#editar-titulo').focus();
}

// função que abre ou fecha o painel do assistente de IA
function alternarIA(aberto) {
  painelIA.hidden = !aberto;
  abrirIA.setAttribute('aria-expanded', String(aberto));
  if (aberto) $('#texto-ia').focus();
  else abrirIA.focus();
}

// função que limpa as sugestões anteriores da IA
function limparPrevia() {
  sugestoes = [];
  $('#resultado-ia').hidden = true;
  $('#previa-ia').replaceChildren();
  $('#pendencias-ia').textContent = '';
}

// função que exibe as sugestões da IA com caixas de seleção
function mostrarPrevia(resposta) {
  limparPrevia();
  sugestoes = resposta.tarefas;
  $('#resultado-ia').hidden = false;
  $('#pendencias-ia').textContent = resposta.pendencias.length ? `Pendências: ${resposta.pendencias.join(' | ')}` : '';

  sugestoes.forEach((t, i) => {
    const label = document.createElement('label');
    label.className = 'sugestao';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.value = String(i);

    const texto = document.createElement('span');
    const prazo = [t.data ? formatarData(t.data) : '', t.horario || ''].filter(Boolean).join(' às ');
    texto.textContent = `${t.titulo} — ${t.prioridade} · ${t.categoria} · ${formatarTempo(t.tempo_minutos)}${t.tempo_estimado ? ' (estimado)' : ''}${prazo ? ` · ${prazo}` : ''}`;

    label.append(checkbox, texto);
    $('#previa-ia').append(label);
  });
}

// cadastra uma tarefa manualmente ao enviar o formulário
$('#form-tarefa').addEventListener('submit', evento => {
  evento.preventDefault();

  const titulo = $('#nova-tarefa').value.trim();
  const horasTexto = $('#tempo-horas').value.trim();
  const minutosTexto = $('#tempo-minutos').value.trim();
  const horas = horasTexto === '' ? 0 : Number(horasTexto);
  const minutos = minutosTexto === '' ? 0 : Number(minutosTexto);
  const informouTempo = horasTexto !== '' || minutosTexto !== '';
  const tempo = informouTempo ? horas * 60 + minutos : null;

  // valida os dados digitados
  if (!titulo || titulo.length > 160 ||
      !Number.isInteger(horas) || horas < 0 || horas > 168 ||
      !Number.isInteger(minutos) || minutos < 0 || minutos > 59 ||
      (tempo !== null && (tempo < 1 || tempo > 10080))) {
    mensagem.textContent = 'Informe uma tarefa válida. Use até 168 horas e minutos de 0 a 59 (tempo maior que zero).';
    return;
  }

  tarefas.push(new Tarefa({
    titulo,
    tempo_minutos: tempo,
    prioridade: $('#prioridade-manual').value,
    categoria: $('#categoria-manual').value
  }));

  salvar();
  evento.target.reset();
  renderizarTarefas();
});

// remove a primeira tarefa da lista ao clicar no botão excluir
$('#exclude').addEventListener('click', () => {
  if (tarefas.length) tarefas.shift();
  salvar();
  renderizarTarefas();
});

// filtra as tarefas ao clicar nos botões de prioridade
document.querySelectorAll('.filtro').forEach(botao => {
  botao.addEventListener('click', () => {
    filtro = botao.dataset.filtro;
    renderizarTarefas();
  });
});

// fecha a janela de edição ao clicar em cancelar
$('#cancelar-edicao').addEventListener('click', () => dialogEditar.close());

// limpa a referência da tarefa quando o modal de edição fecha
dialogEditar.addEventListener('close', () => {
  tarefaEmEdicao = null;
});

// salva as alterações da tarefa editada
$('#form-editar').addEventListener('submit', evento => {
  evento.preventDefault();

  if (!tarefaEmEdicao || !tarefas.includes(tarefaEmEdicao)) {
    $('#erro-editar').textContent = 'Esta tarefa não está mais disponível.';
    return;
  }

  const titulo = $('#editar-titulo').value.trim();
  const horasTexto = $('#editar-horas').value.trim();
  const minutosTexto = $('#editar-minutos').value.trim();
  const horas = horasTexto === '' ? 0 : Number(horasTexto);
  const minutos = minutosTexto === '' ? 0 : Number(minutosTexto);
  const informouTempo = horasTexto !== '' || minutosTexto !== '';
  const tempo = informouTempo ? horas * 60 + minutos : null;
  const prioridade = $('#editar-prioridade').value;
  const categoria = $('#editar-categoria').value;

  // valida os campos editados
  if (!titulo || titulo.length > 160 || !Number.isInteger(horas) || horas < 0 || horas > 168 ||
      !Number.isInteger(minutos) || minutos < 0 || minutos > 59 ||
      (tempo !== null && (tempo < 1 || tempo > 10080)) ||
      !PRIORIDADES.includes(prioridade) || !CATEGORIAS.includes(categoria)) {
    $('#erro-editar').textContent = 'Confira o título e o tempo: até 168 horas e 59 minutos, com duração maior que zero quando informada.';
    return;
  }

  const mudouTempo = tarefaEmEdicao.tempo !== tempo;
  tarefaEmEdicao.titulo = titulo;
  tarefaEmEdicao.tempo = tempo;
  // remove marcação de tempo estimado se o usuário alterou a duração
  if (mudouTempo) tarefaEmEdicao.tempo_estimado = false;
  tarefaEmEdicao.prioridade = prioridade;
  tarefaEmEdicao.categoria = categoria;

  salvar();
  renderizarTarefas();
  dialogEditar.close();
});

// abre ou fecha o painel da IA pelos botões ou tecla Escape
abrirIA.addEventListener('click', () => alternarIA(painelIA.hidden));
$('#fechar-ia').addEventListener('click', () => alternarIA(false));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !painelIA.hidden) alternarIA(false);
});

// envia o texto digitado para o servidor organizar tarefas com IA
$('#organizar-ia').addEventListener('click', async () => {
  const texto = $('#texto-ia').value.trim();
  if (!texto) {
    $('#status-ia').textContent = 'Descreva seus compromissos primeiro.';
    return;
  }

  limparPrevia();
  const botao = $('#organizar-ia');
  botao.disabled = true;
  $('#status-ia').textContent = 'Organizando tarefas com o ChatGPT...';

  try {
    const agora = new Date();
    const dataAtual = [agora.getFullYear(), String(agora.getMonth() + 1).padStart(2, '0'), String(agora.getDate()).padStart(2, '0')].join('-');
    const fusoHorario = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // envia os dados para a rota do servidor
    const respostaHttp = await fetch('/api/organizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto, dataAtual, fusoHorario })
    });

    const resposta = await respostaHttp.json();
    if (!respostaHttp.ok) throw new Error(resposta.erro || 'Erro ao consultar a IA.');

    if (resposta.status === 'recusado') {
      $('#status-ia').textContent = resposta.mensagem;
      return;
    }

    if (!Array.isArray(resposta.tarefas) || !resposta.tarefas.length) throw new Error('Nenhuma tarefa válida foi retornada.');

    mostrarPrevia(resposta);
    $('#status-ia').textContent = resposta.mensagem;
  } catch (erro) {
    $('#status-ia').textContent = erro.message;
  } finally {
    botao.disabled = false;
  }
});

// adiciona na lista apenas as tarefas da IA marcadas pelo usuário
$('#confirmar-ia').addEventListener('click', () => {
  const selecionadas = [...document.querySelectorAll('#previa-ia input:checked')]
    .map(input => sugestoes[Number(input.value)])
    .filter(Boolean);

  if (!selecionadas.length) {
    $('#status-ia').textContent = 'Selecione ao menos uma tarefa.';
    return;
  }

  selecionadas.forEach(t => tarefas.push(new Tarefa(t)));
  salvar();
  renderizarTarefas();
  limparPrevia();
  $('#texto-ia').value = '';
  $('#status-ia').textContent = `${selecionadas.length} tarefa(s) adicionada(s) com sucesso!`;
});

// descarta as sugestões da IA sem cadastrar
$('#cancelar-ia').addEventListener('click', () => {
  limparPrevia();
  $('#status-ia').textContent = 'Sugestões descartadas.';
});

$('#campo-busca').addEventListener('input', (evento) => {
  termoBusca = evento.target.value.trim(); 
  renderizarTarefas();                     
});