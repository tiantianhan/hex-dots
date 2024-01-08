class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text) {
        super(scene, x, y, text, { fill: GameConstants.TEXT.color });

        this.scene = scene;
        this.setInteractive();

        // Tint when hovered over
        this.on("pointerover", () => {
            this.setFill(GameConstants.TEXT.colorHover);
        });

        this.on("pointerout", () => {
            this.setFill(GameConstants.TEXT.color);
        });
    }
}
