class GameConstants {
    static WIDTH = 800;
    static HEIGHT = 600;

    static BACKGROUND = {
        color: "#eeeeee",
    }

    static TEXT = {
        color: "#111111",
        colorHover: "#f46d43",
    }

    static MARGINS = {
        top: 100,
        left: 100,
    };

    static GRID = {
        numRowsDefault: 6,
        numColsDefault: 7,
        numRowsMin: 3, 
        numRowsMax: 6,
        numColsMin: 3,
        numColsMax: 7,
        hexSize: 50,
        lineWidth: 2,
        lineColor: 0xcccccc,
    }

    static DOT = {
        numColorsDefault: 4,
        numColorsMin: 4,
        numColorsMax: 8,
        size: 20,
        // Must have at least numColorsMax possible colors
        possibleColors: [
            0xf46d43,
            0xd8e594,
            0x3288bd,
            0x66c2a5,
            0xfdae61,
            0xd53e4f,
            0xfee08b,
            0xabdda4,
        ],
    }

    static DOT_LINE = {
        lineWidth: 2,
    }
}