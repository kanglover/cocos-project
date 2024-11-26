import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('MoveBackground')
export class MoveBackground extends Component {

    @property(Node)
    firstMoveNode: Node = null;
    @property(Node)
    secondMoveNode: Node = null;

    private moveSpeed: number;
    private canMove = false;
    private readonly bgWidth = 730;
    private readonly marginDistance = 728;

    start(): void {
        this.moveSpeed = GameManager.instance.moveSpeed;
    }

    update(deltaTime: number) {
        if (!this.canMove) {
            return;
        }

        const moveDistance = this.moveSpeed * deltaTime;

        const p1 = this.firstMoveNode.position;
        this.firstMoveNode.setPosition(p1.x - moveDistance, p1.y);
        const p2 = this.secondMoveNode.position;
        this.secondMoveNode.setPosition(p2.x - moveDistance, p2.y);

        if (p1.x < -this.bgWidth) {
            const p2 = this.secondMoveNode.position;
            this.firstMoveNode.setPosition(p2.x + this.marginDistance, p2.y);
        }

        if (p2.x < -this.bgWidth) {
            const p1 = this.firstMoveNode.position;
            this.secondMoveNode.setPosition(p1.x + this.marginDistance, p1.y);
        }
    }

    enableMove() {
        this.canMove = true;
    }

    disableMove() {
        this.canMove = false;
    }
}
