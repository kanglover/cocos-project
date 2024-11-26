import {
    _decorator,
    Collider2D,
    Component,
    Contact2DType,
    Input,
    input,
    RigidBody2D,
    Vec2,
    Animation,
    AudioClip
} from 'cc';
import { ColliderTag } from './Defines';
import { AudioMgr } from './AudioMgr';

const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {
    @property
    rotationSpeed = 10;
    @property(AudioClip)
    clickAudio: AudioClip = null;

    private rgd2d: RigidBody2D = null;
    private canControl = false;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        this.rgd2d = this.getComponent(RigidBody2D);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    update(deltaTime: number) {
        if (!this.canControl) {
            return;
        }

        this.node.angle -= this.rotationSpeed * deltaTime;

        if (this.node.angle < -60) {
            this.node.angle = -60;
        }
    }

    onTouchStart() {
        if (!this.canControl) {
            return;
        }

        this.rgd2d.linearVelocity = new Vec2(0, 10);
        this.node.angle = 30;

        AudioMgr.inst.playOneShot(this.clickAudio, 0.5);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {

        if (otherCollider.tag === ColliderTag.Land || otherCollider.tag === ColliderTag.Pipe) {
            this.node.emit('over');
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag === ColliderTag.PipeMiddle) {
            this.node.emit('pass');
        }
    }

    enableControl() {
        this.canControl = true;
        this.rgd2d.enabled = true;
        this.getComponent(Animation).enabled = true;
    }

    disableControl() {
        this.canControl = false;
        this.rgd2d.enabled = false;
        this.getComponent(Animation).enabled = false;
    }

    disableControlNotRGD() {
        this.canControl = false;
        this.getComponent(Animation).enabled = false;
    }
}
