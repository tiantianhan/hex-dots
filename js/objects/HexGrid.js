/**
 * A hexagonal grid
 *
 * @class
 */
class HexGrid extends Phaser.GameObjects.Container{
    constructor (scene, numRows, numCols, x, y, children)
    {
        super(scene, x, y, children);
        this.scene = scene;

        this.numCols = numCols;
        this.numRows = numRows;

        //Size of one side of each hexagon
        this.hexSize = GameConstants.GRID.hexSize;
        this.lineWidth = GameConstants.GRID.lineWidth;
        this.lineColor = GameConstants.GRID.lineColor;
        this.lineAlpha = 1;

        /**
         * Array of x, y positions by row and column in the grid
         */
        this.positions = [];

        this.drawHexTiles();
        this.scene.add.existing(this);
    }

    /** 
     * Determines if two positions are neighbors based on row and column numbers
    */
    static isNeighbor(row1, col1, row2, col2){
        // Row index starts at 0, the 0th row is the first row, an "odd" row
        const isEvenRow = (row1 + 1) % 2 === 0;

        // Get possible differences between neighbors for the row (y) and column (x)
        var neighborDeltas;
        if(isEvenRow) {
            neighborDeltas = [
                // Left
                {x : -1, y : 0},
                // Right
                {x : 1, y : 0},
                // Top left
                {x : 0, y : -1},
                // Top Right
                {x : 1, y : -1},
                // Bottom Left
                {x : 0, y : 1},
                // Bottom Right
                {x : 1, y : 1},
            ];
        } else {
            neighborDeltas = [
                // Left
                {x : -1, y : 0},
                // Right
                {x : 1, y : 0},
                // Top left
                {x : -1, y : -1},
                // Top Right
                {x : 0, y : -1},
                // Bottom Left
                {x : -1, y : 1},
                // Bottom Right
                {x : 0, y : 1},
            ];
        }

        var deltaY = row2 - row1;
        var deltaX = col2 - col1;

        for (var neighborDelta of neighborDeltas) {
            if (deltaX === neighborDelta.x && deltaY === neighborDelta.y)
                return true
        }

        return false
    }

    drawHexTiles()
    {
        const hexHeight = Math.sqrt(3) * this.hexSize / 2;

        for (var i = 0; i < this.numRows; i++) {
            this.positions[i] = []
            var oddRow = (i % 2 != 0)

            for (var j = 0; j < this.numCols; j++) {
                var x = j * 2 * hexHeight;
                if (oddRow)
                    x += hexHeight;

                var y = i * (1.5 * this.hexSize);
                
                this.positions[i][j] = {x : x, y : y}
                this.drawHexagon(x, y, this.hexSize);
            }
        }

    }

    drawHexagon(x, y, size) 
    {
        var graphics = this.scene.add.graphics();
        graphics.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);

        // Get hexagon points
        var points = [];
        for (var i = 0; i < 6; i++) {
            var angle = Phaser.Math.DegToRad(60 * i + 30);
            points.push(new Phaser.Geom.Point(x + size * Math.cos(angle), y + size * Math.sin(angle)));
        }

        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < 6; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }

        graphics.closePath();
        graphics.strokePath();

        // Add hexagon as child of this grid
        this.add(graphics);
    }
}