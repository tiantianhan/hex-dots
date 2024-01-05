class DotLine extends Phaser.GameObjects.GameObject{
    constructor (scene)
    {
        super(scene, 'dotLine');
        this.scene = scene;
        this.graphics = [];
        this.connected_dots = [];

        scene.add.existing(this);
    }

    getDots()
    {
        return this.connected_dots;
    }

    addDot(dot, grid_positions)
    {
        this.connected_dots.push(dot);

        if(this.connected_dots.length === 1)
            this.color = dot.getData("color");

        if(this.connected_dots.length >= 2)
            this.drawLine(grid_positions);
    }

    canDrawLineTo(dot){
        if (this.connected_dots.length === 0){
            return false;
        }  else {
            return (this.isFirstDot(dot) || !this.connected_dots.includes(dot)) && 
            this.isMatchingColor(dot) &&
            this.isDotNeighbor(dot, this.connected_dots[this.connected_dots.length - 1]);
        }
    }

    isDotNeighbor(dot, other) 
    {
        const neighbor_deltas = [
            {x : -1, y : -1},
            {x : 0, y : -1},
            {x : -1, y : 0},
            {x : 1, y : 0},
            {x : -1, y : 1},
            {x : 0, y : 1},
            {x : 1, y : -1},
            {x : 1, y : 1},
        ];
        
        var deltaY = other.getData('row') - dot.getData('row');
        var deltaX = other.getData('column') - dot.getData('column');

        for (var neighbor_delta of neighbor_deltas) {
            if (deltaX === neighbor_delta.x && deltaY === neighbor_delta.y)
                return true
        }

        return false
    }

    getFirstDot()
    {
        return this.connected_dots[0];
    }

    getLastDot()
    {
        return this.connected_dots[this.connected_dots.length - 1];
    }

    isLine()
    {
        return this.connected_dots.length > 1;
    }

    isLoop()
    {
        return this.getFirstDot() === this.getLastDot();
    }

    isFirstDot(dot)
    {
        return this.getFirstDot() === dot;
    }

    isMatchingColor(dot)
    {
        return dot.getData('color') ===  dot_line.color;
    }

    drawLine(grid_positions)
    {
        var line = this.scene.add.graphics();
        var lastDot = this.connected_dots[this.connected_dots.length - 2];
        var newDot = this.connected_dots[this.connected_dots.length - 1];
        var lastDotPos = grid_positions[lastDot.getData("row")][lastDot.getData("column")];
        var newDotPos = grid_positions[newDot.getData("row")][newDot.getData("column")];

        line.lineStyle(2, this.color, 1);
        line.moveTo(lastDotPos.x, lastDotPos.y);
        line.lineTo(newDotPos.x, newDotPos.y);

        line.closePath();
        line.strokePath();
        this.graphics.push(line)
    }

    deleteLine()
    {
        this.connected_dots = [];
        this.color = undefined;
        for(var line of this.graphics) {
            line.destroy();
        }
    }
}