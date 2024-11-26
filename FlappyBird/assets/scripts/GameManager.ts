import { _decorator, AudioClip, Component, Label, Node } from 'cc';
import { Bird } from './Bird';
import { MoveBackground } from './MoveBackground';
import { PipeSpawner } from './PipeSpawner';
import { GameReadyUI } from './GameReadyUI';
import { GameData } from './GameData';
import { GameOverUI } from './GameOverUI';
import { AudioMgr } from './AudioMgr';

const { ccclass, property } = _decorator;

enum GameState {
    Ready,
    Playing,
    GameOver
}

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;

    @property
    moveSpeed = 100;
    @property(Bird)
    bird: Bird = null;
    @property(MoveBackground)
    background: MoveBackground = null;
    @property(MoveBackground)
    land: MoveBackground = null;
    @property(PipeSpawner)
    pipeSpawner: PipeSpawner = null;
    @property(GameReadyUI)
    gameReadyUI: GameReadyUI = null;
    @property(Node)
    gamingUI: Node = null;
    @property(Label)
    scoreLabel: Label = null;
    @property(GameOverUI)
    gameOverUI: GameOverUI = null;
    @property(AudioClip)
    bgAudio: AudioClip = null;
    @property(AudioClip)
    gameOverAudio: AudioClip = null;

    private gameState: GameState = GameState.Ready;

    static get instance(): GameManager {
        if (!GameManager._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    start() {
        this.transitionToReady();
        AudioMgr.inst.play(this.bgAudio, 0.5);

        this.bird.node.on('pass', this.addScore, this);
        this.bird.node.on('over', this.transitionToGameOver, this);
        this.gameReadyUI.node.on('startGame', this.transitionToPlaying, this);
    }

    onDestroy() {
        this.bird.node.off('pass', this.addScore, this);
        this.bird.node.off('over', this.transitionToGameOver, this);
        this.gameReadyUI.node.off('startGame', this.transitionToPlaying, this);
    }

    transitionToReady() {
        this.gameState = GameState.Ready;
        this.bird.disableControl();
        this.background.disableMove();
        this.land.disableMove();
        this.pipeSpawner.pause();

        this.gameReadyUI.showUI();
        this.gamingUI.active = false;
        this.gameOverUI.hide();
    }

    transitionToPlaying() {
        this.gameState = GameState.Playing;
        this.bird.enableControl();
        this.background.enableMove();
        this.land.enableMove();
        this.pipeSpawner.start();

        this.gameReadyUI.hideUI();
        this.gamingUI.active = true;
    }

    transitionToGameOver() {
        if (this.gameState === GameState.GameOver) {
            return;
        }

        this.gameState = GameState.GameOver;
        this.bird.disableControlNotRGD();
        this.background.disableMove();
        this.land.disableMove();
        this.pipeSpawner.pause();

        this.gamingUI.active = false;
        this.gameOverUI.show(GameData.getScore(), GameData.getBestScore());
        GameData.saveScore();

        AudioMgr.inst.stop();
        AudioMgr.inst.playOneShot(this.gameOverAudio, 0.5);
    }

    addScore() {
        GameData.addToScore(1);
        this.scoreLabel.string = GameData.getScore().toString();

        if (GameData.getScore() % 5 === 0) {
            let rate = this.pipeSpawner.getSpawnRate() - 0.1;
            if (rate > 1.2) {
                rate = 1.2;
            }
            this.pipeSpawner.setSpawnRate(rate);
        }
    }
}
