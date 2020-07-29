export class Dialog {
    private readonly borderThickness: number;
    private readonly borderColor: number;
    private readonly borderAlpha: number;
    private readonly windowAlpha: number;
    private readonly windowColor: number;
    private readonly windowHeight: number;
    private readonly padding: number;
    private readonly btnColor: string;
    private readonly dialogSpeed: number;
    private readonly content: { [key:number]:string; };
    private eventCounter: number;
    private visible: boolean;
    private graphics?: Phaser.GameObjects.Graphics;
    private scene: any;
    private closeBtn?: Phaser.GameObjects.Text;
    private nextBtn?: Phaser.GameObjects.Text;
    private previousBtn?: Phaser.GameObjects.Text;
    private text?: Phaser.GameObjects.Text;
    private dialog: any;
    private timerEvent: any;
    private playerPosition?: number;
    private textPointer: number;
    private contentSize?: number;
    private disabledBtnColor: number;

    constructor(config) {
        this.scene = config.scene;

        this.borderThickness = config.borderThickness || 3;
        this.borderColor = config.borderColor || 0x907748;
        this.borderAlpha = config.borderAlpha || 1;
        this.windowAlpha = config.windowAlpha || 0.8;
        this.windowColor = config.windowColor || 0x303030;
        this.windowHeight = config.windowHeight || 150;
        this.padding = config.padding || 32;
        this.btnColor = config.btnColor || 'darkgoldenrod';
        this.dialogSpeed = config.dialogSpeed || 4;
        this.disabledBtnColor = config.disabledBtnColor || 0x303030;

        this.content = config.content;
        this.contentSize = config.contentSize;

        // used for animating the text
        this.eventCounter = 0;
        // if the dialog window is shown
        this.visible = true;
        this.textPointer = 0;
    }

    openWindow(playerPosition: number) {
        this.playerPosition = playerPosition;
        this.createWindow();
    }

    // Creates dialog window
    private createWindow() {
        const dimensions = this.calculateWindowDimensions(this.getGameWidth());
        this.graphics = this.scene.add.graphics();

        this.createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this.createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);

        this.createCloseWindowButton();
        // @ts-ignore
        this.createButtonBorder(this.playerPosition + 46 + this.getGameWidth() / 2,60);
        this.createNextTextButton();
        // @ts-ignore
        this.createButtonBorder(this.playerPosition + 46 + this.getGameWidth() / 2, 190);

        this.createPreviousTextButton();
        // @ts-ignore
        this.createButtonBorder(this.playerPosition + 22+ this.getGameWidth() / 2, 190);
        this.previousBtn?.setFill(this.disabledBtnColor);

        this.setDialogText(this.content[this.textPointer] + '');
    }

    // Gets the width of the game (based on the scene)
    private getGameWidth(): number {
        return this.scene.sys.game.config.width;
    }

    // Gets the height of the game (based on the scene)
    // private getGameHeight(): number {
    //     return this.scene.sys.game.config.height;
    // }

    // Calculates where to place the dialog window based on the game size
    private calculateWindowDimensions(width) {
        // @ts-ignore
        let x = this.playerPosition + 130 - width / 2;
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
    private createCloseWindowButton() {
        const dialogRef = this;
        if (this.playerPosition) {
            this.closeBtn = this.createButton(this.playerPosition + 52 + this.getGameWidth() / 2,
                62, 'X', 14);
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
    }

    private createNextTextButton() {
        if (this.playerPosition) {
            this.nextBtn = this.createButton(this.playerPosition + 52 + this.getGameWidth() / 2,
                41 + this.windowHeight, '>', 16);

            this.nextBtn?.on('pointerover', () => {
                    this.nextBtn?.setTint(0xff0000);
            });
            this.nextBtn?.on('pointerout', () => {
                this.nextBtn?.clearTint();
            });
            this.nextBtn?.on('pointerdown', () => {
                    this.nextText();
            });
        }
    }

    private createPreviousTextButton() {
        if (this.playerPosition) {
            this.previousBtn = this.createButton(this.playerPosition + 27 + this.getGameWidth() / 2,
                41 + this.windowHeight, '<', 16);

            this.previousBtn?.on('pointerover', () => {
                    this.previousBtn?.setTint(0xff0000);
            });
            this.previousBtn?.on('pointerout', () => {
                this.previousBtn?.clearTint();
            });
            this.previousBtn?.on('pointerdown', () => {
                    this.previousText();
            });
        }
    }

    private createButton(x: number, y: number, sign: string, size: number): Phaser.GameObjects.Text {
        return this.scene.make.text({
            x: x,
            y: y,
            text: sign,
            style: {
                font: `bold ${size}px Arial`,
                fill: this.btnColor
            }
        }).setInteractive();
    }

    private createButtonBorder(x: number, y: number) {
        this.graphics?.strokeRect(x, y, 20, 20);
    }

    private toggleWindow() {
        if (this.text) this.text.visible = false;
        if (this.graphics) this.graphics.visible = false;
        if (this.closeBtn) this.closeBtn.visible = false;
        if (this.nextBtn) this.nextBtn.visible = false;
        if (this.previousBtn) this.previousBtn.visible = false;
        this.scene.isDialog = false;
        this.textPointer = 0;
    }

    private setDialogText(text) {
        this.eventCounter = 0;
        this.dialog = text.split('');
        if (this.timerEvent) this.timerEvent.remove();

        let tempText = '';
        this.setText(tempText);

        this.timerEvent = this.scene.time.addEvent({
            delay: 150 - (this.dialogSpeed * 30),
            callback: this.animateText,
            callbackScope: this,
            loop: true
        });

        // @ts-ignore
        // if (this.textPointer == this.contentSize - 1) {
        //     this.nextBtn?.disableInteractive();
        // }
    }

    private setText(text) {
        // Reset the dialog
        if (this.text) this.text.destroy();

        if (this.playerPosition) {
            const x = this.playerPosition - 260;
            const y = 70;
            this.text = this.scene.make.text({
                x,
                y,
                text,
                style: {
                    wordWrap: {width: this.getGameWidth() - (this.padding * 2) - 25}
                }
            });
        }
    }

    private animateText() {
        this.eventCounter++;
        this.text?.setText(this.text.text + this.dialog[this.eventCounter - 1]);
        if (this.eventCounter === this.dialog.length) {
            this.timerEvent.remove();
        }
    }

    private nextText() {
        // @ts-ignore
        if (this.textPointer < this.contentSize - 1) {
            this.setDialogText(this.content[++this.textPointer]);
            // @ts-ignore
            if (this.textPointer + 1 === this.contentSize) {
                // @ts-ignore
                this.changeBtnColor(this.nextBtn, this.disabledBtnColor);
            }
            if (this.textPointer === 1) {
                // @ts-ignore
                this.changeBtnColor(this.previousBtn, this.btnColor);
            }
        }
    }

    private previousText() {
        // @ts-ignore
        if (this.textPointer > 0) {
            this.setDialogText(this.content[--this.textPointer]);
            if (this.textPointer === 0) {
                // @ts-ignore
                this.changeBtnColor(this.previousBtn, this.disabledBtnColor);
            }
            if (this.textPointer + 1 !== this.contentSize) {
                // @ts-ignore
                this.changeBtnColor(this.nextBtn, this.btnColor);
            }
        }
    }

    private changeBtnColor(btn: Phaser.GameObjects.Text, color) {
        btn.setFill(color);
    }
}
