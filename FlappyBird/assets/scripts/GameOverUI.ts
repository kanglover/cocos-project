import { _decorator, Component, Label, Sprite, Node, director } from 'cc';
import { GameData } from './GameData';

const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {

    @property(Label)
    curScoreLabel: Label = null;
    @property(Label)
    bestScoreLabel: Label = null;
    @property(Sprite)
    newScore: Sprite = null;
    @property([Node])
    medalArray: Node[] = [];

    show(curScore: number, bestScore: number) {
        this.node.active = true;
        this.curScoreLabel.string = curScore.toString();
        this.bestScoreLabel.string = bestScore.toString();

        if (curScore > bestScore) {
            this.newScore.node.active = true;
        }
        else {
            this.newScore.node.active = false;
        }

        let index = Math.floor(curScore / 10);
        if (index > 3) {
            index = 3;
        }
        this.medalArray[index].active = true;
    }

    hide() {
        this.node.active = false;
    }

    onPlayButtonClick() {
        director.loadScene(director.getScene().name);
        GameData.resetScore();
    }
}

