'use strict';
import words from './words.js';
import Score from '../script/Score.js';

const userInput = document.querySelector('.input');
const timer = document.querySelector('.timer');
const randomWord = document.querySelector('.currnet-word');
const wordsCopy = [...words];
let counter = 99;
let score = 0;

function randomArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}