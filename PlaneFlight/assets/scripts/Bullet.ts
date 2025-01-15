import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property
    speed: number = 500;

    update(deltaTime: number) {
        const p = this.node.position;
        this.node.setPosition(p.x, p.y + this.speed * deltaTime);

        if (p.y > 440) {
            this.node.destroy();
        }
    }
}

