/**
 * Main scene
 *
 * @class
 */
class HexDotsScene extends Phaser.Scene
{
    static State = { 
        IDLE: 0,
        CONNECT: 1,
    };

    constructor ()
    {
        super({key: 'HexDotsScene'});

        this.numRows = GameConstants.GRID.numRowsDefault;
        this.numCols = GameConstants.GRID.numColsDefault;
        Dot.numColors = GameConstants.DOT.numColorsDefault;

        // Contains grid, line and dots so that their positions
        // are in the same coordinate space
        this.main_container;
        this.grid;
        this.dot_line;
        // Positions where dots spawn
        this.spawnPositions;
        // Row number x column number array of dots
        this.dots;

        // Overlay
        this.overlay;

        // Container for UI elements
        this.uiContainer;

        this.state = HexDotsScene.State.IDLE;
    }

    init(data)
    {
        this.numRows = data.numRows;
        this.numCols = data.numCols;
        Dot.numColors = data.numColors;
    }

    preload ()
    {
    }

    create ()
    {
        this.cameras.main.fadeIn(200, 255, 255, 255)

        // Set up game objects
        this.main_container = this.add.container(GameConstants.MARGINS.left, GameConstants.MARGINS.top); 
        
        this.grid = new HexGrid(this, this.numRows, this.numCols);
        this.main_container.add(this.grid);

        this.initializeDotSpawnPositions();
        
        this.initializeDots(this.main_container);

        this.add.existing(this.main_container);

        this.overlay = new TintedOverlay(this, 0, 0);
        this.add.existing(this.overlay);

        this.initializeUI();

        this.handleInputEvents();
    }

    update ()
    {
    }

    handleInputEvents()
    {
        this.input.on('pointerup', pointer =>
        {
            if (pointer.leftButtonReleased()) {
                this.onLeftClickReleased();
            }
        });

        this.input.on('gameobjectdown', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
        }, this);

