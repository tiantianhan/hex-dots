class Dot extends Phaser.GameObjects.Container{
    static numColors;

    constructor (scene, x, y, color, children)
    {
        super(scene, x, y, children);

        const dotSize = GameConstants.DOT.size;
        this.circle = new Phaser.GameObjects.Ellipse(scene, 0, 0, dotSize, dotSize, color);
        this.scene.add.existing(this.circle);

        this.scene = scene;
        this.dotSize = dotSize;
        this.hitCircleSize = dotSize * 1.5;
        this.moveTime = 200; //Time it takes for dot to move one grid unit
        this.color = color;
        this.row = undefined;
        this.column = undefined;

        this.connectedTween;
        this.destroyTween;
        this.moveTween;
        this.setUpConnectedAnimation();
        this.setUpDestroyAnimation();

        this.setInteractive(new Phaser.Geom.Ellipse(0, 0, this.hitCircleSize, this.hitCircleSize), Phaser.Geom.Ellipse.Contains);
        
        this.scene.add.existing(this);
        this.add(this.circle);
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
            targets: this.circle,
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
            targets: this.circle,
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
        if(!this.destroyTween.isPlaying()){
            this.setUpConnectedAnimation();
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
        this.add(this.emitter);
        this.emitter.emitParticleAt(0, 0);
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

        tweenChain[tweenChain.length - 1].ease = 'Bounce';
        tweenChain[tweenChain.length - 1].duration = this.moveTime * 1.5;

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

    customEase(t) {
        return t; //* t;
    }
}