/**
 * Allows adjustment of grid rows and columns and number of dot colors.
 */
class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: "settingsScene" });

        this.numRows = GameConstants.GRID.numRowsDefault;
        this.numCols = GameConstants.GRID.numColsDefault;
        this.numColors = GameConstants.DOT.numColorsDefault;

        this.grid;

        this.startButton;
        this.addRowButton;
        this.minusRowButton;
        this.addColumnButton;
        this.minusColumnButton;
        this.addColorButton;
        this.minusColorButton;

        this.swatchContainer;
        this.swatches = [];
    }

    init(data) {
        GameUtilities.fadeInScene(this);
    }

    create() {
        this.mainContainer = this.add.container(
            GameConstants.MARGINS.left,
            GameConstants.MARGINS.top
        );
        this.updateGrid();

        const buttonsPosY =
            GameConstants.HEIGHT - GameConstants.MARGINS.top - 40;

        // Start button
        this.startButton = new TextButton(this, 0, buttonsPosY, "Start");
        this.mainContainer.add(this.startButton);

        // Row - + buttons
        const rowText = this.add.text(100, buttonsPosY, "Rows:", {
            fill: GameConstants.TEXT.color,
        });
        this.minusRowButton = new TextButton(this, 155, buttonsPosY, "-");
        this.addRowButton = new TextButton(this, 190, buttonsPosY, "+");
        this.mainContainer.add([
            rowText,
            this.addRowButton,
            this.minusRowButton,
        ]);

        // Column - + buttons
        const columnText = this.add.text(250, buttonsPosY, "Columns:", {
            fill: GameConstants.TEXT.color,
        });
        this.minusColumnButton = new TextButton(this, 335, buttonsPosY, "-");
        this.addColumnButton = new TextButton(this, 370, buttonsPosY, "+");
        this.mainContainer.add([
            columnText,
            this.addColumnButton,
            this.minusColumnButton,
        ]);

        // Color - + buttons
        const colorText = this.add.text(480, buttonsPosY, "Colors:", {
            fill: GameConstants.TEXT.color,
        });
        this.minusColorButton = new TextButton(this, 565, buttonsPosY, "-");
        this.addColorButton = new TextButton(this, 600, buttonsPosY, "+");
        this.mainContainer.add([
            colorText,
            this.addColorButton,
            this.minusColorButton,
        ]);

        // Color swatches
        this.swatchContainer = this.add.container(450, buttonsPosY - 15);
        this.mainContainer.add(this.swatchContainer);
        this.updateColorSwatches();

        this.handleInputs();
    }

    handleInputs() {
        this.input.on(
            "gameobjectdown",
            function (pointer, gameObject) {
                switch (gameObject) {
                    case this.addRowButton:
                        this.numRows++;
                        break;
                    case this.minusRowButton:
                        this.numRows--;
                        break;
                    case this.addColumnButton:
                        this.numCols++;
                        break;
                    case this.minusColumnButton:
                        this.numCols--;
                        break;
                    case this.addColorButton:
                        this.numColors++;
                        break;
                    case this.minusColorButton:
                        this.numColors--;
                        break;
                    case this.startButton:
                        this.startMainScene();
                        break;
                }

                this.clampValues();
                this.updateGrid();
                this.updateColorSwatches();
            },
            this
        );
    }

    startMainScene() {
        var settings = new GameSettings(
            this.numRows,
            this.numCols,
            this.numColors
        );
        GameUtilities.fadeOutScene(this, "hexDotsScene", {
            settings: settings,
        });
    }

    clampValues() {
        this.numRows = GameUtilities.clamp(
            this.numRows,
            GameConstants.GRID.numRowsMin,
            GameConstants.GRID.numRowsMax
        );
        this.numCols = GameUtilities.clamp(
            this.numCols,
            GameConstants.GRID.numColsMin,
            GameConstants.GRID.numColsMax
        );
        this.numColors = GameUtilities.clamp(
            this.numColors,
            GameConstants.DOT.numColorsMin,
            GameConstants.DOT.numColorsMax
        );
    }

    updateGrid() {
        if (this.grid) this.grid.destroy();

        this.grid = new HexGrid(this, this.numRows, this.numCols);
        this.mainContainer.add(this.grid);
    }

    updateColorSwatches() {
        // Remove existing swatches
        for (var s of this.swatches) {
            s.destroy();
            this.swatches = [];
        }

        // Draw new swatches
        for (var i = 0; i < this.numColors; i++) {
            var swatch = new Dot(
                this,
                i * GameConstants.DOT.size * 1.5,
                0,
                GameConstants.DOT.possibleColors[i]
            );
            this.swatches.push(swatch);
            this.swatchContainer.add(swatch);
        }
    }
}
