import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BombUI')
export class BombUI extends Component {
    @property(Label)
    numberLabel: Label = null;

    setNumber(number: number) {
        this.numberLabel.string = number.toString();
    }
}

