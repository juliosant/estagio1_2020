class BootScene extends Phaser.Scene {
    
    create(){
        this.scene.add('boot', BootScene);
        this.scene.add('load', LoadScene);
        this.scene.add('menu', MenuScene);
            this.scene.add('presentation', InitialPresentation);
            this.scene.add('stageText', StageTextScene);
            this.scene.add('stage1', Stage1);
            this.scene.add('stage2', Stage2);
            this.scene.add('stage3', Stage3);
        this.scene.add('credits', CreditsScene);
        this.scene.add('info', InfoScene);
            this.scene.add('story', StoryGameScene);
        this.scene.add('gameOver', GameOverScene);
        this.scene.add('final', FinalScene);

        this.scene.start('load');
    }
    
}

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 525,
    },
    //width: 1024,
    //height: 525,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: BootScene,

};
var game = new Phaser.Game(config);
