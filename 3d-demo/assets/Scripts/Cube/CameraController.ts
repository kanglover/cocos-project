import { _decorator, Component, input, Node, Input, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    start() {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchMove(event: EventTouch) {
        const {x, y, z} = this.node.getPosition();
        const moveScale = 0.05;
        this.node.setPosition(x + event.getDeltaX() * moveScale, y + event.getDeltaY() * moveScale, z);
    }

    update(deltaTime: number) {
        
    }
}

