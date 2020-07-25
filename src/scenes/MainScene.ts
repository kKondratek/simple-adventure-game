import Phaser from 'phaser'
import GameObject = Phaser.GameObjects.GameObject;
import install = Phaser.Loader.FileTypesManager.install;
import {Dialog} from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';


export default class MainScene extends Phaser.Scene {

    private platform?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private king?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private dialog;

    constructor() {
        super('hello-world');
    }

    preload() {
        this.load.scenePlugin('rexuiplugin',
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            'rexUI', 'rexUI');

        // preloading background
        // this.dialogPlugin = this.load.scenePlugin('DialogModalPlugin', 'plugins/dialogPluginJS.js')
        //console.log(this.dialogPlugin);

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

        this.king = this.physics.add.sprite(1800, 490, 'king-idle');
        this.player = this.physics.add.sprite(1000, 485, 'player-idle')
            .setBounce(0.1)
            .setCollideWorldBounds(false);

        MainScene.createAnimation(this, 'right', 'player-run-right', 0, 7, 12);
        MainScene.createAnimation(this, 'left', 'player-run-left', 0, 7, 12);
        MainScene.createAnimation(this, 'idle', 'player-idle', 0, 5, 6);
        MainScene.createAnimation(this, 'crouch', 'player-crouch', 0, 7, 6);
        MainScene.createAnimation(this, 'king-idle', 'king-idle', 0, 5, 6);

        this.physics.add.collider([this.player, this.king], this.platform);
        // this.physics.add.collider(this.king, this.platform);

        MainScene.createAligned(this, 18, 'grass', 1.1);
        MainScene.createAligned(this, 18, 'ground', 1.2);

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.sys.install('DialogModalPlugin', this.dialogPlugin?.plugin.caller);
        // if (this.dialogPlugin) {
        //     install(this.dialogPlugin);
        //     console.log(this.sys.scenePlugin)
        // }
        // this.dialogPlugin
        // console.log(this.sys.plugins.get('DialogModalPlugin'));
        this.dialog = this.rexUI.add.dialog({
                x: 500,
                y: 300,
                width: 500,

                background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            //createLabel(this, 'Title').setDraggable(),
                title: this.rexUI.add.label({
                    background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
                    text: this.add.text(0, 0, 'Title', {
                        fontSize: '24px'
                    }),
                    space: {
                        left: 15,
                        right: 15,
                        top: 10,
                        bottom: 10
                    }
                }),
                //
                // toolbar: [
                //     createLabel(this, 'O'),
                //     createLabel(this, 'X')
                // ],
                //
                // leftToolbar: [
                //     createLabel(this, 'A'),
                //     createLabel(this, 'B')
                // ],
                //
                // content: createLabel(this, 'Content'),
                //
                // description: createLabel(this, 'Description'),
                //
                // choices: [
                //     createLabel(this, 'Choice0'),
                //     createLabel(this, 'Choice1'),
                //     createLabel(this, 'Choice2')
                // ],
                //
                // actions: [
                //     createLabel(this, 'Action0'),
                //     createLabel(this, 'Action1')
                // ],

                space: {
                    left: 20,
                    right: 20,
                    top: -20,
                    bottom: -20,

                    title: 25,
                    // titleLeft: 30,
                    content: 25,
                    description: 25,
                    // descriptionLeft: 20,
                    // descriptionRight: 20,
                    choices: 25,

                    leftToolbarItem: 5,
                    toolbarItem: 5,
                    choice: 15,
                    action: 15,
                },

                expand: {
                    title: false,
                    // content: false,
                    // description: false,
                    // choices: false,
                    // actions: true,
                },

                align: {
                    title: 'center',
                    // content: 'right',
                    // description: 'left',
                    // choices: 'left',
                    actions: 'right', // 'center'|'left'|'right'
                },

                click: {
                    mode: 'release'
                }
            })
            .setDraggable('background')   // Draggable-background
            .layout()
            // .drawBounds(this.add.graphics(), 0xff0000)
            .popUp(1000)
        // .moveFrom('-=400', undefined, 1000, 'Bounce')

        const print = this.add.text(0, 0, '');
        this.dialog
            .on('button.click', function (button, groupName, index, pointer, event) {
                print.text += groupName + '-' + index + ': ' + button.text + '\n';
            }, this)
            .on('button.over', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
            });
    }

    update() {
        const cam = this.cameras.main;
        cam.startFollow(this.player as GameObject, true, 1, 0.01, -100, 180);

        this.king?.anims.play('king-idle', true);

        if (!this.cursors) {
            return;
        }

        if (this.cursors.right?.isDown) {
            this.player?.setVelocityX(180);
            this.player?.anims.play('right', true);

        } else if (this.cursors.left?.isDown) {
            this.player?.setVelocityX(-180);
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

    private static createAnimation(scene: Phaser.Scene, key: string, spriteSheet: string,
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
