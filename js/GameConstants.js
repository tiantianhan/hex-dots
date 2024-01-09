/**
 * Constants used throughout the game for easy adjustment.
 */
class GameConstants {
    static WIDTH = 800;
    static HEIGHT = 700;

    static BACKGROUND = {
        color: 0xeeeeee,
    };

    static TEXT = {
        color: "#111111",
        colorClick: "#b7330b",
        colorHover: "#f46d43",
        colorHighlight: "#f46d43",
        colorDisable: "#cccccc",
        fontFamily: "Montserrat, Courier, serif",
        fontSize: 18,
    };

    static MARGINS = {
        top: 150,
        left: 120,
    };

    static TOP_BAR = {
        height: 50,
        color: 0xdddddd,
        smallFontSize: 16,
        largeFontSize: 20,
    };

    static GRID = {
        numRowsDefault: 6,
        numColsDefault: 7,
        numRowsMin: 2,
        numRowsMax: 6,
        numColsMin: 2,
        numColsMax: 7,
        hexSize: 50,
        lineWidth: 2,
        lineColor: 0xcccccc,
    };

    static DOT = {
        numColorsDefault: 4,
        numColorsMin: 1,
        numColorsMax: 8,
        size: 25,
        // Larger scale results in larger particle effect
        particleScale: 5,
        // Must have at least numColorsMax possible colors
        possibleColors: [
            0xf46d43, 0xd8e594, 0x3288bd, 0x66c2a5, 0xfdae61, 0xd53e4f,
            0xfee08b, 0xabdda4,
        ],
    };

    static DOT_LINE = {
        lineWidth: 5,
    };

    static TIMER = {
        initialTime: 40, // Seconds
    };
}
