import {
    _decorator,
    Component,
    EventTouch,
    Input,
    input,
    instantiate,
    Prefab,
    Node,
    Vec3,
    Collider2D,
    Contact2DType,
    Animation,
    Sprite,
    AudioClip
} from 'cc';
import { Reward, RewardType } from './Reward';
import { GameManager } from './GameManager';
import { AudioMgr } from './AudioMgr';

const { ccclass, property } = _decorator;

enum ShootType {
    None,
    Single,
    Double
}

@ccclass('Player')
export class Player extends Component {
    @property(Prefab)
    singleBulletPrefab: Prefab = null;
    @property(Node)
    singleBulletPosition: Node = null;

    @property(Prefab)
    doubleBulletPrefab: Prefab = null;
    @property(Node)
    doubleBulletLeftPosition: Node = null;
    @property(Node)
    doubleBulletRightPosition: Node = null;

    @property(Node)
    bulletParent: Node = null;

    @property
    shootRate: number = 0.5;
    @property
    shootType: ShootType = ShootType.Single;
    @property
    twoShootTime: number = 5;

    @property
    hp: number = 3;

    @property(Animation)
    anim: Animation = null;
    @property
    animHit = '';
    @property
    animDown = '';


    @property(AudioClip)
    bulletAudio: AudioClip = null;
    @property(AudioClip)
    getBombAudio: AudioClip = null;
    @property(AudioClip)
    getTwoShootAudio: AudioClip = null;

    @property
    invincibleTime: number = 1;

    private invincibleTimer: number = 0;
    private isInvincible: boolean = false;
    private shootTimer: number = 0;
    private twoShootTimer: number = 0;
    private collider: Collider2D;
    private lastReward: Reward = null;
    private canControl: boolean = true;

    disableControl() {
        this.canControl = false;
    }

    enableControl() {
        this.canControl = true;
    }

    onTouchMove(event: EventTouch) {
        if (!this.canControl || this.hp <= 0) {
            return;
        }

        const delta = event.getDelta();
        const p = this.node.getPosition();
        const targetPosition = new Vec3(p.x + delta.x, p.y + delta.y, p.z);

        const boundaryX = 230;
        const boundaryY = 380;

        if (targetPosition.x < -boundaryX) {
            targetPosition.x = -boundaryX;
        } else if (targetPosition.x > boundaryX) {
            targetPosition.x = boundaryX;
        }

        if (targetPosition.y < -boundaryY) {
            targetPosition.y = -boundaryY;
        } else if (targetPosition.y > boundaryY) {
            targetPosition.y = boundaryY;
        }

        this.node.setPosition(targetPosition);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        const reward = otherCollider.getComponent(Reward);
        if (reward) {
            // 防止重复碰撞
            if (this.lastReward === reward) {
                return;
            }

            this.onContactToReward(reward);
            this.lastReward = reward;
            return;
        }
        this.onContactToEnemy();
    }

    transitionToOneShoot() {
        this.shootType = ShootType.Single;
    }

    transitionToTwoShoot() {
        this.shootType = ShootType.Double;
        this.twoShootTimer = 0;
    }

    onContactToReward(reward: Reward) {
        switch (reward.rewardType) {
            case RewardType.TwoShoot:
                this.transitionToTwoShoot();
                AudioMgr.inst.playOneShot(this.getTwoShootAudio);
                break;
            case RewardType.Bomb:
                GameManager.instance.addBomb();
                AudioMgr.inst.playOneShot(this.getBombAudio);
                break;
        }

        reward.getComponent(Collider2D).enabled = false;
        reward.getComponent(Sprite).enabled = false;
    }

    changeHp(count: number) {
        this.hp += count;
        GameManager.instance.updatePlayerHp(this.hp);
    }

    onContactToEnemy() {
        if (this.isInvincible) {
            return;
        }

        this.isInvincible = true;

        this.changeHp(-1);

        this.anim.play(this.hp > 0 ? this.animHit : this.animDown);

        if (this.hp <= 0) {
            this.collider && (this.collider.enabled = false);

            this.shootType = ShootType.None;

            // 等动画播放完毕后再结束游戏
            this.scheduleOnce(() => {
                GameManager.instance.gameOver();
            }, 0.5);
        }
    }

    singleShoot(deltaTime: number) {
        this.shootTimer += deltaTime;

        if (this.shootTimer >= this.shootRate) {
            this.shootTimer = 0;
            const singleBullet = instantiate(this.singleBulletPrefab);
            this.bulletParent.addChild(singleBullet);
            singleBullet.setWorldPosition(this.singleBulletPosition.worldPosition);

            AudioMgr.inst.playOneShot(this.bulletAudio, 0.1);
        }
    }

    doubleShoot(deltaTime: number) {
        this.twoShootTimer += deltaTime;
        if (this.twoShootTimer >= this.twoShootTime) {
            this.transitionToOneShoot();
        }

        this.shootTimer += deltaTime;

        if (this.shootTimer >= this.shootRate) {
            this.shootTimer = 0;
            const doubleLeftBullet = instantiate(this.doubleBulletPrefab);
            const doubleRightBullet = instantiate(this.doubleBulletPrefab);
            this.bulletParent.addChild(doubleLeftBullet);
            this.bulletParent.addChild(doubleRightBullet);
            doubleLeftBullet.setWorldPosition(this.doubleBulletLeftPosition.worldPosition);
            doubleRightBullet.setWorldPosition(this.doubleBulletRightPosition.worldPosition);

            AudioMgr.inst.playOneShot(this.bulletAudio, 0.1);
        }
    }

    protected onLoad() {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.collider = this.node.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected start() {
        GameManager.instance.updatePlayerHp(this.hp);
    }

    protected onDestroy() {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact);
        }
    }

    protected update(deltaTime: number) {
        switch (this.shootType) {
            case ShootType.Single:
                this.singleShoot(deltaTime);
                break;
            case ShootType.Double:
                this.doubleShoot(deltaTime);
                break;
        }

        if (this.isInvincible) {
            this.invincibleTimer += deltaTime;
            if (this.invincibleTimer >= this.invincibleTime) {
                this.isInvincible = false;
                this.invincibleTimer = 0;
            }
        }
    }
}
