class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, size) {
        super(scene, x, y, text, {
            fill: GameConstants.TEXT.color,
            fontFamily: GameConstants.TEXT.fontFamily,
            fontSize: size || GameConstants.TEXT.fontSize,
        });

        this.scene = scene;
        this.setInteractive();
        this.enabled = true;
        this.pointerOver = false;
        this.pointerDown = false;

        // Tint when hovered over
        this.on("pointerover", () => {
            this.pointerOver = true;
            this.updateColor();
        });

        this.on("pointerout", () => {
            this.pointerOver = false;
            this.updateColor();
        });

        // Tint when clicked
        this.on("pointerdown", () => {
            this.pointerDown = true;
            this.updateColor();
        });

        this.scene.input.on("pointerup", () => {
            this.pointerDown = false;
            this.updateColor();
        });
    }

    setEnabled(enable) {
        this.enabled = enable;

        this.updateColor();
    }

    updateColor() {
        if (this.enabled) {
            if (this.pointerDown) {
                this.setFill(GameConstants.TEXT.colorClick);
            } else if (this.pointerOver) {
                this.setFill(GameConstants.TEXT.colorHover);
            } else {
                this.setFill(GameConstants.TEXT.color);
            }
        } else {
            this.setFill(GameConstants.TEXT.colorDisable);
        }
    }
}
