class LoadScene extends Phaser.Scene {
    preload() {
        this.load.image('bg-control', 'assets/bg-control.png');
        this.load.image('bg-button', 'assets/bg-button.png');

        this.load.image('bgStage1', 'assets/bgStage1.png');
        this.load.image('bgStage2', 'assets/bgStage2.png');
        this.load.image('bgStage3', 'assets/bgStage3.png');

        this.load.image('blockStage1', 'assets/blockStage1.png');
        this.load.image('blockStage2', 'assets/blockStage2.png');
        this.load.image('blockStage3', 'assets/blockStage3.png');

        this.load.image('blockS1end', 'assets/blockStage1end.png');

        this.load.image('ammunition', 'assets/ammunition.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('tower', 'assets/tower.png');

        this.load.image('button', 'assets/button.png');
        this.load.image('weapon', 'assets/weapon.png');

        this.load.image('progressbar', 'assets/progressbar.png');
        
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 20, frameHeight: 25 });
        this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 20, frameHeight: 25 });
        this.load.spritesheet('coin', 'assets/coin.png', { frameWidth: 25, frameHeight: 25 });

        var url;
            url = 'js/rexvirtualjoystickplugin.min.js';
             //url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
             this.load.plugin('rexvirtualjoystickplugin', url, true);
        
        var movimentBullet; //armazenar direção da bala
        
    }
    create(){
        this.scene.start('menu');
    }
}