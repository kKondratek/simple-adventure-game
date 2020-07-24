import Phaser from 'phaser'
import GameObject = Phaser.GameObjects.GameObject;

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

        this.load.image('background', 'assets/background.png');
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

        // this.add.image(width * 0.5, height * (1 / 3), 'b10')
        //     .setScrollFactor(0);
        // this.add.image(width * 0.5, height * (1 / 3), 'b9')
        //     .setScrollFactor(0.3);
        // this.add.image(width * 0.5, height * (1 / 3), 'b8')
        //     .setScrollFactor(0.4);
        // this.add.image(width * 0.5, height * (1 / 3), 'b7')
        //     .setScrollFactor(0.5);
        // this.add.image(width * 0.5, height * (1 / 3), 'b6')
        //     .setScrollFactor(0.6);
        // this.add.image(width * 0.5, height * (1 / 3), 'b5')
        //     .setScrollFactor(0.7);
        // this.add.image(width * 0.5, height * (1 / 3), 'b4')
        //     .setScrollFactor(0.8);
        // this.add.image(width * 0.5, height * (1 / 3), 'b3')
        //     .setScrollFactor(0.9);
        this.createAligned(this, 2, 'b10', 0);
        this.createAligned(this, 2, 'b9', 0.3);
        this.createAligned(this, 2, 'b8', 0.4);
        this.createAligned(this, 2, 'b7', 0.5);
        this.createAligned(this, 2, 'b6', 0.6);
        this.createAligned(this, 2, 'b5', 0.7);
        this.createAligned(this, 2, 'b4', 0.8);
        this.createAligned(this, 2, 'b3', 0.9);
        this.createAligned(this, 2, 'b2', 1);
        // this.add.image(width * 0.5, height * (1 / 3), 'b2')
        //     .setScrollFactor(1);


        //  this.add.image(400, 200, 'background');

        this.platform = this.physics.add.staticGroup();
        const group = this.platform.create(400, 578, 'platform');

        this.player = this.physics.add.sprite(300,400, 'player-idle');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

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

        this.createAligned(this, 2, 'grass', 1);
        this.createAligned(this, 2, 'ground', 1);

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

    private createAligned(scene: Phaser.Scene, count: number, texture: string, scrollFactor: number) {
        scene.add.image(0, scene.scale.height, texture)
            .setOrigin(0,1)
            .setScrollFactor(scrollFactor)
    }

}
