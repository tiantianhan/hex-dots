/**
 * A pair of labeled "-" and "+" text buttons that controls a value.
 */
class PlusMinusButton extends Phaser.GameObjects.Container {
    constructor(
        scene,
        x,
        y,
        label,
        initialValue,
        minValue,
        maxValue,
        children
    ) {
        super(scene, x, y, children);
        this.scene = scene;

        this.value = initialValue;
        this.min = minValue;
        this.max = maxValue;
        this.label = label;

        const labelText = this.scene.add.text(0, 0, label, {
            fill: GameConstants.TEXT.color,
            fontFamily: GameConstants.TEXT.fontFamily,
            fontSize: GameConstants.TEXT.fontSize,
        });
        this.minusButton = new TextButton(
            this.scene,
            labelText.width + 10,
            0,
            "-"
        );
        this.minusButton.setFontFamily("courier");
        this.addButton = new TextButton(
            this.scene,
            labelText.width + this.minusButton.width + 40,
            0,
            "+"
        );
        this.addButton.setFontFamily("courier");
        this.add([labelText, this.minusButton, this.addButton]);
        this.scene.add.existing(this);

        this.clickEmitter = new Phaser.Events.EventEmitter();

        this.clampAndCheckEnabled();
        this.handleButtonClicks();
    }

    handleButtonClicks() {
        this.addButton.on("pointerup", () => {
            this.value++;

            this.clampAndCheckEnabled();
            this.clickEmitter.emit("click", this.value);
        });

        this.minusButton.on("pointerup", () => {
            this.value--;

            this.clampAndCheckEnabled();
            this.clickEmitter.emit("click", this.value);
        });
    }

    clampAndCheckEnabled() {
        if (this.value >= this.max) {
            this.value = this.max;
            this.addButton.setEnabled(false);
        }

        if (this.value <= this.min) {
            this.value = this.min;
            this.minusButton.setEnabled(false);
        }

        if (this.value < this.max) {
            this.addButton.setEnabled(true);
        }

        if (this.value > this.min) {
            this.minusButton.setEnabled(true);
        }
    }
}
