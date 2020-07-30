export class Dialog {
    private readonly borderThickness: number;
    private readonly borderColor: number;
    private readonly borderAlpha: number;
    private readonly windowAlpha: number;
    private readonly windowColor: number;
    private readonly windowHeight: number;
    private readonly padding: number;
    private readonly btnColor: string;
    private readonly disabledBtnColor: number;
    private readonly dialogSpeed: number;
    private readonly content: { [key:number]:string; };
    private readonly contentSize?: number;
    private scene: any;
    private dialog: any;
    private timerEvent: any;
    private animationCounter: number;
    private playerPosition?: number;
    private textPointer: number;
    private visible: boolean;
    private graphics?: Phaser.GameObjects.Graphics;
    private closeBtn?: Phaser.GameObjects.Text;
    private nextBtn?: Phaser.GameObjects.Text;
    private previousBtn?: Phaser.GameObjects.Text;
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
        this.btnColor = config.btnColor || 'darkgoldenrod';
        this.disabledBtnColor = config.disabledBtnColor || 0x303030;
        this.dialogSpeed = config.dialogSpeed || 4;

        this.content = config.content;
        this.contentSize = config.contentSize;

        this.animationCounter = 0;
        this.textPointer = 0;
        this.visible = true;
    }

    openWindow(playerPosition: number) {
        this.playerPosition = playerPosition;
        this.createWindow();
    }

    private animateText() {
        this.animationCounter++;
        this.text?.setText(this.text.text + this.dialog[this.animationCounter - 1]);
        if (this.animationCounter === this.dialog.length) {
            this.timerEvent.remove();
        }
    }

    /**
     * Calculates where to place the dialog window based on the game size
     * @param width game window width
     */
    private calculateWindowDimensions(width: number) {
        // @ts-ignore
        let x = this.playerPosition + 132 - width / 2;
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

    private changeBtnColor(btn: Phaser.GameObjects.Text, color) {
        btn.setFill(color);
    }

    private createBtn(x: number, y: number, sign: string, size: number): Phaser.GameObjects.Text {
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

    private createBtnBorder(x: number, y: number) {
        this.graphics?.strokeRect(x, y, 20, 20);
    }

    // Creates the close dialog window button
    private createCloseWindowBtn() {
        const dialogRef = this;
        if (this.playerPosition) {
            this.closeBtn = this.createBtn(this.playerPosition + 53 + this.getGameWidth() / 2,
                61, 'X', 17);
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

    private createNextTextBtn() {
        if (this.playerPosition) {
            this.nextBtn = this.createBtn(this.playerPosition + 53 + this.getGameWidth() / 2,
                38 + this.windowHeight, '>', 20);

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
            this.previousBtn = this.createBtn(this.playerPosition + 32 + this.getGameWidth() / 2,
                38 + this.windowHeight, '<', 20);

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

    // Creates dialog window
    private createWindow() {
        const dimensions = this.calculateWindowDimensions(this.getGameWidth());
        this.graphics = this.scene.add.graphics();

        this.createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this.createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);

        this.createCloseWindowBtn();
        // @ts-ignore
        this.createBtnBorder(this.playerPosition + 48 + this.getGameWidth() / 2,60);
        this.createNextTextBtn();
        // @ts-ignore
        this.createBtnBorder(this.playerPosition + 48 + this.getGameWidth() / 2, 190);

        this.createPreviousTextButton();
        // @ts-ignore
        this.createBtnBorder(this.playerPosition + 28+ this.getGameWidth() / 2, 190);
        this.previousBtn?.setFill(this.disabledBtnColor);

        this.setDialogText(this.content[this.textPointer] + '');
    }

    // Gets the width of the game (based on the scene)
    private getGameWidth(): number {
        return this.scene.sys.game.config.width;
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

    private setDialogText(text) {
        this.animationCounter = 0;
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
                    wordWrap: {width: this.getGameWidth() - (this.padding * 2) - 25},
                    fontSize: 19
                }
            });
        }
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

}
