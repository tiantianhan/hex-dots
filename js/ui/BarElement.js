/**
 * UI element which provides methods to access the width and height of its contents.
 */
class BarElement extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);

        this.width = 0;
        this.height = 0;
    }

    getWidth() {}

    getHeight() {}
}
