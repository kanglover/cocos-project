import { _decorator, Collider2D, Component, Contact2DType, Animation, Sprite, AudioClip } from 'cc';
import { Bullet } from './Bullet';
import { GameManager } from './GameManager';
import { EntityManager } from './EntityManager';
import { AudioMgr } from './AudioMgr';

const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property
    speed: number = 100;
    @property
    hp: number = 1;

    @property(Animation)
    anim: Animation = null;
    @property
    animHit = '';
    @property
    animDown = '';

    @property
    score: number = 100;

    @property(AudioClip)
    downAudio: AudioClip = null;

    private collider: Collider2D = null;

    private readonly boundary = -580;

    private dead: boolean = false;

    die() {
        if (this.dead) {
            return;
        }
        GameManager.instance.addScore(this.score);
        AudioMgr.inst.playOneShot(this.downAudio, 1.0);

        // 死亡后禁用碰撞器，避免重复触发碰撞事件
        this.collider && (this.collider.enabled = false);
        // 等动画播放完毕再销毁
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 1);
        this.dead = true;
    }

    kill() {
        if (this.hp <= 0) {
            return;
        }
        this.hp = 0;
        this.anim.play(this.animDown);
        this.die();
    }

    /**
     * 子弹和敌机发生碰撞事件（前提要设置碰撞分组，这样敌机之间就不会发生碰撞）
     */
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        this.hp--;

        this.anim.play(this.hp > 0 ? this.animHit : this.animDown);

        // 禁用子弹碰撞器，避免重复触发碰撞事件
        if (otherCollider.getComponent(Bullet)) {
            otherCollider.enabled = false;
            otherCollider.getComponent(Sprite).enabled = false;
        }

        if (this.hp <= 0) {
            this.die();
        }
    }

    protected start() {
        this.collider = this.node.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected onDestroy() {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact);
        }

        EntityManager.instance.removeEnemy(this.node);
    }

    protected update(deltaTime: number) {
        if (this.hp <= 0) {
            return;
        }
        const p = this.node.position;
        this.node.setPosition(p.x, p.y - this.speed * deltaTime);

        if (p.y < this.boundary) {
            this.node.destroy();
        }
    }
}
