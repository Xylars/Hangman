const guess = document.querySelector(".guess input");
const buttonsBlock = document.querySelector(".guess");
const wordInput = document.querySelector(".wordinput");
const startBtn = document.querySelector(".start-btn");
const guessSubmit = document.querySelector(".wordinput input");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const submit = document.querySelector(".submit");
const restart = document.querySelector(".restart");
const startY = 200;
const endY = 50;
let guessWord = "Door";
let gameActive = false;
let text = "";
let timeFails = 0;
let correctGuess = 0;
let wrongChars = [];
let correctChars = [];
let letterPos = [];
let errorMsg = document.querySelectorAll(".error");
let firstError = errorMsg[0];
let secondError = errorMsg[1];
let halfWidth = canvas.width / 2;
let halfHeight = canvas.height / 2;


function startGame(word) {
    guess.value = "";
    wordInput.value = "";
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    const startY = 270;
    const letterSpacing = 20;
    const dashLength = 10;
    const totalWidth = (word.length - 1) * letterSpacing + dashLength;
    const startX = (canvas.width - totalWidth) / 2;

    for (let i = 0; i < word.length; i++) {
        const x = startX + i * letterSpacing;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x + dashLength, startY);
        ctx.stroke();
        letterPos.push(x + dashLength / 2);
    }

    gameActive = true;
    writeText("Guessed Characters:", "cyan", "10px Arial", 30, 20);
    drawHanger();
    onLoad();

}

function drawHanger() {

    ctx.beginPath();
    ctx.moveTo(500, startY);
    ctx.lineTo(500, endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(450, startY);
    ctx.lineTo(550, startY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(500, endY);
    ctx.lineTo(410, endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(410, endY);
    ctx.lineTo(410, endY + 30);
    ctx.stroke();
}

function drawFails(times) {

    let limit = 6;

    switch (times) {
        //head
        case 1:
            ctx.beginPath();
            ctx.arc(410, endY + 40, 10, 0, 2 * Math.PI);
            ctx.stroke();
            break;

        // body
        case 2:
            ctx.beginPath();
            ctx.moveTo(410, endY + 50);
            ctx.lineTo(410, endY + 90);
            ctx.stroke();
            break;

        // right arm
        case 3:
            ctx.beginPath();
            ctx.moveTo(410, endY + 60);
            ctx.lineTo(430, endY + 75);
            ctx.stroke();
            break;

        // left arm
        case 4:
            ctx.beginPath();
            ctx.moveTo(410, endY + 60);
            ctx.lineTo(390, endY + 75);
            ctx.stroke();
            break;

        //right leg
        case 5:
            ctx.beginPath();
            ctx.moveTo(410, endY + 90);
            ctx.lineTo(390, endY + 105);
            ctx.stroke();
            break;

        // left leg
        case 6:
            ctx.beginPath();
            ctx.moveTo(410, endY + 90);
            ctx.lineTo(430, endY + 105);
            ctx.stroke();
            break;
    }
    if (times === limit) {
        endGame("GAME OVER", "red");
        guess.value = "";
    }

}

function endGame(msg, color) {
    gameActive = false;

    writeText(msg, color, "40px Arial", halfWidth, halfHeight, true);
}

function isChar(char) {

    return !/\d/.test(char);
}

function isWord(str) {
    return /^[A-Za-z]+$/.test(str);
}
function writeText(text, color, font, x, y, gameEnd = false) {
    if (gameEnd) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    }
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

function drawCharacter(character) {
    const y = 260;
    for (let i = 0; i < guessWord.length; i++) {
        if (guessWord[i].toUpperCase() === character.toUpperCase()) {
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            correctGuess++;
            ctx.fillText(character.toUpperCase(), letterPos[i], y);
        }
    }
}

function submitWord() {
    text = guess.value;
    guess.value = "";
    guess.focus();
    if (!gameActive) {
        let error = "Please start a new game";
        secondError.innerHTML = error;
        return;
    }
    if (!text.trim().length || !isChar(text)) {
        let error = "Enter a valid character!"
        secondError.innerHTML = error;
        return;
    }
    if (wrongChars.includes(text.toUpperCase()) ||
        correctChars.includes(text.toUpperCase())) {
        let error = "This character is already submitted!";
        secondError.innerHTML = error;
        return;
    }
    if (!guessWord.includes(text.toUpperCase())) {
        timeFails++;
        wrongChars.push(text.toUpperCase());
        secondError.innerHTML = "";
        let x;
        x = 20 + (wrongChars.length) * 10;
        writeText(text, "cyan", "8px Arial", x, 35);
        drawFails(timeFails);

        return;
    }
    secondError.innerHTML = "";
    correctChars.push(text.toUpperCase());
    drawCharacter(text);
    if (correctGuess === guessWord.length) {
        gameActive = false;
        writeText("YOU WIN!", "green", "40px Arial", halfWidth, halfHeight, true);
    }
}

submit.addEventListener('click', submitWord);
guess.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        submit.click();
    }
    if (e.key === 'r' && !gameActive) {
        restart.click();
    }
});

wordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        startBtn.click();
    }
});



restart.addEventListener('click', () => {
    timeFails = 0;
    correctGuess = 0;
    guess.value = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.reset();
    wrongChars = [];
    correctChars = [];
    letterPos = [];
    firstError.innerHTML = "";
    secondError.innerHTML = "";
    guess.value = "";
    guessWord = "Door";
    guessSubmit.value = "";
    onLoad();
});

startBtn.addEventListener('click', () => {

    guessWord = guessSubmit.value;
    guessWord = guessWord.toUpperCase();

    if (!isWord(guessWord) || !guessWord.trim().length) {
        let error = "Please enter a valid word!";
        firstError.innerHTML = error;
        return;
    }
    firstError.innerHTML = "";

    startGame(guessWord);

});

function onLoad() {
    canvas.classList.toggle('hidden');
    buttonsBlock.classList.toggle('hidden');
    wordInput.classList.toggle('hidden');
    guess.focus();
}






