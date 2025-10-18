#!/usr/bin/env node
const readline = require('readline');

// Определяем диапазон
const MIN = 0;
const MAX = 100;

// Генерируем случайное число
const secret = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

// Интерфейс для взаимодействия с пользователем
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`Загадано число в диапазоне от ${MIN} до ${MAX}`);

// Функция проверки ввода
rl.on('line', (input) => {
  const guess = Number(input.trim());

  if (Number.isNaN(guess)) {
    console.log('Введите число!');
    return;
  }

  if (guess < secret) {
    console.log('Больше');
  } else if (guess > secret) {
    console.log('Меньше');
  } else {
    console.log(`Отгадано число ${secret}`);
    rl.close();
  }
});