import Phaser from 'phaser'
import GameObject = Phaser.GameObjects.GameObject;
import {NPC} from "~/model/NPC";


export default class MainScene extends Phaser.Scene {

    private platform?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private kingNPC?: NPC;
    private cam;
    private isDialog?: boolean;

    constructor() {
        super('hello-world');
    }

    preload() {
        this.load.image('b10', 'assets/background/10.png');
        this.load.image('b9', 'assets/background/9.png');
        this.load.image('b8', 'assets/background/8.png');
        this.load.image('b7', 'assets/background/7.png');
        this.load.image('b6', 'assets/background/6.png');
        this.load.image('b5', 'assets/background/5.png');
        this.load.image('b4', 'assets/background/4.png');
        this.load.image('b3', 'assets/background/3.png');
        this.load.image('b2', 'assets/background/2.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('grass', 'assets/grass.png');
        this.load.image('platform', 'assets/platform.png');

        this.load.spritesheet('player-idle', 'assets/player-idle.png',
            {frameWidth: 184, frameHeight: 137});
        this.load.spritesheet('player-run-right', 'assets/player-run-right.png',
            {frameWidth: 184, frameHeight: 137});
        this.load.spritesheet('player-run-left', 'assets/player-run-left.png',
            {frameWidth: 184, frameHeight: 137});
        this.load.spritesheet('player-crouch', 'assets/player-crouch.png',
            {frameWidth: 184, frameHeight: 137});
        this.load.spritesheet('king-idle', 'assets/king-idle.png',
            {frameWidth: 155, frameHeight: 130});
    }

    create() {
        MainScene.createAligned(this, 10, 'b10', 0);
        MainScene.createAligned(this, 11, 'b9', 0.3);
        MainScene.createAligned(this, 12, 'b8', 0.4);
        MainScene.createAligned(this, 13, 'b7', 0.5);
        MainScene.createAligned(this, 14, 'b6', 0.6);
        MainScene.createAligned(this, 15, 'b5', 0.7);
        MainScene.createAligned(this, 16, 'b4', 0.8);
        MainScene.createAligned(this, 17, 'b3', 0.9);
        MainScene.createAligned(this, 18, 'b2', 1);

        this.platform = this.physics.add.staticGroup();
        MainScene.createPlatformAligned(this, 18, 'platform', this.platform);

        const dialogContent : { [key:number]:string; } = {};
        dialogContent[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
            ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        dialogContent[1] = ' Non mea infinitum inquirere judicandi uno cunctatus. Im id satis illam vitae. ' +
            'Allatae gallice lor deceret vix jam deo. Vetus ut voces otium nasci dicam du. '

        this.kingNPC = new NPC({
            scene: this,
            x: 1200,
            y: 480,
            key: 'king-idle',
            frameStart: 0,
            frameStop: 5,
            frameRate: 6,
            dialog: {
                scene: this,
                content: dialogContent,
                contentSize: 2,
                NPCPosition: 1200
            }
        }).setSize(60, 110);

        this.player = this.physics.add.sprite(1000, 480, 'player-idle')
            .setBounce(0.1)
            .setCollideWorldBounds(false)
            .setSize(30, 120)

        MainScene.createAnimation(this, 'right', 'player-run-right', 0, 7, 12);
        MainScene.createAnimation(this, 'left', 'player-run-left', 0, 7, 12);
        MainScene.createAnimation(this, 'idle', 'player-idle', 0, 5, 6);
        MainScene.createAnimation(this, 'crouch', 'player-crouch', 0, 7, 6);
        MainScene.createAnimation(this, 'king-idle', 'king-idle', 0, 5, 6);

        this.physics.add.collider([this.player, this.kingNPC], this.platform);

        MainScene.createAligned(this, 18, 'grass', 1.1);
        MainScene.createAligned(this, 18, 'ground', 1.2);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cam = this.cameras.main;
    }

    update() {
        this.cam.startFollow(this.player as GameObject, true, 1, 0.01, -100, 180);

        if (!this.cursors) {
            return;
        }

        if (this.cursors.right?.isDown && !this.isDialog) {
            this.player?.setVelocityX(180);
            this.player?.anims.play('right', true);
        } else if (this.cursors.left?.isDown && !this.isDialog) {
            this.player?.setVelocityX(-180);
            this.player?.anims.play('left', true);
        } else if (this.cursors.down?.isDown && !this.isDialog) {
            this.player?.setVelocityX(0);
            this.player?.anims.play('crouch', true);
        } else {
            this.player?.setVelocityX(0);
            this.player?.anims.play('idle', true);
        }
    }

    private static createAligned(scene: Phaser.Scene, count: number, texture: string, scrollFactor: number) {
        let x = 0;
        for (let i = 0; i < count; ++i) {
            const m = scene.add.image(x, scene.scale.height, texture)
                .setOrigin(0, 1)
                .setScrollFactor(scrollFactor)

            x += m.width;
        }
    }

    private static createPlatformAligned(scene: Phaser.Scene, count: number, texture: string,
                                         platform: Phaser.Physics.Arcade.StaticGroup) {
        let x = 0;
        for (let i = 0; i < count; ++i) {
            const m = platform.create(x, scene.scale.height * 0.954, texture)

            x += m.width;
        }
    }

    static createAnimation(scene: Phaser.Scene, key: string, spriteSheet: string,
                           startFrame: number, endFrame: number, frameRate: number) {
        scene.anims.create({
            key: key,
            frames: scene.anims.generateFrameNumbers(spriteSheet, {
                start: startFrame, end: endFrame
            }),
            frameRate: frameRate,
            repeat: -1
        });
    }
}
