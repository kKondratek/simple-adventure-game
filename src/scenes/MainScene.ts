import Phaser from 'phaser'
import GameObject = Phaser.GameObjects.GameObject;
import {NPC} from "~/model/NPC";


export default class MainScene extends Phaser.Scene {

    private platform?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private kingNPC?: NPC;
    private cam?: Phaser.Cameras.Scene2D.Camera;
    private isDialog?: boolean;
    private gameStarted?: boolean;
    private playBtn?: Phaser.GameObjects.Text;
    private graphics?: Phaser.GameObjects.Graphics;

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
        MainScene.createAligned(this, 2000, 'b10', 0);
        MainScene.createAligned(this, 2000, 'b9', 0.3);
        MainScene.createAligned(this, 2000, 'b8', 0.4);
        MainScene.createAligned(this, 2000, 'b7', 0.5);
        MainScene.createAligned(this, 2000, 'b6', 0.6);
        MainScene.createAligned(this, 2000, 'b5', 0.7);
        MainScene.createAligned(this, 2000, 'b4', 0.8);
        MainScene.createAligned(this, 2000, 'b3', 0.9);
        MainScene.createAligned(this, 2000, 'b2', 1);

        this.platform = this.physics.add.staticGroup();
        MainScene.createPlatformAligned(this, 2000, 'platform', this.platform);

        const dialogContent: { [key: number]: string; } = {};
        dialogContent[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
            ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        dialogContent[1] = 'Non mea infinitum inquirere judicandi uno cunctatus. Im id satis illam vitae. ' +
            'Allatae gallice lor deceret vix jam deo. Vetus ut voces otium nasci dicam du. ';
        dialogContent[2] = 'Dat sufficiunt sae jam mem accidentia affirmabam indubitati. ' +
            'Ne optime florum nescio gi facile vitari. Ex ente et fide aspi. Ab lente gi to sexta tactu istud. ' +
            'Itaque putare primam nul vul. Fuse ibi unde vidi fuit hic. Ab ostensum se potestis reversus reliquis' +
            ' ut. Lor existeret somniemus ego remotiora tantumque terminari judicandi rea.';

        this.kingNPC = new NPC({
            scene: this,
            x: 1000,
            y: 480,
            key: 'king-idle',
            frameStart: 0,
            frameStop: 5,
            frameRate: 6,
            dialog: {
                scene: this,
                content: dialogContent,
                contentSize: 3,
                NPCPosition: 1000
            }
        })
            .setSize(30, 80)
            .setOffset(74, 37);

        this.player = this.physics.add.sprite(-40, 480, 'player-idle')
            .setBounce(0.1)
            .setCollideWorldBounds(false)
            .setSize(30, 80)
            .setOffset(71, 47);

        MainScene.createAnimation(this, 'right', 'player-run-right', 0, 7, 12);
        MainScene.createAnimation(this, 'left', 'player-run-left', 0, 7, 12);
        MainScene.createAnimation(this, 'idle', 'player-idle', 0, 5, 6);
        MainScene.createAnimation(this, 'crouch', 'player-crouch', 0, 7, 6);
        MainScene.createAnimation(this, 'king-idle', 'king-idle', 0, 5, 6);

        this.physics.add.collider([this.player, this.kingNPC], this.platform);

        MainScene.createAligned(this, 2000, 'grass', 1.1);
        MainScene.createAligned(this, 2000, 'ground', 1.2);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, 2000, 1000);

        this.graphics = this.add.graphics({})
        this.graphics?.fillStyle(0x303030, 0.5);
        this.graphics?.fillRect(0, 0, 800, 600);

        this.playBtn = this.make.text({
            x: 350,
            y: 300,
            text: 'PLAY',
            style: {
                font: `bold 30px Arial`,
                fillColor: 0xffffff
            }
        }, true)
            .setInteractive()
            .on('pointerover', () => {
                this.playBtn?.setTint(0xff0000);
            })
            .on('pointerout', () => {
                this.playBtn?.clearTint();
            })
            .on('pointerdown', () => {
                this.startGame();
                this.playBtn?.clearTint();
                this.playBtn?.on('pointerover', () => {
                })
            });
        this.gameStarted = false;
    }

    update() {
        this.cam?.startFollow(this.player as GameObject, true, 1, 0.01, -100, 180);

        if (!this.cursors) {
            return;
        }

        // @ts-ignore
        if (this.cursors.right?.isDown && !this.isDialog && this.gameStarted) {
            this.player?.setVelocityX(180);
            this.player?.anims.play('right', true);
        } else if (this.cursors.left?.isDown && !this.isDialog && this.gameStarted) {
            this.player?.setVelocityX(-180);
            this.player?.anims.play('left', true);
        } else if (this.cursors.down?.isDown && !this.isDialog && this.gameStarted) {
            this.player?.setVelocityX(0);
            this.player?.anims.play('crouch', true);
            console.log('elo');
        } else if (this.gameStarted) {
            this.player?.setVelocityX(0);
            this.player?.anims.play('idle', true);
        }

        // @ts-ignore
        if (this.player?.x >= 2050) {
            // @ts-ignore
            this.player.x = -20;
        }
        // @ts-ignore
        if (this.player?.x <= -50) {
            // @ts-ignore
            this.player.x = 2020;
        }

        // @ts-ignore
        if (!this.gameStarted && this.player?.x >= 290) {
            this.gameStarted = true;

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

    /**
     * Duplicates texture to the given length.
     */
    private static createAligned(scene: Phaser.Scene, length: number, texture: string, scrollFactor: number) {
        let x = 0;
        let n = 0;
        do {
            const m = scene.add.image(x, scene.scale.height, texture)
                .setOrigin(0, 1)
                .setScrollFactor(scrollFactor)

            if (scrollFactor == 0) {
                break;
            }
            x += m.width;
        } while (x < length)
    }

    /**
     * Duplicates platform to the given length.
     */
    private static createPlatformAligned(scene: Phaser.Scene, platformLength: number, texture: string,
                                         platform: Phaser.Physics.Arcade.StaticGroup) {
        let x = 0;
        while (x < platformLength) {
            const m = platform.create(x, scene.scale.height * 0.954, texture)

            x += m.width;
        }
    }

    private startGame() {
        this.add.tween({
            targets: [this.graphics, this.playBtn],
            duration: 1200,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            onComplete: () => {
                this.player?.setVelocityX(180);
                this.player?.anims.play('right', true);
            }
        })
    }
}
