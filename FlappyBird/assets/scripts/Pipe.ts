import { _decorator, Component} from 'cc';
import { GameManager } from './GameManager';

const {ccclass} = _decorator;

@ccclass('Pipe')
export class Pipe extends Component {
    private moveSpeed;
    start() {
        this.moveSpeed = GameManager.instance.moveSpeed;
    }

    update(deltaTime: number) {
        const distance = this.moveSpeed * deltaTime;
        const pos = this.node.position;
        this.node.setPosition(pos.x - distance, pos.y);
        if (pos.x < -900) {
            this.node.destroy();
        }
    }
}
