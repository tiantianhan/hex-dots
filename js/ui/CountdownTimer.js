/**
 * Counts down from initial time in units of seconds.
 */
class CountdownTimer extends BarElement {
    constructor(scene, x, y, initialTime, children) {
        super(scene, x, y, children);
        this.scene = scene;

        this.warningTime = 3;
        this.initialTime = initialTime;
        this.timeRemaining = initialTime;

        const smallSpace = GameConstants.TOP_BAR.smallFontSize;
        const timerText = this.scene.add
            .text(0, 0, "Time:", {
                fill: GameConstants.TEXT.color,
                fontFamily: GameConstants.TEXT.fontFamily,
                fontSize: GameConstants.TOP_BAR.smallFontSize,
            })
            .setOrigin(0, 0.5);
        this.timeDisplay = this.scene.add
            .text(timerText.width + smallSpace, 0, initialTime.toString(), {
                fill: GameConstants.TEXT.color,
                fontFamily: GameConstants.TEXT.fontFamily,
                fontSize: GameConstants.TOP_BAR.largeFontSize,
            })
            .setOrigin(0, 0.5);
        this.add([timerText, this.timeDisplay]);

        // Set a timer to tick every second
        this.timedEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.onTimerEvent,
            callbackScope: this,
            loop: true,
        });

        this.eventEmitter = new Phaser.Events.EventEmitter();

        this.width = timerText.width + smallSpace + this.timeDisplay.width;
        this.height = this.timeDisplay.height;
    }

    onTimerEvent() {
        this.timeRemaining--;
        this.timeRemaining = Math.max(0, this.timeRemaining);

        this.updateTimeDisplay();

        if (this.timeRemaining <= this.warningTime) {
            this.timeDisplay.setColor(GameConstants.TEXT.colorHighlight);
        }

        // Countdown complete
        if (this.timeRemaining <= 0) {
            this.timedEvent.remove();

            this.eventEmitter.emit("timerComplete", this.initialTime);
        }
    }

    updateTimeDisplay() {
        this.timeDisplay.text = this.timeRemaining;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}
