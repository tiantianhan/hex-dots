/**
 * Plays after game ends. Shows the score and asks if the player wants to restart.
 */
class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: "endScene" });

        this.score;
        this.exitButton;
        this.restartButton;

        this.mainContainer;
    }

    init(data) {
        GameUtilities.fadeInScene(this);
        this.score = data.score || 0;
        this.settings = data.settings || new GameSettings();
    }

    create() {
        this.mainContainer = this.add.container(0, 0);
        var centerX = this.cameras.main.displayWidth / 2;
        var centerY = this.cameras.main.displayHeight / 2;
        this.mainContainer.setPosition(centerX, centerY - 100);

        const spacing = GameConstants.TEXT.fontSize * 2;

        // END OF ROUND title
        const endRound = this.add.text(0, 0, "END OF ROUND", {
            fill: GameConstants.TEXT.color,
            fontFamily: GameConstants.TEXT.fontFamily,
            fontSize: GameConstants.TEXT.fontSize,
        });
        endRound.setOrigin(0.5);

        // Your score text
        const yourScore = this.add
            .text(0, spacing, "Your score: " + this.score + " dots!", {
                fill: GameConstants.TEXT.color,
                fontFamily: GameConstants.TEXT.fontFamily,
                fontSize: GameConstants.TEXT.fontSize,
            })
            .setOrigin(0.5);

        // Buttons
        this.restartButton = new TextButton(
            this,
            0,
            spacing * 4,
            "Restart"
        ).setOrigin(0.5);
        this.restartButton.on("pointerup", this.restart, this);

        this.exitButton = new TextButton(
            this,
            0,
            spacing * 5,
            "Exit"
        ).setOrigin(0.5);
        this.exitButton.on("pointerup", this.exitToSettings, this);

        this.mainContainer.add([
            endRound,
            yourScore,
            this.restartButton,
            this.exitButton,
        ]);
    }

    restart() {
        GameUtilities.fadeOutScene(this, "hexDotsScene", {
            settings: this.settings,
        });
    }

    exitToSettings() {
        GameUtilities.fadeOutScene(this, "settingsScene");
    }
}
