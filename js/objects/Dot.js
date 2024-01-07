class Dot extends Phaser.GameObjects.Ellipse{
    static numColors;

    constructor (scene, x, y, color)
    {
        const dotSize = GameConstants.DOT.size;
        super(scene, x, y, dotSize, dotSize, color);

        this.scene = scene;
        this.dotSize = dotSize;
        // TODO: use larger hit box
        // this.hitCircleSize = dotSize * 1.5;
        this.moveTime = 200; //Time it takes for dot to move one grid unit
        this.color = color;
        this.row = undefined;
        this.column = undefined;

        this.connectedTween;
        this.destroyTween;
        this.moveTween;
        this.setUpConnectedAnimation();
        this.setUpDestroyAnimation();

        this.setInteractive();
        // TODO: use larger hit box
        // this.setInteractive(new Phaser.Geom.Ellipse(x, y, this.hitCircleSize, this.hitCircleSize), Phaser.Geom.Ellipse.Contains);

        
        this.scene.add.existing(this);

        // this.scene.add.image(400, 300, 'particle').setTint(0xff0000);
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
        if(this.connectedTween.isDestroyed())
            return;

        // The connected animation should not interfere with the destroy animation
        if(!this.destroyTween.isPlaying()){
            this.connectedTween.play();
            this.emitParticle();
        }
            
    }

    emitParticle()
    {
        this.emitter = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 1, end: 3 },
            speed: { min: 0, max: 0 },
            lifespan: 200,
            tint:this.color,
            alpha: {start: 0.5, end: 0},
            emitting: false,
        });
        // this.mainContainer.add(this.emitter);
        this.emitter.emitParticleAt(this.x, this.y);
    }

    destroyWithEffects()
    {
        this.connectedTween.stop();
        this.destroyTween.play();
    }

    moveThroughPositions(positions, delay){
        var tweenChain = [];
        for(var i = 0; i < positions.length; i++) {
            var tween = this.getMoveTweenForPosition(positions[i]);
            tweenChain.push(tween);
        }

        // First tween has the delay
        tweenChain[0].delay = delay;

        this.moveTween = this.scene.tweens.chain({
            targets: this,
            tweens: tweenChain,
        });
    }

    getMoveTweenForPosition(position) {
        return {
            x: position.x,
            y: position.y,
            delay: 0,
            duration: this.moveTime, 
            ease: 'Quad',
            repeat: 0,
            yoyo: false,
        }   
    }
}