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
        });
        this.minusButton = new TextButton(
            this.scene,
            labelText.width + 10,
            0,
            "-"
        );
        this.addButton = new TextButton(
            this.scene,
            labelText.width + this.minusButton.width + 40,
            0,
            "+"
        );
        this.add([labelText, this.minusButton, this.addButton]);
        this.scene.add.existing(this);

        this.clickEmitter = new Phaser.Events.EventEmitter();

        this.clampAndCheckEnabled();
        this.handleButtonClicks();
    }

    handleButtonClicks() {
        this.addButton.on("pointerdown", () => {
            this.value++;

            this.clampAndCheckEnabled();
            this.clickEmitter.emit("click", this.value);
        });

        this.minusButton.on("pointerdown", () => {
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
