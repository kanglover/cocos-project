/**
 * 敌机 & 奖励管理器
 */
import { _decorator, AudioClip, Component, EventTouch, Input, input, instantiate, math, Node, Prefab } from 'cc';
import { Enemy } from './Enemy';
import { GameManager } from './GameManager';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('EntityManager')
export class EntityManager extends Component {
    @property(Prefab)
    smallEnemyPrefab: Prefab = null;
    @property
    smallEnemySpawnRate: number = 1;

    @property(Prefab)
    mediumEnemyPrefab: Prefab = null;
    @property
    mediumEnemySpawnRate: number = 3;

    @property(Prefab)
    bigEnemyPrefab: Prefab = null;
    @property
    bigEnemySpawnRate: number = 10;

    @property(Prefab)
    twoShootRewardPrefab: Prefab = null;
    @property(Prefab)
    bombRewardPrefab: Prefab = null;
    @property
    rewardSpawnRate: number = 15;

    @property([Node])
    enemyArray: Node[] = [];

    @property(AudioClip)
    useBombAudio: AudioClip = null;

    private lastClickTime: number = 0;

    static _instance: EntityManager;

    spawnSmallEnemy() {
        const enemy = this.spawnEntity(this.smallEnemyPrefab, 215, 445);
        this.enemyArray.push(enemy);
    }

    spawnMediumEnemy() {
        const enemy = this.spawnEntity(this.mediumEnemyPrefab, 205, 475);
        this.enemyArray.push(enemy);
    }

    spawnBigEnemy() {
        const enemy = this.spawnEntity(this.bigEnemyPrefab, 155, 555);
        this.enemyArray.push(enemy);
    }

    spawnReward() {
        const rewardPrefab = math.randomRangeInt(0, 2) === 0
            ? this.twoShootRewardPrefab
            : this.bombRewardPrefab;
        this.spawnEntity(rewardPrefab, 207, 474);
    }

    spawnEntity(entityPrefab, maxPositionX, positionY) {
        const prefab = instantiate(entityPrefab);
        this.node.addChild(prefab);

        const positionX = math.randomRangeInt(-maxPositionX, maxPositionX);
        prefab.setPosition(positionX, positionY);
        return prefab;
    }

    onDoubleClick() {
        if (!GameManager.instance.hasBomb()) {
            return;
        }
        GameManager.instance.useBomb();
        AudioMgr.inst.playOneShot(this.useBombAudio);

        for (let enemy of this.enemyArray) {
            enemy.getComponent(Enemy).kill();
        }
    }

    onTouchEnd(event: EventTouch) {
        const now = Date.now();
        if (now - this.lastClickTime < 200) {
            this.onDoubleClick();
        }
        this.lastClickTime = now;
    }

    removeEnemy(enemy: Node) {
        const index = this.enemyArray.indexOf(enemy);
        if (index === -1) {
            return;
        }

        this.enemyArray.splice(index, 1);
    }

    static get instance() {
        return this._instance;
    }

    protected start() {
        this.schedule(this.spawnSmallEnemy, this.smallEnemySpawnRate);
        this.schedule(this.spawnMediumEnemy, this.mediumEnemySpawnRate);
        this.schedule(this.spawnBigEnemy, this.bigEnemySpawnRate);
        this.schedule(this.spawnReward, this.rewardSpawnRate);
    }

    protected onLoad() {
        EntityManager._instance = this;
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected destroyed() {
        this.unschedule(this.spawnSmallEnemy);
        this.unschedule(this.spawnMediumEnemy);
        this.unschedule(this.spawnBigEnemy);
    }
}

