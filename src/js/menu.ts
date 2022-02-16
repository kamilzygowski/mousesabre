import { initGameState, startGame } from "./main";

const container = document.body;

const title: string = 'Mouse Sabre';
const titleTag: HTMLElement = document.createElement('h1');
titleTag.textContent = title;
titleTag.classList.add('title');

container.appendChild(titleTag);

const startButtonTag: HTMLElement = document.createElement('a');
startButtonTag.textContent = 'START';
startButtonTag.classList.add('startButton');
container.appendChild(startButtonTag);

const menuImage: HTMLImageElement = document.createElement('img');
menuImage.src = 'https://i.postimg.cc/VvJgLND4/main-Menu-Sword.png';
menuImage.classList.add('menuImage');
container.appendChild(menuImage);

startButtonTag.addEventListener('click', () => {
    console.log('start')
    initGameState();
    startGame();
})