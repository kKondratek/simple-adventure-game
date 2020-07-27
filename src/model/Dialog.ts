export class Dialog {
    private readonly borderThickness: number;
    private readonly borderColor: number;
    private readonly borderAlpha: number;
    private readonly windowAlpha: number;
    private readonly windowColor: number;
    private readonly windowHeight: number;
    private readonly padding: number;
    private closeBtnColor: string;
    private dialogSpeed: number;
    private eventCounter: number;

    private visible: boolean;

    private content: Array<string>;
    private graphics?: Phaser.GameObjects.Graphics;
    private scene: any;
    private closeBtn?: Phaser.GameObjects.Text;
    private playerPosition?: number;
    private text?: Phaser.GameObjects.Text;

    constructor(config) {
        this.scene = config.scene;

        this.borderThickness = config.borderThickness || 3;
        this.borderColor = config.borderColor || 0x907748;
        this.borderAlpha = config.borderAlpha || 1;
        this.windowAlpha = config.windowAlpha || 0.8;
        this.windowColor = config.windowColor || 0x303030;
        this.windowHeight = config.windowHeight || 150;
        this.padding = config.padding || 32;
        this.closeBtnColor = config.closeBtnColor || 'darkgoldenrod';
        this.dialogSpeed = config.dialogSpeed || 3;

        this.content = new Array<string>(config.content);
        // used for animating the text
        this.eventCounter = 0;
        // if the dialog window is shown
        this.visible = true;
        // the current text in the window
        // this.text;
        // // the text that will be displayed in the window
        // this.dialog;
        // this.graphics;
        // this.closeBtn;
    }

    openWindow(playerPosition: number) {
        this.createWindow(playerPosition)
    }

    // closeWindow() {
    //     // TODO: close button
    //     this.graphics?.destroy();
    // }

    // Creates dialog window
    private createWindow(playerPosition: number) {
        const dimensions = this.calculateWindowDimensions(this.getGameWidth(), playerPosition);
        this.graphics = this.scene.add.graphics();

        this.createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this.createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);

        this.createCloseWindowButton(playerPosition);
        this.createCloseWindowButtonBorder(playerPosition);
    }

    // Gets the width of the game (based on the scene)
    private getGameWidth(): number {
        return this.scene.sys.game.config.width;
    }

    // Gets the height of the game (based on the scene)
    private getGameHeight(): number {
        return this.scene.sys.game.config.height;
    }

    // Calculates where to place the dialog window based on the game size
    private calculateWindowDimensions(width, playerPosition) {
        let x = playerPosition + 130 - width / 2;
        let y = 60;
        let rectWidth = width - (this.padding * 2);
        let rectHeight = this.windowHeight;
        return {
            x,
            y,
            rectWidth,
            rectHeight
        };
    }

    // Creates the border rectangle of the dialog window
    private createInnerWindow(x, y, rectWidth, rectHeight) {
        this.graphics?.fillStyle(this.windowColor, this.windowAlpha);
        this.graphics?.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
    }

    // Creates the border rectangle of the dialog window
    private createOuterWindow(x, y, rectWidth, rectHeight) {
        this.graphics?.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
        this.graphics?.strokeRect(x, y, rectWidth, rectHeight);
    }

    // Creates the close dialog window button
    private createCloseWindowButton(playerPosition: number) {
        const dialogRef = this;
        this.closeBtn = this.scene.make.text({
            x: playerPosition + 52 + this.getGameWidth() / 2, //this.getGameWidth() - this.padding - 14,
            y: 63,
            text: 'X',
            style: {
                font: 'bold 12px Arial',
                fill: this.closeBtnColor
            }
        });
        this.closeBtn?.setInteractive();

        this.closeBtn?.on('pointerover', () => {
            this.closeBtn?.setTint(0xff0000);
        });
        this.closeBtn?.on('pointerout', () => {
            this.closeBtn?.clearTint();
        });
        this.closeBtn?.on('pointerdown', () => {
            dialogRef.toggleWindow();
        });
    }

    private createCloseWindowButtonBorder(playerPosition: number) {
        const x = playerPosition + 46 + this.getGameWidth() / 2;//this.getGameWidth() - this.padding - 20;
        const y = 60
        this.graphics?.strokeRect(x, y, 20, 20);
    }

    private toggleWindow() {
        this.visible = !this.visible;
        if (this.text) this.text.visible = this.visible;
        if (this.graphics) this.graphics.visible = this.visible;
        if (this.closeBtn) this.closeBtn.visible = this.visible;
        this.scene.isDialog = false;
    }
}
