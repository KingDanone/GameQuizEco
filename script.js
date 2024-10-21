let perguntasERespostas = [];
let pontuacao = 0;
let perguntaAtual = 0;
let timer;
let vidas = 3;
const tempoLimite = 30; // 30 segundos

const inicio = document.getElementById("inicio");
const jogo = document.getElementById("jogo");
const perguntaElement = document.getElementById("pergunta");
const opcoesElement = document.getElementById("opcoes");
const feedbackElement = document.getElementById("feedback");
const proximoBtn = document.getElementById("proximoBtn");
const pontuacaoElement = document.getElementById("pontuacao");
const contadorElement = document.getElementById("contador");
const tempoElement = document.getElementById("tempo");
const resultadosElement = document.getElementById("resultados");
const startBtn = document.getElementById("startBtn");
const sairBtn = document.getElementById("sairBtn");
const musica = document.getElementById("musica");
const toggleThemeBtn = document.getElementById("toggleThemeBtn");

// Diminuir o volume da música em 50%
musica.volume = 0.5;

// Adiciona o evento ao botão de início
startBtn.addEventListener("click", carregarPerguntas);
sairBtn.addEventListener("click", sairDoJogo);
proximoBtn.addEventListener("click", mostrarProximaPergunta);

// Função para carregar as perguntas do arquivo JSON
function carregarPerguntas() {
    fetch('perguntas.json')
        .then(response => response.json())
        .then(data => {
            perguntasERespostas = data;
            iniciarJogo();
        })
        .catch(error => console.error('Erro ao carregar perguntas:', error));
}

function iniciarJogo() {
    pontuacao = 0;
    vidas = 3; // Reiniciar o número de vidas
    perguntaAtual = 0;
    inicio.classList.add("hide");
    jogo.classList.remove("hide");
    resultadosElement.classList.add("hide");
    musica.play(); // Começa a música quando o jogo inicia
    inicializarVidas(); // Chame para exibir os corações
    mostrarProximaPergunta();
}

function sairDoJogo() {
    const sair = confirm("Tem certeza que deseja sair do jogo?");
    if (sair) {
        window.location.reload(); // Reinicia o jogo
    }
}

function mostrarProximaPergunta() {
    resetarEstado();
    if (perguntaAtual < perguntasERespostas.length) {
        mostrarPergunta(perguntasERespostas[perguntaAtual]);
    } else {
        mostrarResultados();
    }
}

function mostrarPergunta(pergunta) {
    perguntaElement.innerText = pergunta.pergunta;
    perguntaElement.classList.remove("hide");
    opcoesElement.innerHTML = ''; // Limpa opções anteriores
    pergunta.opcoes.forEach((opcao, index) => {
        const botaoOpcao = document.createElement("button");
        botaoOpcao.innerText = opcao;
        botaoOpcao.classList.add("option");
        botaoOpcao.addEventListener("click", () => verificarResposta(index, pergunta.respostaCorreta));
        opcoesElement.appendChild(botaoOpcao);
    });

    // Iniciar temporizador
    tempoElement.classList.remove("hide");
    contadorElement.innerText = tempoLimite;
    timer = setInterval(() => {
        const tempoRestante = parseInt(contadorElement.innerText);
        if (tempoRestante > 0) {
            contadorElement.innerText = tempoRestante - 1;
        } else {
            clearInterval(timer);
            feedbackElement.innerText = "Tempo esgotado!";
            feedbackElement.classList.add("incorreto");
            feedbackElement.classList.remove("hide");
            proximoBtn.classList.remove("hide");
            verificarResposta(-1, pergunta.respostaCorreta); // Chama para finalizar a resposta
        }
    }, 1000);
}

