import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {

    @property
    speed: number = 100;
    @property(Node)
    topBg: Node = null;
    @property(Node)
    bottomBg: Node = null;

    private readonly bgHeight = 852;

    update(deltaTime: number) {
        const moveDistance = this.speed * deltaTime;

        const pos1 = this.topBg.position;
        this.topBg.setPosition(pos1.x, pos1.y - moveDistance);
        const pos2 = this.bottomBg.position;
        this.bottomBg.setPosition(pos2.x, pos2.y - moveDistance);

        if (pos1.y < -this.bgHeight) {
            this.topBg.setPosition(pos2.x, pos2.y + this.bgHeight);
        }
        if (pos2.y < -this.bgHeight) {
            this.bottomBg.setPosition(pos1.x, pos1.y + this.bgHeight);
        }
    }
}

