/**
 * Line that joins connected dots.
 */
class DotLine extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);

        this.scene = scene;
        this.color = undefined;
        this.lineWidth = GameConstants.DOT_LINE.lineWidth;

        this.connectedDots = [];
        this.uniqueDots = [];

        this.lineToPointer;
        this.lastDotPosition;

        this.scene.input.on("pointermove", this.drawLineToPointer, this);
        scene.add.existing(this);
    }

    getDots() {
        return this.uniqueDots;
    }

    addDot(dot, gridPositions) {
        this.connectedDots.push(dot);
        this.lastDotPosition = gridPositions[dot.row][dot.column];

        if (!this.uniqueDots.includes(dot)) this.uniqueDots.push(dot);

        if (this.connectedDots.length === 1) this.color = dot.color;

        if (this.connectedDots.length >= 2)
            this.drawLineBetweenDots(gridPositions);
    }

    canDrawLineTo(dot) {
        if (this.connectedDots.length === 0) {
            return false;
        } else {
            return (
                (this.isFirstDot(dot) || !this.connectedDots.includes(dot)) &&
                this.isMatchingColor(dot) &&
                this.isDotNeighbor(
                    dot,
                    this.connectedDots[this.connectedDots.length - 1]
                )
            );
        }
    }

    isDotNeighbor(dot, other) {
        return HexGrid.isNeighbor(dot.row, dot.column, other.row, other.column);
    }

    getFirstDot() {
        return this.connectedDots[0];
    }

    getLastDot() {
        return this.connectedDots[this.connectedDots.length - 1];
    }

    isLine() {
        return this.connectedDots.length > 1;
    }

    isLoop() {
        return this.getFirstDot() === this.getLastDot();
    }

    isFirstDot(dot) {
        return this.getFirstDot() === dot;
    }

    isMatchingColor(dot) {
        return dot.color === this.color;
    }

    drawLineToPointer(pointer) {
        // If object has been destroyed, do nothing
        if (!this.scene) return;

        // Destroy the previous line to the pointer
        if (this.lineToPointer) this.lineToPointer.destroy();

        // Draw new line to the pointer
        if (this.lastDotPosition) {
            var localPoint = this.getLocalPoint(pointer.x, pointer.y);
            this.lineToPointer = this.drawLine(
                this.lastDotPosition,
                localPoint
            );
        }
    }

    drawLineBetweenDots(gridPositions) {
        // If object has been destroyed, do nothing
        if (!this.scene) return;

        var lastDot = this.connectedDots[this.connectedDots.length - 2];
        var newDot = this.connectedDots[this.connectedDots.length - 1];
        var lastDotPos = gridPositions[lastDot.row][lastDot.column];
        var newDotPos = gridPositions[newDot.row][newDot.column];

        this.drawLine(lastDotPos, newDotPos);
    }

    drawLine(pos1, pos2) {
        var line = this.scene.add.graphics();
        line.lineStyle(this.lineWidth, this.color, 1);
        line.moveTo(pos1.x, pos1.y);
        line.lineTo(pos2.x, pos2.y);

        line.closePath();
        line.strokePath();

        this.add(line);

        return line;
    }
}