function verificarResposta(opcaoSelecionada, respostaCorreta) {
    clearInterval(timer); // Para o temporizador
    if (opcaoSelecionada === respostaCorreta) {
        pontuacao++;
        feedbackElement.innerText = "Correto!";
        feedbackElement.classList.add("correto");
    } else if (opcaoSelecionada === -1) {
        feedbackElement.innerText = "Errado! A resposta correta era: " + perguntasERespostas[perguntaAtual].opcoes[respostaCorreta];
        feedbackElement.classList.add("incorreto");
    } else {
        feedbackElement.innerText = "Errado! A resposta correta era: " + perguntasERespostas[perguntaAtual].opcoes[respostaCorreta];
        feedbackElement.classList.add("incorreto");
    }

    feedbackElement.classList.remove("hide");
    proximoBtn.classList.remove("hide");
    
    // Atualiza a pontuação
    pontuacaoElement.innerText = "Pontuação: " + pontuacao;

    // Mostrar resultados se for a última pergunta
    if (perguntaAtual === perguntasERespostas.length - 1) {
        mostrarResultados(); // Mostrar resultados se for a última pergunta
    } else {
        perguntaAtual++; // Avançar para a próxima pergunta
    }

    if (opcaoSelecionada !== respostaCorreta) {
        vidas--;
        atualizarVidas();
        if (vidas === 0) {
            alert("Você perdeu todas as suas vidas!");
            mostrarResultados();
        }
    }
}

function mostrarResultados() {
    resultadosElement.classList.remove("hide");
    resultadosElement.innerHTML = `
        <p>Fim do jogo! Sua pontuação: ${pontuacao} / ${perguntasERespostas.length}</p>
        <button id="jogarNovamenteBtn">Jogar Novamente</button>
    `;
    jogo.classList.add("hide");
    musica.pause(); // Pausa a música

    // Adiciona o evento ao botão de jogar novamente
    document.getElementById("jogarNovamenteBtn").addEventListener("click", recomeçarJogo);
}

function recomeçarJogo() {
    // Reinicia o jogo
    pontuacao = 0;
    perguntaAtual = 0;
    vidas = 3; // Reinicia o número de vidas
    resetarEstado();
    inicializarVidas(); // Reinicializa os corações
    carregarPerguntas(); // Chama carregarPerguntas para reiniciar
}

function resetarEstado() {
    proximoBtn.classList.add("hide");
    opcoesElement.innerHTML = "";
    feedbackElement.classList.add("hide");
    feedbackElement.classList.remove("correto", "incorreto");
    tempoElement.classList.add("hide");
}

// Função para inicializar as vidas com corações
function inicializarVidas() {
    const vidasContainer = document.getElementById('vidas');
    vidasContainer.innerHTML = ''; // Limpa o conteúdo
    for (let i = 0; i < vidas; i++) {
        const coracao = document.createElement('div');
        coracao.classList.add('vida');
        vidasContainer.appendChild(coracao);
    }
}

// Função para atualizar os corações quando o jogador perde uma vida
function atualizarVidas() {
    const coracoes = document.querySelectorAll('.vida');
    if (vidas < coracoes.length) {
        coracoes[vidas].classList.add('perdida'); // Marca o próximo coração como "perdido"
    }
}

// Função para alternar entre o tema claro e escuro
toggleThemeBtn.addEventListener("click", () => {
    const body = document.body;
    const container = document.querySelector('.container'); // Seleciona o container

    // Alterna entre os temas claro e escuro
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        container.classList.remove("dark-mode"); // Remove a classe do container
        container.classList.add("light-mode"); // Adiciona a classe do container (se existir)
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        container.classList.remove("light-mode"); // Remove a classe do container
        container.classList.add("dark-mode"); // Adiciona a classe do container (se existir)
    }

    // Salvar a preferência do tema no localStorage
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
});


// Função para aplicar o tema salvo ao carregar a página
function aplicarTemaSalvo() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.add("light-mode");
    }
}

// Aplica o tema quando a página é carregada
window.addEventListener("load", aplicarTemaSalvo);
