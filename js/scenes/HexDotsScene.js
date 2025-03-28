/**
 * Main game scene.
 */
class HexDotsScene extends Phaser.Scene {
    static State = {
        IDLE: 0,
        CONNECT: 1,
        REPOSITION: 3,
    };

    constructor() {
        super({ key: "hexDotsScene" });

        this.numRows;
        this.numCols;
        this.gameSettings;

        // Contains grid, line and dots so that their positions
        // are in the same coordinate space
        this.mainContainer;
        this.grid;
        this.dotLine;
        // Row number x column number array of dots
        this.dots;
        // Positions where dots spawn
        this.spawnPositions;

        // Container for UI elements
        this.uiContainer;

        this.state = HexDotsScene.State.IDLE;
    }

    init(data) {
        GameUtilities.fadeInScene(this);

        this.numRows =
            data.settings.numRows || GameConstants.GRID.numRowsDefault;
        this.numCols =
            data.settings.numCols || GameConstants.GRID.numColsDefault;
        Dot.numColors =
            data.settings.numColors || GameConstants.DOT.numColorsDefault;

        this.gameSettings = data.settings;
    }

    preload() {
        this.load.image("particle", "assets/particle.png");
    }

    create() {
        this.state = HexDotsScene.State.IDLE;

        this.mainContainer = this.add.container(
            GameConstants.MARGINS.left,
            GameConstants.MARGINS.top
        );

        this.grid = new HexGrid(this, this.numRows, this.numCols);
        this.mainContainer.add(this.grid);

        this.initializeDotSpawnPositions();

        this.initializeDots(this.mainContainer);

        this.add.existing(this.mainContainer);

        this.border = new ProgressBorder(
            this,
            0,
            GameConstants.TOP_BAR.height,
            GameConstants.WIDTH,
            GameConstants.HEIGHT - GameConstants.TOP_BAR.height
        );
        this.add.existing(this.border);

        this.initializeUI();

        this.handleInputEvents();
    }

    update() {}

    handleInputEvents() {
        this.input.on("pointerup", () => {
            this.onClickReleased();
        });
    }

    onGameComplete() {
        if (this.dotLine) this.dotLine.destroy();
        this.state = HexDotsScene.State.IDLE;

        GameUtilities.fadeOutScene(this, "endScene", {
            score: this.score.score,
            settings: this.gameSettings,
        });
    }

    initializeUI() {
        const infoBar = new HorizontalBar(
            this,
            0,
            0,
            GameConstants.WIDTH,
            GameConstants.TOP_BAR.height
        );
        this.add.existing(infoBar);

        this.timer = new CountdownTimer(
            this,
            0,
            0,
            GameConstants.TIMER.initialTime
        );
        this.timer.eventEmitter.on("timerComplete", this.onGameComplete, this);

        this.score = new Score(this, 0, 0);

        infoBar.add([this.timer, this.score]);
    }

    initializeDots(mainContainer) {
        // Destroy existing dots if any from when this scene was last played
        this.destroyExistingDots();
        this.dots = [];

        for (var i = 0; i < this.numRows; i++) {
            this.dots[i] = [];

            for (var j = 0; j < this.numCols; j++) {
                var dot = this.spawnDot(
                    this.grid.positions[i][j].x,
                    this.grid.positions[i][j].y
                );
                dot.row = i;
                dot.column = j;

                mainContainer.add(dot);
                this.dots[i][j] = dot;
            }
        }
    }

    destroyExistingDots() {
        if (this.dots) {
            for (var i = 0; i < this.dots.length; i++) {
                if (this.dots[i]) {
                    for (var j = 0; j < this.dots[i].length; j++) {
                        if (this.dots[i][j]) this.dots[i][j].destroy();
                    }
                }
            }
        }
    }

    initializeDotSpawnPositions() {
        this.spawnPositions = [];
        // Spawn positions are directly above each position in the first row
        for (var pos of this.grid.positions[0]) {
            this.spawnPositions.push({ x: pos.x, y: pos.y - 200 });
        }
    }

    spawnDot(x, y) {
        var dot = new Dot(this, x, y, Dot.getRandomDotColor());

        dot.on(
            "pointerdown",
            () => {
                this.onDotClick(dot);
            },
            this
        );
        dot.on(
            "pointerover",
            () => {
                this.onDotHover(dot);
            },
            this
        );

        return dot;
    }

    onDotClick(dot) {
        if (this.state === HexDotsScene.State.IDLE) {
            this.dotLine = new DotLine(this);
            this.mainContainer.add(this.dotLine);
            this.dotLine.addDot(dot, this.grid.positions);

            dot.playDotConnectedEffects();
            this.border.setColor(dot.color);

            this.state = HexDotsScene.State.CONNECT;
        }
    }

    onDotHover(dot) {
        if (this.state === HexDotsScene.State.CONNECT) {
            if (this.dotLine.canDrawLineTo(dot)) {
                this.dotLine.addDot(dot, this.grid.positions);
                dot.playDotConnectedEffects();

                if (this.dotLine.isLoop()) {
                    // Do not wait for user to release pointer if user has made a loop
                    this.reposition();
                    this.state = HexDotsScene.State.IDLE;
                } else {
                    this.updateBorder();
                }
            }
        }
    }

