import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
    @property(Label)
    scoreLabel: Label = null;

    updateScore(score: number) {
        this.scoreLabel.string = score.toString();
    }
}
