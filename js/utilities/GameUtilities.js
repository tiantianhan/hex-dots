/**
 * Helper functions
 * 
 * @class
 */
class GameUtilities {
    /**
     * @param {int} rows 
     * @param {int} cols 
     * @param {*} initialValue 
     * @returns rows x cols Array with all elements set to initialValue
     */
    static initializeArray(rows, cols, initialValue) {
        var array = [];
        for (var i = 0; i < rows; i++){
            array[i] = [];
            for (var j = 0; j <  cols; j++){
                array[i][j] = initialValue;
            }
        }

        return array;
    }

    /**
     * Clamps value to between a mininum and maximum, inclusive
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}