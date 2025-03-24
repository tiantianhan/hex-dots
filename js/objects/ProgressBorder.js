/**
 * Rectangular border which animates to give visual feedback when user connects more dots.
 * Call setProgress to cause horizontal lines to increase in length as more dots are connected.
 * Call showFullSquare to draw a square when dots form a loop, and clear the progress.
 */
class ProgressBorder extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, children) {
        super(scene, x, y, children);

        this.scene = scene;
        this.width = width;
        this.height = height;
        this.color = 0x000000;
        this.progress = 0;
        this.borderWeight = 8;

        this.topBorder;
        this.bottomBorder;
        this.verticalBorders;

        this.tintedOverlay = new TintedOverlay(
            this.scene,
            0,
            0,
            this.width,
            this.height
        );
        this.scene.add.existing(this.tintedOverlay);
        this.add(this.tintedOverlay);

        this.drawVerticalBorders();
        this.drawTopBottomBorders();

        this.progressAnimation;
        this.fullSquareAnimation;
    }

    setColor(color) {
        this.color = color;
        if (this.topBorder) this.topBorder.setFillStyle(color);
        if (this.bottomBorder) this.bottomBorder.setFillStyle(color);

        for (var border of this.verticalBorders) {
            if (border) border.setFillStyle(color);
        }
    }

    /**
     * Set the progress between 0 and 1
     */
    setProgress(progress) {
        this.progress = progress;
        this.progress = GameUtilities.clamp(this.progress, 0, 1);

        this.animateHorizontalBorder([this.topBorder, this.bottomBorder]);
    }

    clearProgress() {
        this.progress = 0;
        this.animateHorizontalBorder([this.topBorder, this.bottomBorder]);
    }

    drawTopBottomBorders() {
        this.topBorder = this.drawHorizontalBorder(0);
        this.bottomBorder = this.drawHorizontalBorder(
            this.height - this.borderWeight
        );
    }

    drawHorizontalBorder(posY) {
        var border = new Phaser.GameObjects.Rectangle(
            this.scene,
            this.width * 0.5,
            posY,
            this.width, // width when progress is 1
            this.borderWeight, // height is the border thickness
            this.color,
            1
        )
            .setOrigin(0.5, 0)
            .setScale(0, 1); // initialize horizontal scale to 0

        this.scene.add.existing(border);
        this.add(border);
        return border;
    }

    drawVerticalBorders() {
        this.verticalBorders = [];
        const origins = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 1 },
        ];
        const positions = [
            { x: 0, y: 0 },
            { x: this.width - this.borderWeight, y: 0 },
            { x: 0, y: this.height },
            { x: this.width - this.borderWeight, y: this.height },
        ];

        for (var i = 0; i < 4; i++) {
            var border = new Phaser.GameObjects.Rectangle(
                this.scene,
                positions[i].x,
                positions[i].y,
                this.borderWeight, // width is the border thickness
                this.height * 0.5, // length when progress is 1
                this.color,
                1
            )
                .setOrigin(origins[i].x, origins[i].y)
                .setScale(1, 0); // initialize vertical scale to 0

            this.scene.add.existing(border);
            this.add(border);
            this.verticalBorders.push(border);
        }
    }

    animateHorizontalBorder(border) {
        this.progressAnimation = this.scene.tweens.add({
            targets: border,
            scaleX: this.progress,
            duration: 300,
            ease: "Quad",
        });
    }

    showFullSquare(color) {
        this.color = color;
        this.progress = 0;

        // Progress animation should not interfere with square animation
        this.stopProgressAnimation();

        this.tintedOverlay.flashOverlay(this.color);

        this.fullSquareAnimation = this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    targets: [this.topBorder, this.bottomBorder],
                    scaleX: 1,
                    duration: 100,
                    ease: "Quad",
                },
                {
                    targets: this.verticalBorders,
                    scaleY: 1,
                    duration: 100,
                    ease: "Quad",
                },
                {
                    targets: this.verticalBorders,
                    scaleY: 0,
                    duration: 100,
                    ease: "Quad",
                },
                {
                    targets: [this.topBorder, this.bottomBorder],
                    scaleX: 0,
                    duration: 100,
                    ease: "Quad",
                },
            ],
        });
    }

    stopProgressAnimation() {
        if (this.progressAnimation && this.progressAnimation.isPlaying())
            this.progressAnimation.stop();
    }
}
