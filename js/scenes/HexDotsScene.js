// Game data
const numRows = 6;
const numCols = 7;
const numColors = 4;

// Grid view data
// Row number x column number array of x, y positions
// var grid_positions = [];
var grid;

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

class HexDotsScene extends Phaser.Scene
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
        grid = new HexGrid(this);
        this.initializeDots();
        dot_line = new DotLine(this);

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
                var dot = this.spawnDot(grid.positions[i][j].x, grid.positions[i][j].y, color);
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
                dot_line.addDot(dot, grid.positions);
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
}