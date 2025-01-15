import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerHpUI')
export class PlayerHpUI extends Component {
    @property(Label)
    hpLabel: Label = null;

    updateHp(hp: number) {
        this.hpLabel.string = hp.toString();
    }
}

