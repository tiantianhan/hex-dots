/**
 * Horizontal bar that evenly spaces each added element.
 * Expects element to be of type BarElement.
 * Expects elements are centered vertically such that their origin is at (0, 0.5).
 */
class HorizontalBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, children) {
        super(scene, x, y, children);

        this.scene = scene;
        this.width = width;
        this.height = height;

        const uiBackground = new Phaser.GameObjects.Rectangle(
            this.scene,
            0,
            0,
            this.width,
            this.height,
            GameConstants.TOP_BAR.color,
            1
        ).setOrigin(0);

        this.scene.add.existing(uiBackground);
    }

    add(element) {
        super.add(element);
        this.updatePositions();
    }

    updatePositions() {
        var numElements = this.length;
        var spacing = this.width / numElements;
        var elements = this.getAll();
        for (var i = 0; i < elements.length; i++) {
            elements[i].x = spacing * (i + 0.5) - elements[i].getWidth() * 0.5;
            elements[i].y = this.height * 0.5; // Assumes origin of element is centered vertically
        }
    }
}
