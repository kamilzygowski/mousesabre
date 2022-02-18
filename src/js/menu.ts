import { initGameState } from "./main";
import { fakeHistoryBack } from "./utils";

const container = document.body;
// <html>
// <body>
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
// </body>
// </html>
startButtonTag.addEventListener('click', ():void => {
    fakeHistoryBack(window,location);
    initGameState();
})