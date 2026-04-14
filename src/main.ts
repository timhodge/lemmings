import { Game } from './game';
import level1 from './levels/level1';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = new Game(canvas, level1);
game.start();
