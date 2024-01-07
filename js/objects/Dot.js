class Dot extends Phaser.GameObjects.Ellipse{
    static numColors;

    constructor (scene, x, y, color)
    {
        const dotSize = GameConstants.DOT.size;
        super(scene, x, y, dotSize, dotSize, color);

        this.scene = scene;
        this.dotSize = dotSize;
        this.hitCircleSize = dotSize * 1.5;
        this.moveTime = 200; //Time it takes for dot to move one grid unit
        this.color = color;
        this.row = undefined;
        this.column = undefined;

        this.connectedTween;
        this.destroyTween;
        this.setUpConnectedAnimation();
        this.setUpDestroyAnimation();

        this.setInteractive();
        // this.setInteractive(new Phaser.Geom.Ellipse(x, y, this.hitCircleSize, this.hitCircleSize), Phaser.Geom.Ellipse.Contains);

        this.scene.add.existing(this);
    }

    /**
   * Get a random dot color from one of numColors different colors
   * @static
   */
    static getRandomDotColor()
    {    
        // Random integer within interval [0, numColors)
        var randomIndex = Math.floor(Math.random() * this.numColors);
        return GameConstants.DOT.possibleColors[randomIndex];
    }

    update() {

    }

    setUpConnectedAnimation(){
        this.connectedTween = this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 170,
            paused: true,
            ease: 'Power2.easeIn',
            easeOut: 'Power4.easeIn',
            easeParams: [2],
            yoyo: true,
            repeat: 0
        });
    }

    setUpDestroyAnimation(){
        this.destroyTween = this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            delay: 0,
            paused: true,
            onComplete: () => {
                this.destroyTween = undefined;
                this.destroy();
            }
        });
    }

    playDotConnectedEffects()
    {
        // The connected animation should not interfere with the destroy animation
        if(!this.destroyTween.isPlaying())
            this.connectedTween.play();
    }

    destroyWithEffects()
    {
        this.connectedTween.stop();
        this.destroyTween.play();
    }

    playRepositionEffects(targetX, targetY)
    {
        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration: 200, 
            ease: 'Linear',
            repeat: 0,
            yoyo: false,
        });
    }

    moveThroughPositions(positions, delayFactor)
    {
        this.scene.tweens.add({
            targets: this,
            x: positions[0].x,
            y: positions[0].y,
            duration: this.moveTime, 
            ease: 'Quad',
            repeat: 0,
            yoyo: false,
            delay: this.moveTime * delayFactor,
            onComplete: () => {
                // Remove first element in list of positions and continue moving
                positions.shift();
                if(positions.length > 0)
                    this.moveThroughPositions(positions);
            }
        });
    }
}