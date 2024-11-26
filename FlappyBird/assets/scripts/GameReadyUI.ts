import { _decorator, Component, Input, input } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameReadyUI')
export class GameReadyUI extends Component {
    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart() {
        this.node.emit('startGame');
    }

    showUI() {
        this.node.active = true;
    }

    hideUI() {
        this.node.active = false;
    }
}
