class SettingsScene extends Phaser.Scene
{
    constructor ()
    {
        super({key: 'settingsScene'});

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

    create()
    {
        this.main_container = this.add.container(GameConstants.MARGINS.left, GameConstants.MARGINS.top); 
        this.updateGrid();

        const buttonsPosY = GameConstants.HEIGHT - GameConstants.MARGINS.top - 40;

        // Start button
        this.startButton = new TextButton(this, 0, buttonsPosY, "Start");
        this.main_container.add(this.startButton);

        // Row - + buttons
        const rowText = this.add.text(100, buttonsPosY, "Rows:", { fill: GameConstants.TEXT.color });
        this.minusRowButton = new TextButton(this, 155, buttonsPosY, "-");
        this.addRowButton = new TextButton(this, 190, buttonsPosY, "+");
        this.main_container.add([rowText, this.addRowButton, this.minusRowButton]);
        
        // Column - + buttons
        const columnText = this.add.text(250, buttonsPosY, "Columns:", { fill: GameConstants.TEXT.color });
        this.minusColumnButton = new TextButton(this, 335, buttonsPosY, "-");
        this.addColumnButton = new TextButton(this, 370, buttonsPosY, "+");
        this.main_container.add([columnText, this.addColumnButton, this.minusColumnButton]);

        // Color - + buttons
        const colorText = this.add.text(480, buttonsPosY, "Colors:", { fill: GameConstants.TEXT.color });
        this.minusColorButton = new TextButton(this, 565, buttonsPosY, "-");
        this.addColorButton = new TextButton(this, 600, buttonsPosY, "+");
        this.main_container.add([colorText, this.addColorButton, this.minusColorButton]);

        // Color swatches
        this.swatchContainer = this.add.container(450, buttonsPosY - 15);
        this.main_container.add(this.swatchContainer);
        this.updateColorSwatches();

        this.handleInputs();
    }

    handleInputs()
    {
        this.input.on('gameobjectdown', function (pointer, gameObject)
        {
            switch (gameObject){
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

        }, this);
    }

    startMainScene()
    {
        // Use camera for a white out scene transition
        this.cameras.main.fadeOut(200, 255, 255, 255)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('HexDotsScene', {numRows: this.numRows, numCols: this.numCols, numColors: this.numColors});
        })
    }

    clampValues()
    {
        this.numRows = GameUtilities.clamp(this.numRows, GameConstants.GRID.numRowsMin, GameConstants.GRID.numRowsMax);
        this.numCols = GameUtilities.clamp(this.numCols, GameConstants.GRID.numColsMin, GameConstants.GRID.numColsMax);
        this.numColors = GameUtilities.clamp(this.numColors, GameConstants.DOT.numColorsMin, GameConstants.DOT.numColorsMax);
    }

    updateGrid ()
    {
        if(this.grid)
            this.grid.destroy();

        this.grid = new HexGrid(this, this.numRows, this.numCols);
        this.main_container.add(this.grid);
    }

    updateColorSwatches()
    {
        // Remove existing swatches
        for (var s of this.swatches){
            s.destroy()
            this.swatches = [];
        }

        // Draw new swatches
        for (var i = 0; i < this.numColors; i++){
            var swatch = new Dot(this, i * GameConstants.DOT.size * 1.5, 0, GameConstants.DOT.possibleColors[i]);
            this.swatches.push(swatch);
            this.swatchContainer.add(swatch);
        }
    }
}