/**
 * Helper functions
 */
class GameUtilities {
    /**
     * Fade out transition from this scene to the next scene with nextSceneId.
     * Passes nextSceneData to the next scene.
     */
    static fadeOutScene(scene, nextSceneId, nextSceneData) {
        // Use camera for a white out scene transition
        scene.cameras.main.fadeOut(150, 255, 255, 255);
        scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam, effect) => {
                scene.scene.start(nextSceneId, nextSceneData);
            }
        );
    }

    /**
     * Fade in this scene.
     */
    static fadeInScene(scene) {
        scene.cameras.main.fadeIn(250, 255, 255, 255);
    }

    /**
     * @param {int} rows
     * @param {int} cols
     * @param {*} initialValue
     * @returns rows x cols array with all elements set to initialValue
     */
    static initializeArray(rows, cols, initialValue) {
        var array = [];
        for (var i = 0; i < rows; i++) {
            array[i] = [];
            for (var j = 0; j < cols; j++) {
                array[i][j] = initialValue;
            }
        }

        return array;
    }

    /**
     * Clamps value to between a mininum and maximum, inclusive.
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}
