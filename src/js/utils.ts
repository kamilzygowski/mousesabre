import { Highscores } from "./menu";
export const debounce = (func: Function, interval: number): Function => {
  let timeout: NodeJS.Timer;
  return function (): void {
    const context: any = this, args: IArguments = arguments;
    const later = function (): void {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, interval || 200);
  }
}
export const collision = (cursor: any, enemy: any): number => {
  const dx: number = cursor.x - enemy.x;
  const dy: number = cursor.y - enemy.y;
  const distance: number = Math.sqrt(dx * dx + dy * dy);
  return distance;
}
export const createGrid = (sqmSize: number, parentArray: Array<[]>): void => {
  const width: number = window.innerWidth;
  const height: number = window.innerHeight;
  const gridX: number = Math.ceil(width / sqmSize);
  const gridY: number = Math.ceil(height / sqmSize);
  for (let i = 0; i < gridY; i++) {
    const newRow: Array<number> = Array.from(Array(gridX))
    for (let y = 0; y < newRow.length; y++) {
      newRow[y] = 0;
    }
    parentArray.push(newRow)
  }
}
export const fakeHistoryBack = (window: Window, location: Location): void => {
  history.replaceState(null, document.title, location.pathname + "#!/stealingyourhistory");
  history.pushState(null, document.title, location.pathname);
  const BASIC_URL: string = location.href;
  window.addEventListener("popstate", (): void => {
    if (location.hash === "#!/stealingyourhistory") {
      history.replaceState(null, document.title, location.pathname);
      setTimeout(function () {
        location.replace(BASIC_URL);
      }, 0);
    }
  }, false);
}
export const bubbleSort = (arr: number[], growing: boolean): number[] => {
  //Outer pass
  for (let i = 0; i < arr.length; i++) {
    //Inner pass
    for (let j = 0; j < arr.length - i - 1; j++) {
      //Value comparison using ascending order
      if (growing) {
        if (arr[j + 1] < arr[j]) {
          //Swapping
          [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
        }
      }
      if (!growing) {
        if (arr[j + 1] > arr[j]) {
          //Swapping
          [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
        }
      }
    }
  };
  return arr;
}
export const bubbleSortCustom = (arr: Highscores[], growing: boolean): Highscores[] => {
  if(arr === undefined) setTimeout(() => window.location.reload(), 750);
  //Outer pass
  for (let i = 0; i < arr.length; i++) {
    //Inner pass
    for (let j = 0; j < arr.length - i - 1; j++) {
      //Value comparison using ascending order
      if (growing) {
        if (arr[j + 1].score < arr[j].score) {
          //Swapping
          [arr[j + 1].score, arr[j].score] = [arr[j].score, arr[j + 1].score]
        }
      }
      if (!growing) {
        if (arr[j + 1].score > arr[j].score) {
          //Swapping
          [arr[j + 1].score, arr[j].score] = [arr[j].score, arr[j + 1].score]
          const prevName = arr[j + 1].name;
          arr[j + 1].name = arr[j].name
          arr[j].name = prevName
        }
      }
    }

  };
  return arr;
}