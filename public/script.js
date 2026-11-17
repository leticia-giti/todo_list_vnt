// Configurações e dados usados no projeto.
const CHAVE_STORAGE = 'inotes-tarefas-v1';
const PRIORIDADES = ['alta', 'media', 'baixa'];
const CATEGORIAS = ['estudos', 'trabalho', 'pessoal', 'saude', 'casa', 'compras', 'outros'];
// Atalho para selecionar elementos do HTML.
const $ = (seletor) => document.querySelector(seletor);
const listaTarefas = $('#lista-tarefas');
const mensagem = $('#mensagem');
let filtro = 'todas';
let sugestoes = [];

// Modelo que guarda as informações de cada tarefa.
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
  concluir() { this.concluida = true; }
}

// Recupera as tarefas salvas no navegador.
function carregarTarefas() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || '[]');
    if (!Array.isArray(dados)) return [];
    return dados.filter(t => t && typeof t.titulo === 'string' && t.titulo.trim() && PRIORIDADES.includes(t.prioridade))
      .map(t => new Tarefa({ ...t, tempo_minutos: t.tempo }));
  } catch { return []; }
}
const tarefas = carregarTarefas();
// Salva a lista no navegador para não perder ao atualizar a página.
function salvar() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
}
// Mostra o tempo em horas e minutos, em vez de só minutos.
function formatarTempo(minutos) {
  if (minutos === null) return 'tempo não informado';
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return `${horas}h${resto ? ` ${resto}min` : ''}`;
}
// Mostra a data no formato dia/mês/ano.
function formatarData(data) {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}
// Monta um item da lista com título, detalhes e botões.
function criarItemTarefa(tarefa) {
  const li = document.createElement('li');
  li.className = `item-tarefa prioridade-${tarefa.prioridade}`;
  if (tarefa.concluida) li.classList.add('concluida');
  const info = document.createElement('div');
  info.className = 'detalhes-tarefa';
  const titulo = document.createElement('button');
  titulo.type = 'button';
  titulo.className = 'titulo-tarefa';
  titulo.textContent = `${tarefa.concluida ? '✓ ' : ''}${tarefa.titulo}`;
  titulo.title = 'Clique para marcar ou desmarcar como concluída';
  // Ao clicar no título, marca ou desmarca a tarefa como concluída.
  titulo.addEventListener('click', () => {
    tarefa.concluida = !tarefa.concluida;
    salvar();
    renderizarTarefas();
  });
  const detalhes = document.createElement('small');
  const prazo = [tarefa.data ? formatarData(tarefa.data) : '', tarefa.horario || ''].filter(Boolean).join(' às ');
  detalhes.textContent = `${tarefa.prioridade.toUpperCase()} · ${tarefa.categoria} · ${formatarTempo(tarefa.tempo)}${tarefa.tempo_estimado ? ' (estimado)' : ''}${prazo ? ` · ${prazo}` : ''}`;
  const lixeira = document.createElement('button');
  lixeira.type = 'button';
  lixeira.className = 'btn-lixeira';
  lixeira.textContent = '🗑️';
  lixeira.setAttribute('aria-label', `Excluir ${tarefa.titulo}`);
  // Exclui somente a tarefa escolhida.
  lixeira.addEventListener('click', () => {
    const i = tarefas.indexOf(tarefa);
    if (i !== -1) tarefas.splice(i, 1);
    salvar();
    renderizarTarefas();
  });
  const acoes = document.createElement('div');
  acoes.className = 'acoes-tarefa';
  const editar = document.createElement('button');
  editar.type = 'button';
  editar.className = 'btn-editar';
  editar.textContent = '✎';
  editar.title = 'Editar tarefa';
  editar.setAttribute('aria-label', `Editar ${tarefa.titulo}`);
  editar.addEventListener('click', () => abrirEdicao(tarefa));
  acoes.append(editar, lixeira);
  info.append(titulo, detalhes);
  li.append(info, acoes);
  return li;
}
// Atualiza a lista na tela e aplica o filtro de prioridade.
function renderizarTarefas() {
  listaTarefas.replaceChildren();
  // O filtro só muda o que aparece; não apaga tarefas.
  const visiveis = tarefas.filter(t => filtro === 'todas' || t.prioridade === filtro);
  visiveis.forEach(t => listaTarefas.append(criarItemTarefa(t)));
  $('#contador').textContent = String(tarefas.length);
  const pendentes = tarefas.filter(t => !t.concluida).length;
  $('#pendentes').textContent = String(pendentes);
  mensagem.textContent = !tarefas.length ? 'Lista vazia. Adicione uma tarefa!' : !pendentes ? 'Parabéns! Todas as tarefas foram concluídas.' : `${pendentes} tarefa(s) pendente(s). Vamos continuar?`;
  document.querySelectorAll('.filtro').forEach(b => b.classList.toggle('ativo', b.dataset.filtro === filtro));
}

