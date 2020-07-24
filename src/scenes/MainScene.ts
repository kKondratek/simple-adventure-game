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
        this.load.spritesheet('dude', 'assets/dude.png',
            {frameWidth: 32, frameHeight: 48});
    }

    create() {
        this.add.image(400, 200, 'background');

        this.platform = this.physics.add.staticGroup();
        const group = this.platform.create(400, 568, 'platform');

        // group.setScale(1)
        //     .refreshBody();

        this.player = this.physics.add.sprite(100,500, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5, end: 8
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0, end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
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
            this.player?.setVelocityX(60);
            this.player?.anims.play('right', true);
        } else if (this.cursors.left?.isDown) {
            this.player?.setVelocityX(-60);
            this.player?.anims.play('left', true);
        } else {
            this.player?.setVelocityX(0);
            this.player?.anims.play('idle', true);
        }
    }

}
