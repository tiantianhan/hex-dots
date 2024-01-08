/**
 * Overlay that flashes in the given color.
 */
class TintedOverlay extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, children) {
        super(scene, x, y, children);

        this.scene = scene;
        this.color = 0x000000;
        this.peakOpacity = 0.5;
        this.width = width;
        this.height = height;

        this.alphaTween;
    }

    createOverlay(color) {
        this.overlay = this.scene.add.graphics();
        this.overlay.fillStyle(color, 1);
        this.overlay.fillRect(0, 0, this.width, this.height);
        // Set interactive to avoid blocking inputs
        this.overlay.setInteractive();
        this.add(this.overlay);
    }

    flashOverlay(color) {
        this.createOverlay(color);
        this.overlay.setAlpha(0);
        this.alphaTween = this.scene.tweens.add({
            targets: this.overlay,
            alpha: 0.5,
            duration: 200,
            ease: "Quad",
            yoyo: true,
            repeat: 0,
            onComplete: () => {
                this.overlay.destroy();
            },
        });
    }
}
