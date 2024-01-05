    // Game data
    const numRows = 6;
    const numCols = 7;
    const numColors = 4;

    // Grid view data
    // Row number x column number array of x, y positions
    var grid_positions = [];

    // Row number x column number array of dots
    var dots;

    // Connecting dots
    // State of the scene
    const State = Object.freeze({ 
        IDLE: 0,
        CONNECT: 1,
        REPOSITION: 3
    });
    var state = State.IDLE;

    // List of currently connected dots while cursor is down
    var dot_line;

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

        addDot(dot)
        {
            this.connected_dots.push(dot);

            if(this.connected_dots.length === 1)
                this.color = dot.getData("color");

            if(this.connected_dots.length >= 2)
                this.drawLine();
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

        drawLine()
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


    class DotsScene extends Phaser.Scene
    {
        constructor ()
        {
            super();
        }

        preload ()
        {
        }

        create ()
        {
            this.drawHexTiles();
            this.initializeDots();
            dot_line = new DotLine(this)

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

        // Initialize dots
        initializeDots()
        {
            dots = [];
            for (var i = 0; i < numRows; i++) {
                dots[i] = [];

                for (var j = 0; j < numCols; j++) {
                    var color = this.getRandomDotColor();
                    var dot = this.spawnDot(grid_positions[i][j].x, grid_positions[i][j].y, color);
                    dot.setData({'color' : color, 'column' : j, 'row' : i});

                    dots[i][j] = dot;
                }
            }
        }

        spawnDot(x, y, color) 
        {
            const dotSize = 20
            var dot = new Phaser.GameObjects.Ellipse(this, x, y, dotSize, dotSize, color);
           
            dot.setInteractive();
            dot.on('clicked', this.onDotClick, this);
            dot.on('hover', this.onDotHover, this);

            this.add.existing(dot);
            return dot;
        }

        onDotClick(dot)
        {
            if (state === State.IDLE) {
                dot_line.addDot(dot);
                this.playDotConnectedEffects(dot);
                state = State.CONNECT;
                console.log("State: " + state)
                console.log("Dot click position r, c: " + dot.getData('row'), dot.getData('column'))
            }
        }
        
        onDotHover(dot)
        {
            console.log("Dot hover position r, c: " + dot.getData('row'), dot.getData('column'))
            if (state === State.CONNECT) {
                // If color matches the line of connected dots, add to the line
                if( dot_line.canDrawLineTo(dot)) {
                    dot_line.addDot(dot);
                    this.playDotConnectedEffects(dot);
                    
                    if(dot_line.isLoop()){
                        //TODO
                    }
                }
            }
        }

        onLeftClickReleased() 
        {
            if (state === State.CONNECT) {
                if (dot_line.isLine()) {
                    var connected_dots = dot_line.getDots();
                    // repositionDots(connected_dots);
                    for (var dot of connected_dots){
                        this.playDotDeleteEffects(dot)
                    }
                    // state = State.REPOSITION;
                } else {
                    state = State.IDLE;
                }

                dot_line.deleteLine();
                
                console.log("State: " + state)
            }
        }

        isDotSameColor(dot, other) 
        {
            return dot.getData('color') === other.getData('color');
        }

        repositionDots(deleted_dots)
        {
            var shift = []
            for (var i = 0; i < numRows; i++) {
                // for(var i = 0)
            }

            for (var dot of deleted_dots) {
                dotRow = dot.getData('row');
                dotCol = dot.getData('column');

                //WIP
            }
        }

        playRepositionEffects()
        {

        }

        playDotDeleteEffects(dot){
            // Define the tween to animate the size
            var tween = this.tweens.add({
                targets: dot,
                scaleX: 0, // scale horizontally to 0
                scaleY: 0, // scale vertically to 0
                duration: 200, // duration in milliseconds
                delay: 0, // delay in milliseconds before the tween starts
                onComplete: function () {
                    // Callback function when the tween is complete
                    dot.destroy(); // Delete the game object from the scene
                }
            });
        }

        playDotConnectedEffects(dot)
        {
            const sizeTween = this.tweens.add({
                targets: dot,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 170,
                ease: 'Power2.easeIn',
                easeOut: 'Power4.easeIn',
                easeParams: [2],
                yoyo: true,
                repeat: 0
            });
        }

        getRandomDotColor()
        {    
            const colorList = [
                0xf46d43,
                0xd8e594,
                0x3288bd,
                0x66c2a5,
                0xfdae61,
                0xd53e4f,
                0xfee08b,
                0xabdda4
            ]

            // Random integer within interval [0, numColors)
            var randomIndex = Math.floor(Math.random() * numColors);
            return colorList[randomIndex];
        }

        // Grid view functions
        // Create hex tiles with code
        drawHexTiles()
        {
            const xOffset = 100
            const yOffset = 100
            const hexSize = 50;

            const hexHeight = Math.sqrt(3) * hexSize / 2;

            for (var i = 0; i < numRows; i++) {
                grid_positions[i] = []
                var oddRow = (i % 2 != 0)

                for (var j = 0; j < numCols; j++) {
                    var x = j * 2 * hexHeight;
                    if (oddRow)
                        x += hexHeight;

                    var y = i * (1.5 * hexSize);

                    x += xOffset
                    y += yOffset
                    
                    grid_positions[i][j] = {x : x, y : y}
                    this.drawHexagon(x, y, hexSize);
                }
            }

        }

        drawHexagon(x, y, size) 
        {
            var graphics = this.add.graphics();
            graphics.lineStyle(2, 0x111111, 1);

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
        }
    }

    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#eeeeee',
        scene: DotsScene
    };

    var game = new Phaser.Game(config);
    