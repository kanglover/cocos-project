import { _decorator, Component, instantiate, math, Prefab } from 'cc';
import { Pipe } from './Pipe';

const { ccclass, property } = _decorator;

@ccclass('PipeSpawner')
export class PipeSpawner extends Component {
    @property(Prefab)
    pipePrefab: Prefab = null;

    @property
    spawnRate = 0.5;

    private time = 0;
    private isSpawning = false;

    update(deltaTime: number) {
        if (!this.isSpawning) {
            return;
        }

        this.time += deltaTime;

        if (this.time < this.spawnRate) {
            return;
        }

        this.time = 0;
        const pipe = instantiate(this.pipePrefab);
        this.node.addChild(pipe);

        const yOffset = math.randomRangeInt(-300, 300);
        pipe.setPosition(this.node.position.x, this.node.position.y + yOffset);
    }

    start() {
        this.isSpawning = true;
    }

    pause() {
        this.isSpawning = false;

        const children = this.node.children;
        children.forEach((child) => {
            child.getComponent(Pipe).enabled = false;
        });
    }

    getSpawnRate() {
        return this.spawnRate;
    }

    setSpawnRate(rate: number) {
        this.spawnRate = rate;
    }
}

