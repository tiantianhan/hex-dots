var config = {
    type: Phaser.AUTO,
    width: GameConstants.WIDTH,
    height: GameConstants.HEIGHT,
    backgroundColor: GameConstants.BACKGROUND.color,
    parent: 'game-container',
    scene: [SettingsScene, HexDotsScene, EndScene],
};

var game = new Phaser.Game(config);