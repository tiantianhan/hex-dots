var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#eeeeee',
    parent: 'game-container',
    scene: [HexDotsScene],
};

var game = new Phaser.Game(config);