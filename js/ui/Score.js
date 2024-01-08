/**
 * Tracks and displays the current score.
 */
class Score extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);

        this.scene = scene;
        this.score = 0;

        const smallSpace = 10;
        const scoreText = this.scene.add.text(0, 0, "Score: ", {
            fill: GameConstants.TEXT.color,
        });
        this.scoreDisplay = this.scene.add.text(
            scoreText.width + smallSpace,
            0,
            "0",
            { fill: GameConstants.TEXT.color }
        );

        this.add([scoreText, this.scoreDisplay]);
    }

    addScore(add) {
        this.score += add;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        this.scoreDisplay.text = this.score;
    }
}
