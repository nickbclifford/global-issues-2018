import { Game } from './game';
const game = new Game();

(window as any).game = game;

game.click();
game.click();
game.sellAllData();
game.click();
