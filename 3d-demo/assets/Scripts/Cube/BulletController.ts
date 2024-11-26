import {
    _decorator,
    Component,
    Input,
    input,
    instantiate,
    Node,
    Prefab,
    RigidBody,
    Vec3
} from 'cc';
const {ccclass, property} = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {
    @property(Prefab)
    public bullet: Prefab | null = null;

    @property
    public speed: number = 0;

    @property(Node)
    public bulletParent: Node | null = null;

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart() {
        const bullet = instantiate(this.bullet);
        bullet.setParent(this.bulletParent);
        bullet.setWorldPosition(this.node.position);

        const rgb = bullet.getComponent(RigidBody);
        rgb.setLinearVelocity(new Vec3(0, 0, -this.speed));
    }
}
