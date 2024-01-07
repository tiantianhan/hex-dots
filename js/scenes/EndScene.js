/**
 * Plays after game ends. Shows the score and asks if the player wants to restart.
 */
class EndScene extends Phaser.Scene
{
    constructor ()
    {
        super({key: 'endScene'});

        this.score;
        this.exitButton;
        this.restartButton;

        this.mainContainer;
    }

    init(data)
    {
        this.score = data.score || 0;
        this.settings = data.settings || new GameSettings();
    }

    create()
    {
        this.mainContainer = this.add.container(0, 0);
        var centerX = this.cameras.main.displayWidth / 2;
        var centerY = this.cameras.main.displayHeight / 2;
        this.mainContainer.setPosition(centerX, centerY - 100);
        
        // END OF ROUND title
        const endRound = this.add.text(0, 0, "END OF ROUND", {
            fill: GameConstants.TEXT.color,
        })
        endRound.setOrigin(0.5);

        // Your score text
        const yourScore = this.add.text(0, 25, "You have: " + this.score + " dots", {
            fill: GameConstants.TEXT.color,
        }).setOrigin(0.5);

        // Buttons
        this.restartButton = new TextButton(this, 0, 100, "Restart").setOrigin(0.5);
        this.exitButton = new TextButton(this, 0, 125, "Exit").setOrigin(0.5);

        this.mainContainer.add([endRound, yourScore, this.restartButton, this.exitButton]);

        this.handleInputs();
    }

    handleInputs()
    {
        this.input.on('gameobjectdown', function (pointer, gameObject)
        {
            switch (gameObject){
                case this.restartButton:
                    this.restart();
                    break;
                case this.exitButton:
                    this.exitToSettings();
                    break;
            }
        }, this);
    }

    restart()
    {
        GameUtilities.fadeOutScene(this, 'hexDotsScene', {settings: this.settings});
    }

    exitToSettings()
    {
        GameUtilities.fadeOutScene(this, 'settingsScene');
    }
}