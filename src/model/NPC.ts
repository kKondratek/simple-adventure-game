import MainScene from "~/scenes/MainScene";
import {Dialog} from "~/model/Dialog";

export class NPC extends Phaser.Physics.Arcade.Sprite {

    private dialog: Dialog;
    private sign: Phaser.GameObjects.Text;
    private farDistanceText: Phaser.GameObjects.Text;

    constructor(config) {
        super(config.scene, config.x, config.y, config.key);

        config.scene.add.existing(this);
        config.scene.physics.world.enable(this);

        MainScene.createAnimation(config.scene, config.key, config.key, config.frameStart, config.frameStop, config.frameRate);
        this.anims.play(config.key, true);

        this.dialog = new Dialog(config.dialog);
        this.setInteractive();

        this.farDistanceText = config.scene.make.text({
            x: this.x - 50,
            y: this.y - 50,
            text: 'Come closer',
            style: {
                font: '18px'
            },
            visible: false
        });

        this.sign = config.scene.make.text({
            x: this.x + 7,
            y: this.y - 50,
            text: '!',
            visible: false,
            style: {
                font: '22px Arial',
            }
        })

        this.on('pointerdown', () => {
            this.sign.visible = false;
            // @ts-ignore
            if (!config.scene.isDialog) {
                if (Math.abs(this.x - config.scene.player?.x) <= 150) {
                    // @ts-ignore
                    this.startDialog(config.scene.player?.x);
                    config.scene.isDialog = true;
                } else {
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

        this.on('pointerover', () => {
            if (!this.farDistanceText.visible && !config.scene.isDialog) this.sign.visible = true;
        });
        this.on('pointerout', () => {
            this.sign.visible = false;
        });
    }

    private hideText() {
        this.farDistanceText.visible = false;
    }

    private startDialog(playerPosition: number) {
        this.dialog.openWindow(playerPosition);
    }
}
