import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {

    private platform?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('hello-world');
    }

    preload() {
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
        this.add.image(400, 200, 'background');

        this.platform = this.physics.add.staticGroup();
        const group = this.platform.create(400, 578, 'platform');

        this.player = this.physics.add.sprite(100,400, 'player-idle');
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
        this.add.image(400,200, 'grass');
        this.add.image(400, 200, 'ground');

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

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

}
