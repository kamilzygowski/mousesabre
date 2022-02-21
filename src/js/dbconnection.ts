import axios from 'axios';
import { Highscores } from './menu';
const url: string = 'https://spicybook-server.herokuapp.com/highscores';

export const getData = (): Highscores[] => {
    let resultData: Highscores[];
    axios.get(url)
        .then(data => resultData = data.data)
        .then(elem => {
            data = elem;
        })
        .catch(err => console.log(err))
    return resultData;
}
export const postData = (payload: Highscores): void => {
    axios.post(url, {
        payload
    })
        .catch(err => console.log(err))
}

getData();
export let data: Highscores[];