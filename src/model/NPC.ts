import MainScene from "~/scenes/MainScene";
import {Dialog} from "~/model/Dialog";

export class NPC extends Phaser.Physics.Arcade.Sprite {

    dialog: Dialog;

    constructor(config) {
        super(config.scene, config.x, config.y, config.key);

        config.scene.add.existing(this);
        config.scene.physics.world.enable(this);

        MainScene.createAnimation(config.scene, config.key, config.key, config.frameStart, config.frameStop, config.frameRate);
        this.anims.play(config.key, true);

        this.dialog = new Dialog();
    }
}
