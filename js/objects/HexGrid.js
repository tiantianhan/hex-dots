/**
 * A hexagonal grid
 *
 * @class
 */
class HexGrid extends Phaser.GameObjects.Container{
    constructor (scene, x, y, children)
    {
        super(scene, x, y, children);
        this.scene = scene;
        this.positions = [];

        this.drawHexTiles();
        this.scene.add.existing(this);
    }

    drawHexTiles()
    {
        const xOffset = 100
        const yOffset = 100
        const hexSize = 50;

        const hexHeight = Math.sqrt(3) * hexSize / 2;

        for (var i = 0; i < numRows; i++) {
            this.positions[i] = []
            var oddRow = (i % 2 != 0)

            for (var j = 0; j < numCols; j++) {
                var x = j * 2 * hexHeight;
                if (oddRow)
                    x += hexHeight;

                var y = i * (1.5 * hexSize);

                x += xOffset
                y += yOffset
                
                this.positions[i][j] = {x : x, y : y}
                this.drawHexagon(x, y, hexSize);
            }
        }

    }

    drawHexagon(x, y, size) 
    {
        var graphics = this.scene.add.graphics();
        graphics.lineStyle(2, 0x111111, 1);

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