// Edição: funciona para tarefas manuais e da IA.
const dialogEditar = $('#dialog-editar');
let tarefaEmEdicao = null;
// Abre a janela e preenche os campos com os dados atuais.
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
$('#cancelar-edicao').addEventListener('click', () => dialogEditar.close());
dialogEditar.addEventListener('close', () => { tarefaEmEdicao = null; });
// Salva as alterações feitas no formulário de edição.
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
  if (mudouTempo) tarefaEmEdicao.tempo_estimado = false; // A duração passou a ser definida pelo usuário.
  tarefaEmEdicao.prioridade = prioridade;
  tarefaEmEdicao.categoria = categoria;
  salvar();
  renderizarTarefas();
  dialogEditar.close();
});

// Adiciona uma tarefa manualmente ao enviar o formulário.
$('#form-tarefa').addEventListener('submit', evento => {
  evento.preventDefault();
  const titulo = $('#nova-tarefa').value.trim();
  const horasTexto = $('#tempo-horas').value.trim();
  const minutosTexto = $('#tempo-minutos').value.trim();
  const horas = horasTexto === '' ? 0 : Number(horasTexto);
  const minutos = minutosTexto === '' ? 0 : Number(minutosTexto);
  const informouTempo = horasTexto !== '' || minutosTexto !== '';
  const tempo = informouTempo ? horas * 60 + minutos : null;
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
// Botão Excluir do formulário: remove a primeira tarefa da lista.
$('#exclude').addEventListener('click', () => {
  if (tarefas.length) tarefas.shift();
  salvar();
  renderizarTarefas();
});
// Os botões de prioridade escolhem quais tarefas mostrar.
document.querySelectorAll('.filtro').forEach(botao => {
  botao.addEventListener('click', () => {
    filtro = botao.dataset.filtro;
    renderizarTarefas();
  });
});

const abrirIA = $('#abrir-ia');
const painelIA = $('#painel-ia');
// Abre ou fecha a janela do assistente de IA.
function alternarIA(aberto) {
  painelIA.hidden = !aberto;
  abrirIA.setAttribute('aria-expanded', String(aberto));
  if (aberto) $('#texto-ia').focus();
  else abrirIA.focus();
}
abrirIA.addEventListener('click', () => alternarIA(painelIA.hidden));
$('#fechar-ia').addEventListener('click', () => alternarIA(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !painelIA.hidden) alternarIA(false); });
// Apaga as sugestões anteriores da IA.
function limparPrevia() {
  sugestoes = [];
  $('#resultado-ia').hidden = true;
  $('#previa-ia').replaceChildren();
  $('#pendencias-ia').textContent = '';
}
// Mostra as sugestões com caixas de seleção antes de cadastrar.
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
// Envia o texto ao nosso servidor, que consulta a API da OpenAI.
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
    // POST envia os compromissos ao backend em formato JSON.
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
// Só adiciona as tarefas da IA que o usuário marcou na prévia.
$('#confirmar-ia').addEventListener('click', () => {
  const selecionadas = [...document.querySelectorAll('#previa-ia input:checked')]
    .map(input => sugestoes[Number(input.value)]).filter(Boolean);
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
// Cancela as sugestões sem criar nenhuma tarefa.
$('#cancelar-ia').addEventListener('click', () => {
  limparPrevia();
  $('#status-ia').textContent = 'Sugestões descartadas.';
});
renderizarTarefas();
