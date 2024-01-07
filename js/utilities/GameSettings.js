class GameSettings {
    constructor (numRows, numCols, numDotColors)
    {
        this.numRows = numRows || GameConstants.GRID.numRowsDefault;
        this.numCols = numCols || GameConstants.GRID.numColsDefault;
        this.numColors = numDotColors || GameConstants.DOT.numColorsDefault;
    }
}