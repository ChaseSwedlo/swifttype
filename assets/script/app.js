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
let started = false;
let counter = 20;
let countdown;
let score = 0;
let wordsCopy = [...words];
backgroundMusic.type = 'audio/mp3';
backgroundMusic.volume = 0.7;
success.type = 'audio/mp3';
success.volume = 0.8;

function randomArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
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
        percentage = Math.round((words.length / wordsCopy.length) * 10);
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
    counter = 99;
    timer.innerText = '--';
    clearInterval(countdown);
    scoreText.innerText = 'Score: 0';
    score = 0;
    backgroundMusic.pause();
}

function gameOver() {
    clearInterval(countdown);
    userInput.disabled = true;
    userInput.value = `Score: ${score}`;
    scoreText.style.visibility = 'hidden';
    randomWord.innerText = 'Game Over!';
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

button.addEventListener('click', () => {
    if(started) {
        reset();
        started = false;
    }
    else {
        startGame();
        started = true;
    }   
});

function updateScore() {
    score++;
    scoreText.innerText = `Score: ${score}`;
    randomWord.innerText = `${wordsCopy[0]}`;
}

function checkInput() {
    let val = userInput.value;
    if(val.trim().toLowerCase() === wordsCopy[0]) {
        wordsCopy.shift();
        userInput.value = '';
        success.play();
        updateScore();
    }
}

userInput.addEventListener('input', checkInput);
userInput.addEventListener('keydown', (event) => {
    // Prevent the default page reload on enter keypress
    if (event.keyCode === 13)
        event.preventDefault();
});