/**
 * Tracks and displays the current score.
 */
class Score extends BarElement {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);

        this.scene = scene;
        this.score = 0;

        const smallSpace = GameConstants.TOP_BAR.smallFontSize;
        const scoreText = this.scene.add
            .text(0, 0, "Score:", {
                fill: GameConstants.TEXT.color,
                fontFamily: GameConstants.TEXT.fontFamily,
                fontSize: GameConstants.TOP_BAR.smallFontSize,
            })
            .setOrigin(0, 0.5);
        this.scoreDisplay = this.scene.add
            .text(scoreText.width + smallSpace, 0, "0", {
                fill: GameConstants.TEXT.color,
                fontFamily: GameConstants.TEXT.fontFamily,
                fontSize: GameConstants.TOP_BAR.largeFontSize,
            })
            .setOrigin(0, 0.5);

        this.add([scoreText, this.scoreDisplay]);

        this.width = scoreText.width + smallSpace + this.scoreDisplay.width;
        this.height = this.scoreDisplay.height;
    }

    addScore(add) {
        this.score += add;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        this.scoreDisplay.text = this.score;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}
