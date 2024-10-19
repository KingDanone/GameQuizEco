const perguntasERespostas = [
    {
        pergunta: "Qual é a principal causa do aquecimento global?",
        opcoes: [
            "Desmatamento",
            "Queima de combustíveis fósseis",
            "Agricultura"
        ],
        respostaCorreta: 1
    },
    {
        pergunta: "Qual o material mais reciclado no mundo?",
        opcoes: [
            "Plástico",
            "Vidro",
            "Alumínio"
        ],
        respostaCorreta: 2
    },
    {
        pergunta: "Quantos litros de água são necessários para produzir 1kg de carne bovina?",
        opcoes: [
            "15.000 litros",
            "5.000 litros",
            "10.000 litros"
        ],
        respostaCorreta: 0
    }
];

let pontuacao = 0;
let perguntaAtual = 0;
let timer;
const tempoLimite = 10;

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
const musica = document.getElementById("musica");

startBtn.addEventListener("click", iniciarJogo);
proximoBtn.addEventListener("click", mostrarProximaPergunta);

function iniciarJogo() {
    pontuacao = 0;
    perguntaAtual = 0;
    inicio.classList.add("hide");
    jogo.classList.remove("hide");
    resultadosElement.classList.add("hide");
    musica.play();
    mostrarProximaPergunta();
}

function mostrarProximaPergunta() {
    resetarEstado();
    mostrarPergunta(perguntasERespostas[perguntaAtual]);
}

function mostrarPergunta(pergunta) {
    perguntaElement.innerText = pergunta.pergunta;
    perguntaElement.classList.remove("hide");
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
        }
    }, 1000);
}

function verificarResposta(opcaoSelecionada, respostaCorreta) {
    clearInterval(timer); // Para o temporizador
    if (opcaoSelecionada === respostaCorreta) {
        pontuacao++;
        feedbackElement.innerText = "Correto!";
        feedbackElement.classList.add("correto");
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
        resultadosElement.classList.remove("hide");
        resultadosElement.innerHTML = `Fim do jogo! Sua pontuação: ${pontuacao} / ${perguntasERespostas.length}`;
        jogo.classList.add("hide");
        musica.pause();
    }
}

function resetarEstado() {
    proximoBtn.classList.add("hide");
    opcoesElement.innerHTML = "";
    feedbackElement.classList.add("hide");
    feedbackElement.classList.remove("correto", "incorreto");
    tempoElement.classList.add("hide");
}
