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

        // Constants for positioning
        const buttonsPosY =
            GameConstants.HEIGHT - GameConstants.MARGINS.top - 40;
        const horizontalSpace = GameConstants.WIDTH / 10;

        // Start button
        this.startButton = new TextButton(
            this,
            -horizontalSpace * 0.5,
            buttonsPosY,
            "Start"
        );
        this.mainContainer.add(this.startButton);
        this.startButton.on("pointerup", this.startMainScene, this);

        // Row - + buttons
        var rowPlusMinus = new PlusMinusButton(
            this,
            horizontalSpace,
            buttonsPosY,
            "Rows:",
            this.numRows,
            GameConstants.GRID.numRowsMin,
            GameConstants.GRID.numRowsMax
        );
        rowPlusMinus.clickEmitter.addListener(
            "click",
            (value) => {
                this.numRows = value;
                this.updateGrid();
            },
            this
        );

        // Column - + buttons
        var columnPlusMinus = new PlusMinusButton(
            this,
            horizontalSpace * 3,
            buttonsPosY,
            "Columns:",
            this.numCols,
            GameConstants.GRID.numColsMin,
            GameConstants.GRID.numColsMax
        );
        columnPlusMinus.clickEmitter.addListener(
            "click",
            (value) => {
                this.numCols = value;
                this.updateGrid();
            },
            this
        );

        // Color - + buttons
        var colorPlusMinus = new PlusMinusButton(
            this,
            horizontalSpace * 5.5,
            buttonsPosY,
            "Colors:",
            this.numColors,
            GameConstants.DOT.numColorsMin,
            GameConstants.DOT.numColorsMax
        );
        colorPlusMinus.clickEmitter.addListener(
            "click",
            (value) => {
                this.numColors = value;
                this.updateColorSwatches();
            },
            this
        );
        this.mainContainer.add([rowPlusMinus, columnPlusMinus, colorPlusMinus]);

        // Color swatches
        this.swatchContainer = this.add.container(
            horizontalSpace * 5.5,
            buttonsPosY - 15
        );
        this.mainContainer.add(this.swatchContainer);
        this.updateColorSwatches();
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
