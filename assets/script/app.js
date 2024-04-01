'use strict';
import words from './words.js';
import Score from '../script/Score.js';

const userInput = document.querySelector('.input');
const timer = document.querySelector('.timer');
const randomWord = document.querySelector('.current-word');
const button = document.querySelector('.main-button');
const scoreText = document.querySelector('.score');
let started = false;
let counter = 20;
let countdown;
let score = 0;
let wordsCopy = [...words];

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
    userInput.disabled = true;
    randomWord.innerText = `SwiftType`;
    wordsCopy = [...words];
    randomArray(wordsCopy);
    counter = 99;
    timer.innerText = '0';
    clearInterval(countdown);
    scoreText.innerText = 'Score: 0';
    score = 0;
}

function start() {
    button.innerText = 'Reset';
    userInput.disabled = false;
    userInput.focus();
    randomWord.innerText = `${wordsCopy[0]}`;
    timer.innerText = counter;
    countdown = setInterval(function() {
        counter--;
        if (counter < 0) {
            clearInterval(countdown);
            userInput.disabled = true;
            randomWord.innerText = 'Game Over!';
        } else {
            timer.innerText = counter;
        }
    }, 1000);
}

button.addEventListener('click', () => {
    if(started) {
        reset();
        started = false;
    }
    else {
        start();
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
        updateScore();
    }
}

userInput.addEventListener('input', checkInput);
