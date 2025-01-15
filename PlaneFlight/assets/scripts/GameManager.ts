import { _decorator, AudioClip, Component, director, Node } from 'cc';
import { ScoreUI } from './ScoreUI';
import { BombUI } from './BombUI';
import { PlayerHpUI } from './PlayerHpUI';
import { Player } from './Player';
import { GameOverUI } from './GameOverUI';
import { AudioMgr } from './AudioMgr';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;

    @property
    bombNumber: number = 0;
    @property(BombUI)
    bombUI: BombUI = null;

    @property(PlayerHpUI)
    hpUI: PlayerHpUI = null;

    @property
    score: number = 0;
    @property(ScoreUI)
    scoreUI: ScoreUI = null;

    @property(Player)
    player: Player = null;
    @property(Node)
    pauseBtn: Node = null;
    @property(Node)
    resumeBtn: Node = null;

    @property(GameOverUI)
    gameOverUI: GameOverUI = null;

    @property(AudioClip)
    bgm: AudioClip = null;
    @property(AudioClip)
    gameOverAudio: AudioClip = null;
    @property(AudioClip)
    btnClickAudio: AudioClip = null;

    addBomb() {
        this.bombNumber++;
        this.bombUI.setNumber(this.bombNumber);
    }

    hasBomb() {
        return this.bombNumber > 0;
    }

    useBomb() {
        if (!this.hasBomb()) {
            return;
        }
        this.bombNumber--;
        this.bombUI.setNumber(this.bombNumber);
    }

    addScore(score: number) {
        this.score += score;
        this.scoreUI.updateScore(this.score);
    }

    updatePlayerHp(hp: number) {
        this.hpUI.updateHp(hp);
    }

    onPauseBtnClick() {
        AudioMgr.inst.playOneShot(this.btnClickAudio, 1.0);
        AudioMgr.inst.pause();

        director.pause();
        this.player.disableControl();
        this.pauseBtn.active = false;
        this.resumeBtn.active = true;
    }

    onResumeBtnClick() {
        AudioMgr.inst.playOneShot(this.btnClickAudio, 1.0);
        AudioMgr.inst.resume();

        director.resume();
        this.player.enableControl();
        this.pauseBtn.active = true;
        this.resumeBtn.active = false;
    }

    onRestartBtnClick() {
        this.onResumeBtnClick();
        director.loadScene(director.getScene().name);
    }

    onQuitBtnClick() {
        director.loadScene('start');
    }

    gameOver() {
        AudioMgr.inst.playOneShot(this.gameOverAudio);

        this.onPauseBtnClick();

        let highestScore = parseInt(localStorage.getItem('highestScore'), 10) || 0;
        if (this.score > highestScore) {
            highestScore = this.score;
            localStorage.setItem('highestScore', highestScore.toString());
        }

        this.gameOverUI.showUI(highestScore, this.score);
    }

    static get instance() {
        return this._instance;
    }

    protected start(): void {
        AudioMgr.inst.play(this.bgm, 0.2);
    }

    // 在 onLoad 方法中初始化单例，不然获取不到 UI 实例
    protected onLoad() {
        GameManager._instance = this;
    }
}
