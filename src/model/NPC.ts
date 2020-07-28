import MainScene from "~/scenes/MainScene";
import {Dialog} from "~/model/Dialog";
import TimerEvent = Phaser.Time.TimerEvent;

export class NPC extends Phaser.Physics.Arcade.Sprite {

    private dialog: Dialog;
    private farDistanceText;

    constructor(config) {
        super(config.scene, config.x, config.y, config.key);

        config.scene.add.existing(this);
        config.scene.physics.world.enable(this);

        MainScene.createAnimation(config.scene, config.key, config.key, config.frameStart, config.frameStop, config.frameRate);
        this.anims.play(config.key, true);

        this.dialog = new Dialog(config.dialog);
        this.setInteractive();

        this.farDistanceText = config.scene.make.text({
            x: this.x - 40,
            y: this.y - 50,
            text: 'Come closer',
            visible: false
        });

        this.on('pointerdown', () => {
            // @ts-ignore
            if (!config.scene.isDialog) {
                if (Math.abs(this.x - config.scene.player?.x) <= 150) {
                    // @ts-ignore
                    this.startDialog(config.scene.player?.x);
                    config.scene.isDialog = true;
                } else {
                    console.log('too far away');
                    this.farDistanceText.visible = true;
                    const timerEvent = this.scene.time.addEvent({
                        delay: 1000,
                        callback: this.hideText,
                        callbackScope: this,
                        loop: false
                    });
                }
            }
        });
    }

    private startDialog(playerPosition: number) {
        this.dialog.openWindow(playerPosition);
    }

    private hideText() {
        this.farDistanceText.visible = false;
    }
}
