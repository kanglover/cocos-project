import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node, Vec2, RigidBody, Vec3, Collider, ICollisionEvent, ITriggerEvent } from 'cc';
import { FoodController } from './FoodController';
const { ccclass, property } = _decorator;

@ccclass('SphereController')
export class SphereController extends Component {

    private moveDir = Vec2.ZERO;

    private moveForce = 10;
    private rigidBody: RigidBody | null = null;
    private collider: Collider | null = null;

    protected start(): void {
        this.rigidBody = this.getComponent(RigidBody);

        this.collider = this.getComponent(Collider);
        // 地板也是碰撞器，所以最好是监听触发器
        // this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
        // this.collider.on('onCollisionExit', this.onCollisionExit, this);
        // this.collider.on('onCollisionStay', this.onCollisionStay, this);
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    protected onLoad() {
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
    }

    protected onDestroy() {
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
    }

    onCollisionEnter(event: ICollisionEvent) {
        const food = event.otherCollider.getComponent(FoodController);
        food && food.node.destroy();
    }

    onTriggerEnter(event: ITriggerEvent) {
        const food = event.otherCollider.getComponent(FoodController);
        food && food.node.destroy();
    }

    onCollisionExit(other: Collider) {
        // console.log('onTriggerExit', other);
    }

    onCollisionStay(other: Collider) {
        // console.log('onCollisionStay', other);
    }

    onKeyUp(event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.KEY_D:
            case KeyCode.KEY_W:
            case KeyCode.KEY_S:
                this.moveDir = Vec2.ZERO;
                break;
        }
    }

    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this.moveDir = new Vec2(-1, this.moveDir.y);
                break;
            case KeyCode.KEY_D:
                this.moveDir = new Vec2(1, this.moveDir.y);
                break;
            case KeyCode.KEY_W:
                this.moveDir = new Vec2(this.moveDir.x, 1);
                break;
            case KeyCode.KEY_S:
                this.moveDir = new Vec2(this.moveDir.x, -1);
                break;
        }
    }

    onKeyPressing(event: EventKeyboard) {
        // const pos = this.node.position;
        // switch(event.keyCode) {
        //     case KeyCode.KEY_A:
        //         this.node.setPosition(pos.x, pos.y, pos.z - 1)
        //         break;
        //     case KeyCode.KEY_D:
        //         this.node.setPosition(pos.x, pos.y, pos.z + 1)
        //         break;
        //     case KeyCode.KEY_W:
        //         this.node.setPosition(pos.x + 1, pos.y, pos.z)
        //         break;
        //     case KeyCode.KEY_S:
        //         this.node.setPosition(pos.x - 1, pos.y, pos.z)
        //         break;
        // }
    }

    update(deltaTime: number) {
        // this.node.setPosition(this.node.position.x + this.moveDir.y * deltaTime, this.node.position.y, this.node.position.z + this.moveDir.x * deltaTime);
        this.rigidBody.applyForce(new Vec3(this.moveDir.y, 0, this.moveDir.x).multiplyScalar(this.moveForce));
    }
}

