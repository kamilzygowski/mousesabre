export const debounce = (func:Function, interval:number):Function => {
    let timeout:NodeJS.Timer;
    return function () {
      const context = this, args = arguments;
      const later = function () {
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