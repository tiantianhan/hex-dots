class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text) {
        super(scene, x, y, text, { fill: GameConstants.TEXT.color });

        this.scene = scene;
        this.setInteractive();
        this.enabled = true;
        this.pointerOver = false;

        // Tint when hovered over
        this.on("pointerover", () => {
            this.pointerOver = true;
            this.updateColor();
        });

        this.on("pointerout", () => {
            this.pointerOver = false;
            this.updateColor();
        });
    }

    setEnabled(enable) {
        this.enabled = enable;

        this.updateColor();
    }

    updateColor() {
        if (this.enabled) {
            if (this.pointerOver) {
                this.setFill(GameConstants.TEXT.colorHover);
            } else {
                this.setFill(GameConstants.TEXT.color);
            }
        } else {
            this.setFill(GameConstants.TEXT.colorDisable);
        }
    }
}
