import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property(Label)
    hightestScore: Label = null;
    @property(Label)
    currentScore: Label = null;

    showUI(highestScore: number, currentScore: number) {
        this.node.active = true;
        this.hightestScore.string = highestScore.toString();
        this.currentScore.string = currentScore.toString();
    }
}
