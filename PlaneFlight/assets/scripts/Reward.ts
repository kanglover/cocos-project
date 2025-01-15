import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum RewardType {
    TwoShoot,
    Bomb
}

@ccclass('Reward')
export class Reward extends Component {
    @property
    speed:number = 100;

    @property
    rewardType: RewardType = RewardType.TwoShoot;

    update(deltaTime: number) {
        const p = this.node.position;
        this.node.setPosition(p.x, p.y - this.speed * deltaTime);

        if (this.node.position.y < -580) {
            this.node.destroy();
        }
    }
}