        this.input.on('gameobjectover', function (pointer, gameObject)
        {
            gameObject.emit('hover', gameObject);
        }, this);
    }

    initializeUI()
    {
        this.uiContainer = this.add.container(10, 10);
        const scoreText = this.add.text(0, 0, "Score: ", { fill: GameConstants.TEXT.color });
        this.uiContainer.add(scoreText);
    }

    initializeDots(main_container)
    {
        this.dots = [];

        for (var i = 0; i < this.numRows; i++) {
            this.dots[i] = [];

            for (var j = 0; j < this.numCols; j++) {
                var dot = this.spawnDot(this.grid.positions[i][j].x, this.grid.positions[i][j].y);
                dot.row = i;
                dot.column = j;
                
                main_container.add(dot);
                this.dots[i][j] = dot;
            }
        }
    }

    initializeDotSpawnPositions()
    {
        this.spawnPositions = [];
        // Spawn positions are directly above each position in the first row
        for(var pos of this.grid.positions[0]){
            this.spawnPositions.push({x: pos.x, y: pos.y - 200});
        }
        for(var spawnPos of this.spawnPositions){
            var dot = this.spawnDot(spawnPos.x, spawnPos.y);
            this.main_container.add(dot);
        }
    }

    spawnDot(x, y) 
    {
        var dot = new Dot(this, x, y, Dot.getRandomDotColor());
        
        // dot.setInteractive();
        dot.on('clicked', this.onDotClick, this);
        dot.on('hover', this.onDotHover, this);
        return dot;
    }

    onDotClick(dot)
    {
        if (this.state === HexDotsScene.State.IDLE) {
            this.dot_line = new DotLine(this);
            this.main_container.add(this.dot_line);
            this.dot_line.addDot(dot, this.grid.positions);

            dot.playDotConnectedEffects();

            this.state = HexDotsScene.State.CONNECT;

            console.log("State: " + this.state)
            console.log("Dot click position r, c: " + dot.row, dot.column)
        }
    }
    
    onDotHover(dot)
    {
        console.log("Dot hover position r, c: " + dot.row, dot.column)
        if (this.state === HexDotsScene.State.CONNECT) {
            // If color matches the line of connected dots, add to the line
            if( this.dot_line.canDrawLineTo(dot)) {
                this.dot_line.addDot(dot, this.grid.positions);
                dot.playDotConnectedEffects();
            } 
        }
    }

    onLeftClickReleased() 
    {
        if (this.state === HexDotsScene.State.CONNECT) {
            if (this.dot_line.isLine()) {
                var dotsToDelete = this.getDotsToDelete();
                this.repositionDots(dotsToDelete);

                if(this.dot_line.isLoop())
                    this.overlay.flashOverlay(this.dot_line.color);
            }



            this.dot_line.destroy();
            this.state = HexDotsScene.State.IDLE;
            
            console.log("State: " + this.state)
        }
    }

    getDotsToDelete()
    {
        var dotsToDelete;
        if(this.dot_line.isLoop()){
            // If we made a loop, delete dots of the same color
            dotsToDelete = this.getDotsWithColor(this.dot_line.color);
        } else {
            dotsToDelete = this.dot_line.getDots();
        }

        return dotsToDelete;
    }

    getDotsWithColor(color)
    {
        var dotsWithColor = [];
        for(var i = 0; i < this.numRows; i++) {
            for (var j = 0; j < this.numCols; j++) {
                if(this.dots[i][j].color === color){
                    dotsWithColor.push(this.dots[i][j])
                }
            }
        }

        return dotsWithColor;
    }

    repositionDots(dotsToDelete)
    {
        // Matrix with new positions of the dots
        var newDots = GameUtilities.initializeArray(this.numRows, this.numCols, 0);

        // Determine how much each dot should shift downwards
        var shift = this.calculateShift(dotsToDelete);

        // Shift the dots, starting with the bottom row
        for (var i = this.numRows - 1; i >= 0; i--){
            for (var j = 0; j < this.numCols; j++){
                var dot = this.dots[i][j];

                if(shift[i][j]){
                    this.shiftDot(dot, shift[i][j]);
                }
                newDots[dot.row][dot.column] = dot;
            }
        }

        // Spawn replacement dots
        var numSpawn = this.calculateNumSpawn(shift);
        for (var j = 0; j < this.numCols; j++){
            if(numSpawn[j] > 0){
                for(var s = 1; s <= numSpawn[j]; s++){
                    var dot = this.spawnDot(this.spawnPositions[j].x, this.spawnPositions[j].y);
                    this.main_container.add(dot);
                    dot.row = s - 1;
                    dot.column = j;
                    newDots[dot.row][dot.column] = dot;
                    
                    // The closer the target position is to the top, the 
                    // longer we wait before we drop the dot
                    var dropDelayFactor = numSpawn[j] - s;

                    // Dots spawned above first row has "initial row" of -1
                    dot.moveThroughPositions(this.getShiftPositions(-1, dot.column, s), dropDelayFactor);
                }
                
            }
        }

        // Delete the dots removed from the grid
        for (var i = 0; i < dotsToDelete.length; i++){
            dotsToDelete[i].destroyWithEffects()
        }

        // Update matrix tracking positions of the dots
        this.dots = newDots;
    }

    calculateShift(dotsToDelete){
        // An array to keep track of how much to shift each dot downward
        var shift = GameUtilities.initializeArray(this.numRows, this.numCols, 0);

        // Everything in the column above the deleted dot
        // must shift down 1 for each deleted dot below
        for (var dot of dotsToDelete) {
            for(var i = 0; i < dot.row; i++){
                shift[i][dot.column] += 1;
            }
        }

        for (var dot of dotsToDelete){
            // The deleted dot does not need to shift
            shift[dot.row][dot.column] = NaN;
        }

        return shift;
    }

    calculateNumSpawn(shift){
        // Number of dots to spawn for each column
        var numSpawn = [];

        for (var j = 0; j < this.numCols; j++){
            numSpawn[j] = 0;

            var i = 0;
            // Spawn dot for each deleted dot starting from the first row
            while(isNaN(shift[i][j])){
                i++;
                numSpawn[j] += 1;
            }

            // Spawn as many dots as the dots below will shift
            numSpawn[j] += shift[i][j];
        }
        return numSpawn;
    }

    shiftDot(dot, shift){
        dot.moveThroughPositions(this.getShiftPositions(dot.row, dot.column, shift));
        dot.row += shift;
    }

    // The dot does not go directly to the target new position, instead it moves through 
    // each grid position in each row above the target new position
    // This returns a list of positions the dot should move through to make the shift
    getShiftPositions(row, col, shift){
        var positions  = [];
        for (var s = 1; s <= shift; s++){
            var newPos = this.grid.positions[row + s][col]
            positions.push(newPos);
        }
        return positions;
    }

}