/**
 * Counts down from initial time in units of seconds.
 */
class CountdownTimer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, initialTime, children) {
        super(scene, x, y, children);
        this.scene = scene;

        this.initialTime = initialTime;
        this.timeRemaining = initialTime;

        const smallSpace = 10;
        const timerText = this.scene.add.text(0, 0, "Timer: ", {
            fill: GameConstants.TEXT.color,
        });
        this.timeDisplay = this.scene.add.text(
            timerText.width + smallSpace,
            0,
            initialTime.toString(),
            { fill: GameConstants.TEXT.color }
        );
        this.add([timerText, this.timeDisplay]);

        // Set a timer to tick every second
        this.timedEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.onTimerEvent,
            callbackScope: this,
            loop: true,
        });

        this.eventEmitter = new Phaser.Events.EventEmitter();
    }

    onTimerEvent() {
        this.timeRemaining--;
        this.timeRemaining = Math.max(0, this.timeRemaining);

        this.updateTimeDisplay();

        if (this.timeRemaining <= 3) {
            this.timeDisplay.setColor(GameConstants.TEXT.colorHover);
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
}
