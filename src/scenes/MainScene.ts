import Phaser from 'phaser'
import GameObject = Phaser.GameObjects.GameObject;
import first = Phaser.Display.Canvas.CanvasPool.first;

export default class MainScene extends Phaser.Scene {

    private platform?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('hello-world');
    }

    preload() {
        // preloading background
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
        this.load.image('platform', 'assets/platform.png')
        this.load.spritesheet('player-idle', 'assets/player-idle.png',
            {frameWidth: 184, frameHeight: 137});
        this.load.spritesheet('player-run-right', 'assets/player-run-right.png',
            {frameWidth: 184, frameHeight: 137});
        this.load.spritesheet('player-run-left', 'assets/player-run-left.png',
            {frameWidth: 184, frameHeight: 137});
        this.load.spritesheet('player-crouch', 'assets/player-crouch.png',
            {frameWidth: 184, frameHeight: 137});
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

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

        this.player = this.physics.add.sprite(1000, 485, 'player-idle');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(false);

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player-run-right', {
                start: 0, end: 7
            }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player-run-left', {
                start: 0, end: 7
            }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player-idle', {
                start: 0, end: 5
            }),
            frameRate: 6
        });

        this.anims.create({
            key: 'crouch',
            frames: this.anims.generateFrameNumbers('player-crouch', {
                start: 0, end: 3
            }),
            frameRate: 6,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platform);

        MainScene.createAligned(this, 18, 'grass', 1);
        MainScene.createAligned(this, 18, 'ground', 1);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const cam = this.cameras.main;
        cam.startFollow(this.player as GameObject, true, 1, 0.01, -100, 180);

        if (!this.cursors) {
            return;
        }

        if (this.cursors.right?.isDown) {
            this.player?.setVelocityX(150);
            this.player?.anims.play('right', true);

        } else if (this.cursors.left?.isDown) {
            this.player?.setVelocityX(-150);
            this.player?.anims.play('left', true);
        } else if (this.cursors.down?.isDown) {
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
            const m = platform.create(x, scene.scale.height * 0.975, texture)

            x += m.width;
        }
    }

}
