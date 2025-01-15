import { _decorator, Component, director } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('StartUI')
export class StartUI extends Component {
    onStartButtonClick() {
        director.loadScene('game');
    }
}

