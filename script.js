const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const endScreen = document.getElementById('end-screen');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-button');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreElement = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;

const questions = [
    {
        question: "Qual é a principal causa do aquecimento global?",
        options: [
            "Desmatamento",
            "Queima de combustíveis fósseis",
            "Agricultura",
        ],
        answer: 1
    },
    {
        question: "Qual o material mais reciclado no mundo?",
        options: [
            "Plástico",
            "Vidro",
            "Alumínio",
        ],
        answer: 2
    },
    {
        question: "Quantos litros de água são necessários para produzir 1kg de carne bovina?",
        options: [
            "15.000 litros",
            "5.000 litros",
            "10.000 litros",
        ],
        answer: 0
    }
];

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', restartGame);

function startGame() {
    startScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    score = 0;
    currentQuestionIndex = 0;
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => selectOption(index));
        optionsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hidden');
    while (optionsElement.firstChild) {
        optionsElement.removeChild(optionsElement.firstChild);
    }
}

function selectOption(index) {
    const question = questions[currentQuestionIndex];
    if (index === question.answer) {
        score++;
    }
    const buttons = optionsElement.querySelectorAll('button');
    buttons.forEach((button, i) => {
        button.disabled = true;
        if (i === question.answer) {
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
        }
    });
    nextButton.classList.remove('hidden');
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.innerText = 'Finalizar';
    }
}

function endGame() {
    questionScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    scoreElement.innerText = `Sua pontuação: ${score} de ${questions.length}`;
}

function restartGame() {
    endScreen.classList.add('hidden');
    startGame();
}

// Finalize the game when the last question is answered
if (currentQuestionIndex === questions.length) {
    endGame();
}
