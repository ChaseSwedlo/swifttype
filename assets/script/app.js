'use strict';
import words from './words.js';
import Score from '../script/Score.js';

const userInput = document.querySelector('.input');
const timer = document.querySelector('.timer');
const randomWord = document.querySelector('.current-word');
const button = document.querySelector('.main-button');
const scoreText = document.querySelector('.score');
const backgroundMusic = new Audio('./assets/media/bgmusic.mp3');
const success = new Audio('./assets/media/success.mp3');
const highScoreUl = document.querySelector('.highscores');
const scoreBoard = document.querySelector('.scoreboard');
let highScores = loadScores();
let started = false;
let counter = 45;
let countdown;
let score = 0;
let wordsCopy = [...words];
backgroundMusic.type = 'audio/mp3';
backgroundMusic.volume = 0.55;
success.type = 'audio/mp3';
success.volume = 0.63;

function randomArray(arr) {
    let j = 0;
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
randomArray(wordsCopy);

function createScore() {
    let percentage = 100;
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const date = new Date().toLocaleDateString('en-EN', options);
    if(wordsCopy != 0)
        percentage = Math.floor(100 - ((wordsCopy.length / words.length) * 100));
    const scoreObj = new Score(date, score, `${percentage}%`);
    return scoreObj;
}

function reset() {
    button.innerText = 'Start';
    scoreText.style.visibility = 'visible';
    userInput.value = '';
    userInput.disabled = true;
    randomWord.innerText = `SwiftType`;
    wordsCopy = [...words];
    randomArray(wordsCopy);
    counter =15;
    timer.innerText = '--';
    clearInterval(countdown);
    scoreText.innerText = 'Score: 0';
    score = 0;
    backgroundMusic.pause();
}

function gameOver() {
    timer.innerText = '--';
    button.innerText = 'Start';
    clearInterval(countdown);
    userInput.disabled = true;
    userInput.value = `Score: ${score}`;
    scoreText.style.visibility = 'hidden';
    randomWord.innerText = 'Game Over!';
    addScore();
    loadScores();
    buildHighscores();
    scoreBoard.classList.remove('translatex');
    backgroundMusic.pause();
}

function start() {
    button.innerText = 'Reset';
    userInput.disabled = false;
    userInput.focus();
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    randomWord.innerText = `${wordsCopy[0]}`;
    timer.innerText = counter;
    scoreText.style.visibility = 'visible';
    countdown = setInterval(function() {
        counter--;
        if (counter < 0) {
            gameOver();
        } else {
            timer.innerText = counter;
        }
    }, 1000);
}

function startCountdown(i) {
    setTimeout(() => {
        randomWord.innerText = i-1;
        if (i > 1) {
            startCountdown(i - 1);
        }
        else {
            start();
            button.disabled = false;
        }
    }, 1000);
}

function startGame() {
    button.disabled = true;
    randomWord.innerText = 3;
    startCountdown(3);
}

function updateScore() {
    score++;
    scoreText.innerText = `Score: ${score}`;
    if(wordsCopy.length > 0)
        randomWord.innerText = `${wordsCopy[0]}`;
    else {
        gameOver();
        randomWord.innerText = 'You Win!';
    }
}

function checkInput() {
    let val = userInput.value;
    if(wordsCopy.length === 0) {
        gameOver();
        randomWord.innerText = 'You Win!';
    } 
    else if(val.trim().toLowerCase() === wordsCopy[0]) {
        wordsCopy.shift();
        userInput.value = '';
        success.play();
        updateScore();
    }
}

function sortScores() {
    highScores.sort((a, b) => {
        return b.hits - a.hits;
    });
}

function addScore() {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const date = new Date().toLocaleDateString('en-EN', options);
    const scoreObj = {
        hits: score,
        scoreDate: date
    }
    highScores.push(scoreObj);
    sortScores();
    if(highScores.length > 9) {
        highScores.splice(9);
    }
    localStorage.setItem('scores', JSON.stringify(highScores));
}

function loadScores() {
    let scoresArray = [];
    if(localStorage.getItem('scores') != null) {
        scoresArray = JSON.parse(localStorage.getItem('scores'));
    }
    return scoresArray;
}

function buildHighscores() {
    let lis = '';
    const scores = loadScores();
    if(scores.length > 0) {
        for(let i=0; i<scores.length; i++) {
            let words = scores[i].hits;
            words = (words < 10) ? '0' + words : words;
            lis += `<li>
                        <span>#${i+1}</span>
                        <span>${words} words</span>
                        <span>${scores[i].scoreDate}</span>
                    </li>`;
        }
    }
    highScoreUl.innerHTML = lis;
}
buildHighscores();

setTimeout(() => {
    scoreBoard.classList.remove('translatex');
}, 400);

window.addEventListener('resize', () => {
    scoreBoard.classList.add('translatex');
});
button.addEventListener('click', () => {
    scoreBoard.classList.add('translatex');
    if(!started) {
        startGame();
        started = true;
    }
    else {
        reset();
        startGame();
    }
});

userInput.addEventListener('input', checkInput);
userInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13)
        event.preventDefault();
});