    onClickReleased() {
        if (this.state === HexDotsScene.State.CONNECT) {
            this.reposition();
            this.state = HexDotsScene.State.IDLE;
        }
    }

    updateBorder() {
        var progress =
            this.dotLine.getDots().length /
            Math.max(this.numCols, this.numRows);
        this.border.setProgress(progress);
    }

    reposition() {
        this.state = HexDotsScene.State.REPOSITION;

        if (this.dotLine.hasConnections()) {
            var dotsToDelete = this.getDotsToDelete();
            this.score.addScore(dotsToDelete.length);
            this.repositionDots(dotsToDelete);

            if (this.dotLine.isLoop()) {
                this.border.showFullSquare(this.dotLine.color);
            } else {
                this.border.clearProgress();
            }
        }

        this.dotLine.destroy();
    }

    getDotsToDelete() {
        var dotsToDelete;
        if (this.dotLine.isLoop()) {
            // If we made a loop, delete dots of the same color
            dotsToDelete = this.getDotsWithColor(this.dotLine.color);
        } else {
            dotsToDelete = this.dotLine.getDots();
        }

        return dotsToDelete;
    }

    getDotsWithColor(color) {
        var dotsWithColor = [];
        for (var i = 0; i < this.numRows; i++) {
            for (var j = 0; j < this.numCols; j++) {
                if (this.dots[i][j].color === color) {
                    dotsWithColor.push(this.dots[i][j]);
                }
            }
        }

        return dotsWithColor;
    }

    repositionDots(dotsToDelete) {
        // Matrix to be filled with dots in new positions
        var newDots = GameUtilities.initializeArray(
            this.numRows,
            this.numCols,
            0
        );

        // Determine how much each dot should shift downwards
        var shift = this.calculateShift(dotsToDelete);

        // Shift the dots, starting with the bottom row
        for (var j = 0; j < this.numCols; j++) {
            // Add a small random delay for each column
            var randomShiftDelay = this.getSmallRandomShiftDelay();
            for (var i = this.numRows - 1; i >= 0; i--) {
                var dot = this.dots[i][j];
                if (shift[i][j]) {
                    this.shiftDot(dot, shift[i][j], randomShiftDelay);
                }
                newDots[dot.row][dot.column] = dot;
            }
        }

        // Spawn replacement dots
        var numSpawn = this.calculateNumSpawn(shift);
        for (var j = 0; j < this.numCols; j++) {
            if (numSpawn[j] > 0) {
                for (var s = 1; s <= numSpawn[j]; s++) {
                    var dot = this.spawnDot(
                        this.spawnPositions[j].x,
                        this.spawnPositions[j].y
                    );
                    this.mainContainer.add(dot);
                    dot.row = s - 1;
                    dot.column = j;
                    newDots[dot.row][dot.column] = dot;

                    // Add delay before dropping for dots spawned later
                    var dropDelayFactor = numSpawn[j] - s;
                    var dropDelay = dropDelayFactor * Dot.moveTime;
                    dropDelay += this.getSmallRandomShiftDelay();

                    // Dots spawned above first row has "initial row" of -1
                    dot.moveThroughPositions(
                        this.getShiftPositions(-1, dot.column, s),
                        dropDelay
                    );
                }
            }
        }

        // Delete the dots removed from the grid
        for (var i = 0; i < dotsToDelete.length; i++) {
            dotsToDelete[i].destroyWithEffects();
        }

        // Update matrix tracking positions of the dots
        this.dots = newDots;
    }

    calculateShift(dotsToDelete) {
        // An array to keep track of how much to shift each dot downward
        var shift = GameUtilities.initializeArray(
            this.numRows,
            this.numCols,
            0
        );

        // Everything in the column above the deleted dot
        // must shift down 1 for each deleted dot below
        for (var dot of dotsToDelete) {
            for (var i = 0; i < dot.row; i++) {
                shift[i][dot.column] += 1;
            }
        }

        for (var dot of dotsToDelete) {
            // The deleted dot does not need to shift
            shift[dot.row][dot.column] = NaN;
        }

        return shift;
    }

    calculateNumSpawn(shift) {
        // Number of dots to spawn for each column
        var numSpawn = [];

        for (var j = 0; j < this.numCols; j++) {
            numSpawn[j] = 0;

            var i = 0;
            // Spawn dot for each deleted dot starting from the first row
            while (i < shift.length && isNaN(shift[i][j])) {
                i++;
                numSpawn[j] += 1;
            }

            // Spawn as many dots as the dots below will shift
            if (i < shift.length) numSpawn[j] += shift[i][j];
        }
        return numSpawn;
    }

    shiftDot(dot, shift, delay) {
        dot.moveThroughPositions(
            this.getShiftPositions(dot.row, dot.column, shift),
            delay
        );
        dot.row += shift;
    }

    // The dot does not go directly to the target new position, instead it moves through
    // each grid position in each row above the target new position
    // This returns a list of positions the dot should move through to make the shift
    getShiftPositions(row, col, shift) {
        var positions = [];
        for (var s = 1; s <= shift; s++) {
            var newPos = this.grid.positions[row + s][col];
            positions.push(newPos);
        }
        return positions;
    }

    getSmallRandomShiftDelay() {
        // Between 0 - 60% of the time it take for dots to move one unit
        return Math.random() * Dot.moveTime * 0.6;
    }
}
