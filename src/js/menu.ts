import { data, getData, postData } from "./dbconnection";
import { initGameState } from "./main";
import { bubbleSortCustom, fakeHistoryBack } from "./utils";

export interface Highscores {
    id?: number;
    name: string;
    score: number;
}
const container = document.body;
let areHighscoresVisible: boolean = false;
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

const menuHighscores: HTMLElement = document.createElement('ul');
menuHighscores.classList.add('highscoresUl');
const li: HTMLElement = document.createElement('li');
const li2: HTMLElement = document.createElement('li');
const li3: HTMLElement = document.createElement('li');
const li4: HTMLElement = document.createElement('li');
const li5: HTMLElement = document.createElement('li');
const li6: HTMLElement = document.createElement('li');

// </body>
// </html>
const errorMsg:HTMLHeadElement = document.createElement('h3');
errorMsg.textContent = 'Your screen is too small :(';
errorMsg.style.color = 'red';
errorMsg.style.fontSize = '43px';

startButtonTag.addEventListener('click', (): void => {
    if(window.innerWidth <= 900){
        document.body.appendChild(errorMsg);
        return;
    }
    fakeHistoryBack(window, location);
    initGameState();
})
setTimeout(() => {
    data !== undefined ? areHighscoresVisible : !areHighscoresVisible;
    bubbleSortCustom(data, false)
    li.textContent = 'HIGHSCORES';
    li2.textContent = `${data[0].name} - ${data[0].score} pkt`;
    li3.textContent = `${data[1].name} - ${data[1].score} pkt`;
    li4.textContent = `${data[2].name} - ${data[2].score} pkt`;
    li5.textContent = `${data[3].name} - ${data[3].score} pkt`;
    li6.textContent = `${data[4].name} - ${data[4].score} pkt`;
    container.appendChild(menuHighscores)
    menuHighscores.appendChild(li)
    menuHighscores.appendChild(li2)
    menuHighscores.appendChild(li3)
    menuHighscores.appendChild(li4)
    menuHighscores.appendChild(li5)
    menuHighscores.appendChild(li6)
}, 210);
export const postHighscoreWindow = (score: number): void => {
    const highscoresWindow: HTMLDivElement = document.createElement('div');
    highscoresWindow.classList.add('highscoresWindow');
    const title: HTMLParagraphElement = document.createElement('p');
    title.textContent = 'NEW HIGHSCORE!';
    const playerScore: HTMLParagraphElement = document.createElement('p');
    playerScore.textContent = `Your score: ${score}`;
    const nicknameInput: HTMLInputElement = document.createElement('input');
    const regex = /([a-zA-Z0-9]{3,21})/g;
    regex.test(nicknameInput.value);
    nicknameInput.placeholder = 'Your nickname';
    const submitButton: HTMLButtonElement = document.createElement('button');
    submitButton.textContent = 'submit';
    document.body.appendChild(highscoresWindow)
    highscoresWindow.appendChild(title);
    highscoresWindow.appendChild(playerScore);
    highscoresWindow.appendChild(nicknameInput);
    highscoresWindow.appendChild(submitButton);

    submitButton.addEventListener('click', (): void => {
        if (regex.test(nicknameInput.value) && areHighscoresVisible) {
            postData({ id: data ? data.length : Math.floor(Math.random() * 300), name: nicknameInput.value, score: score })
            highscoresWindow.remove();
        } else if (!regex.test(nicknameInput.value)) {
            nicknameInput.classList.add('badName');
        } else {
            nicknameInput.classList.remove('badName');
        }
    })
}
getData()