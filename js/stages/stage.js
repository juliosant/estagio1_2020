class Stage extends Phaser.Scene {
    //Método para criar todas as instãncias do jogo
    create() {

        this.moviment;
        this.angle;
        this.force;
        this.introStage = true;

        //::::::::::::::::::::::BACKGROUNDS::::::::::::::::::::::
        this.add.image(150 / 2, 275, 'bg-control');
        this.add.image(962.5, 275, 'bg-button');
        this.add.image(525, 275, this.keyBackground);

        //::::::::::::::::::::::GRUPOS E ANIMAÇÕES::::::::::::::::::::::
        //Agrupar blocos
        this.platforms = this.physics.add.staticGroup();

        //Agrupar moedas
        this.coins = this.physics.add.group();
        this.qtdCoins = 0
        //Animação da moeda
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1,
        });

        //Agrupar inimigos
        this.enemies = this.physics.add.group();
        this.groupEnemies = [];
        this.enemyPosition = 0;

        //Animação do inimigo
        this.anims.create({
            key: 'goLeft',
            frames: this.anims.generateFrameNumbers('enemy', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'goRight',
            frames: this.anims.generateFrameNumbers('enemy', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'goUp',
            frames: this.anims.generateFrameNumbers('enemy', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'goDown',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        //:::::::Agrupar obstáculos
        //Na fase 2 (com movimentos)
        if (this.isStage2) {
            this.createObstacles()
        }
        //Na fase 3 (sem movimentos)
        else if (this.isStage3) {
            this.createObstacles()
        }
        this.groupObstacle = [];
        this.positionObstacle = 0;

        //::::::::::::::::::::::INSTÂNCIAS::::::::::::::::::::::
        //:::::::Instanciar objetos no labirinto
        for (var row in this.maze) {
            for (var col in this.maze[row]) {
                this.tile = this.maze[row][col]

                var x = col * 25;
                var y = row * 25;

                //Instanciar blocos
                if (this.tile === 1) {

                    this.platforms.create(x + 12.5, y + 12.5, this.keyBlock);
                }

                //Instanciar player
                else if (this.tile === 2) {
                    this.player = this.physics.add.sprite(x + 12.5, y + 12.5, 'player').setTint('0xeeeeee');
                    //this.player.setTint(0xcccccc);
                    this.player.setBounce(1);
                    this.player.setCollideWorldBounds(true);

                    //Animação do player
                    this.anims.create({
                        key: 'left',
                        frames: this.anims.generateFrameNumbers('player', { start: 17, end: 23 }),
                        frameRate: 10,
                        repeat: -1
                    });
                    //animar para a direita
                    this.anims.create({
                        key: 'right',
                        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 15 }),
                        frameRate: 10,
                        repeat: -1

                    });
                    //animar para a cima
                    this.anims.create({
                        key: 'up',
                        frames: this.anims.generateFrameNumbers('player', { start: 25, end: 31 }),
                        frameRate: 10,
                        repeat: -1

                    });
                    //animar para a baixo
                    this.anims.create({
                        key: 'down',
                        frames: this.anims.generateFrameNumbers('player', { start: 1, end: 7 }),
                        frameRate: 10,
                        repeat: -1
                    });

                }

                //Instanciar moeda
                else if (this.tile === 3) {
                    this.coins.create(x + 12.5, y + 12.5, 'coin').play('spin').setScale(0.75);
                    this.qtdCoins += 1;
                }

                //Instanciar inimigos
                else if (this.tile === 4) {
                    this.groupEnemies[this.enemyPosition] = this.physics.add.sprite(x + 12.5, y + 12.5, 'enemy').setTint('0xff5588');
                    this.groupEnemies[this.enemyPosition].setCollideWorldBounds(true);
                    this.enemies.add(this.groupEnemies[this.enemyPosition]);
                    if (this.isStage2) {
                        this.groupEnemies[this.enemyPosition].setTint('0xffaa00 ')
                    }

                    if (this.isStage3) {
                        this.groupEnemies[this.enemyPosition].setTint('0xdd55ff')
                    }
                    this.enemyPosition += 1;

                }

                //Instanciar arma
                else if (this.tile === 5) {
                    this.weapon = this.physics.add.image(x + 12.5, y + 12.5, 'weapon');
                }

                //Instanciar barreira
                if (this.tile === 6) {

                    this.tileEnd = this.platforms.create(x + 12.5, y + 12.5, 'blockend').setScale(1.5);
                }
                //:::::::SOMENTE NAS FASES 2 E 3
                //Instanciar obstáculos
                if (this.tile === 7) {
                    if (this.isStage2) {
                        this.groupObstacle[this.positionObstacle] = this.physics.add.image(x + 12.5, y + 12.5, 'spike-ball')
                        .setScale(0.8);
                        this.obstacles.add(this.groupObstacle[this.positionObstacle]);
                    }
                    else if (this.isStage3) {
                        this.groupObstacle[this.positionObstacle] = this.obstacles.create(x + 12.5, y + 12.5, 'tomb');
                        this.leverExists = true;
                    }
                    this.positionObstacle += 1;
                }
                //Instanciar alavanca (Somente na 3a fase)
                if (this.tile === 8 && this.leverExists) {
                    this.lever = this.physics.add.image(x + 12.5, y + 12.5, 'lever');
                }
            }
        }


        //::::::::::::::::::::::BOTÔES::::::::::::::::::::::
        //Botão de tiro
        this.weaponButton = this.add.image(962.5, 250, 'weaponButton').setInteractive();
        this.weaponButton.setVisible(false);
        this.bullets = new Bullets(this);

        this.weaponButton.on('pointerdown', function (pointer) {
            this.weaponButton.setTintFill(0xc7bf97, 0xfff3c9, 0xc7bf97);
            this.bullets.fireBullet(this.player.x, this.player.y);
            this.sndShoot.play();
        }, this);


        this.weaponButton.on('pointerup', function (pointer) {
            this.weaponButton.clearTint();
        }, this);

        //Botão para desativar obstaculos - somene na 3a fase
        if (this.isStage3) {
            this.createLeverButton()
        }

        //Movimento das obstáculos móveis
        if (this.isStage2) {
            this.movimentOfObstacles()
        }

        //::::::::::::::::::::::RECURSO DE ENTRADA::::::::::::::::::::::
        //Instancia de teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        //Instancia do controle virtual
        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 75,
            y: 275,
            radius: 34,
            base: this.add.circle(0, 0, 68, 0xc7bf97),
            thumb: this.add.circle(0, 0, 36, 0xfff3c9),

        })
            .on('update', this.dumpJoyStickState, this);

        this.text = this.add.text(0, 0);
        this.dumpJoyStickState();


        //::::::::::::::::::::::INFORMAÇÔES DE STATUS::::::::::::::::::::::
        //Pontuação
        if (this.isStage1) {
            this.resetScore()
        }
        this.score = currentScore;
        this.scoreText = this.add.text(175, 10, 'Pontos: ' + this.score, { font: '12px emulogic', fill: '#ffa' });

        //::Situação de armamento
        this.amunitionBullet = 7;
        //Situação 1
        this.getWeaponObject = this.add.text(400, 10, '[Pegue a Arma!]', { font: '12px emulogic', fill: '#a0a0a0' })
        //Situação 2
        this.amunitionBulletText = this.add.text(400, 10, 'Municao: ' + this.amunitionBullet + ' balas', { font: '12px emulogic', fill: '#f5a460' });
        this.amunitionBulletText.setVisible(false);
        //Situação 3
        this.noBullets = this.add.text(425, 10, 'Sem balas!', { font: '12px emulogic', fill: '#aa0000' }).setVisible(false);

        //Tempo
        this.c = 150;
        this.clock = this.add.text(725, 10, 'Tempo: ' + this.c, { font: '12px emulogic', fill: '#ffa' });
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.timer, callbackScope: this, loop: true });

        //::::::::::::::::::::::COLISÕES::::::::::::::::::::::
        //Colisões simples
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        //Colisões reativas
        this.physics.add.overlap(this.player, this.coins, this.getCoin, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.damage, null, this);
        this.physics.add.overlap(this.player, this.weapon, this.getWeapon, null, this);
        this.physics.add.overlap(this.bullets, this.enemies, this.hitShot, null, this);
        this.physics.add.overlap(this.bullets, this.platforms, this.missedShot, null, this);
        if (this.isStage2) {
            this.collidersStage()
        }
        else if (this.isStage3) {
            this.createInstancesOfStage();
            this.collidersStage();
        }

        //::::::::::::::::::::::ORIENTAÇÔES INICIAIS DA FASE::::::::::::::::::::::
        //Imagem de orientação
        this.introductingStage = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, this.introductionStage);
        //Botão para fechar orientação da fase
        this.closeintroductionButton = this.add.text(420, 400, '[Fechar]', { font: '20px emulogic', fill: '#f7f2ad' }).setInteractive();
        this.closeintroductionButton.once('pointerdown', function (pointer) {
            this.closeintroductionButton.destroy();
            this.introductingStage.destroy();
            //::::::::::::::::::::::APRESENTAÇÂO DO LABIRINTO::::::::::::::::::::::
            //Mostrado apenas depois da montagem do labirinto
            this.nameStage0 = this.add.text(512, 250, this.nameMaze0, { font: '15px emulogic', fill: '#ffffff' })
                .setOrigin(0.5);
            this.nameStage1 = this.add.text(512, 300, this.nameMaze1, { font: '37px emulogic', fill: '#ffffff' })
                .setOrigin(0.5);
            this.presentationTime = this.time.addEvent({ delay: 3000, callback: this.endOfStagePresentation, callbackScope: this, loop: false })
            this.introStage = false;
        }, this);

        //::::::::::::::::::::::PARTÍCULAS::::::::::::::::::::::
        this.particles = this.add.particles('particles');
        this.blood = this.add.particles('blood');
        this.blockParticle = this.add.particles('blockParticle');
        if (this.isStage3) {
            //criar particulas das Tumbas
            this.createParticlesOfObstacles()
        }

        //::::::::::::::::::::::AUDIOS:::::::::::::::::::::::::
        //:::::::Instanciar som da fase:::::::
        this.activeSound();
        //:::::::Instanciar som de moeda:::::::
        this.sndCoin = this.sound.add('getCoin');
        this.sndCoin.loop = false;
        //:::::::Instanciar som de tiro:::::::
        this.sndShoot = this.sound.add('shoot');
        this.sndShoot.loop = false;
        //:::::::Instanciar som de tiro:::::::
        this.sndExplosion = this.sound.add('explosion');
        this.sndExplosion.loop = false;
        //:::::::Instanciar som de Vitória:::::::
        this.sndVictory = this.sound.add('victory');
        this.sndVictory.setVolume(0.4);
        this.sndVictory.loop = false;
        this.sndVictory.play();
        this.sndVictory.pause();

    }

    //Método para atualização em tempo real de funcionalidades do jogo
    update() {
        //fase so inicia após fechar a mensagem de orientação da fase
        if (this.introStage == false) {
            //Ateração do time em tempo real
            this.clock.setText('Tempo: ' + this.c);

            //anteração da pontuação em tempo real
            this.scoreText.setText('Pontos: ' + this.score)
            //::::::::::::::::::::ANIMAÇÃO DO INIMIGO::::::::::::::::::::
            let a;
            for (a = 0; a < this.enemies.getLength(); a++) {
                this.moveEnemy(this.groupEnemies[a]);
            }

            //::::::::::::::::::::ANIMAÇÃO DO PLAYER::::::::::::::::::::
            //:::::::Sem movimento:::::::
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            //:::::::Animação direcionais:::::::
            if (this.cursors.left.isDown && !this.cursors.right.isDown || this.moviment === 'left') {
                this.goLeft();
            }
            else if (this.cursors.right.isDown && !this.cursors.left.isDown || this.moviment === 'right') {
                this.goRight();
            }
            else if (this.cursors.up.isDown && !this.cursors.down.isDown || this.moviment === 'up') {
                this.goUp();
            }
            else if (this.cursors.down.isDown && !this.cursors.up.isDown || this.moviment === 'down') {
                this.goDown();
            }
            else if (this.player.setVelocityX(0) && this.player.setVelocityY(0)) {
                this.player.anims.stop('up', true);
            }
            else if (this.force === 0 && this.angle === 0) {
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.player.anims.stop('up', true);
            }

            if (this.player.x > 875 && this.player.y > 475) {
                this.callNextStage();
            }
        }
    }

    //Eliminar apresentação inicial da fase
    endOfStagePresentation() {

        this.nameStage0.destroy();
        this.nameStage1.destroy();
    }
    //Metodo para diminuir o tempo do tempo
    timer() {
        if (this.introStage == false) {
            this.c--;
        }
        if (this.c === 0) {
            this.timedEvent.remove(false);
            textGameOverHere = 'Acabou o tempo'
            this.gameOver();
        }
    }
    //Andar do inimigo
    moveEnemy(enemy) {
        if (Math.floor(enemy.x - 12.5) % 25 === 0 && Math.floor(enemy.y - 12.5) % 25 === 0) {
            var enemyCol = Math.floor(enemy.x / 25);
            var enemyRow = Math.floor(enemy.y / 25);
            var validPath = [];

            if (this.maze[enemyRow][enemyCol - 1] !== 1 && this.maze[enemyRow][enemyCol - 1] !== 6 && this.maze[enemyRow][enemyCol - 1] !== 7 && enemy.direction !== 'RIGHT') {
                validPath.push('LEFT');
            }
            if (this.maze[enemyRow][enemyCol + 1] !== 1 && this.maze[enemyRow][enemyCol + 1] !== 6 && this.maze[enemyRow][enemyCol + 1] !== 7 && enemy.direction !== 'LEFT') {
                validPath.push('RIGHT');
            }
            if (this.maze[enemyRow - 1][enemyCol] !== 1 && this.maze[enemyRow - 1][enemyCol] !== 6 && this.maze[enemyRow - 1][enemyCol] !== 7 && enemy.direction !== 'DOWN') {
                validPath.push('UP');
            }
            if (this.maze[enemyRow + 1][enemyCol] !== 1 && this.maze[enemyRow + 1][enemyCol] !== 6 && this.maze[enemyRow + 1][enemyCol] !== 7 && enemy.direction !== 'UP') {
                validPath.push('DOWN');
            }

            enemy.direction = validPath[Math.floor(Math.random() * validPath.length)];
        }

        switch (enemy.direction) {
            case 'LEFT':
                enemy.x -= 1;
                enemy.anims.play('goLeft', true);
                break;
            case 'RIGHT':
                enemy.x += 1;
                enemy.anims.play('goRight', true);
                break;
            case 'UP':
                enemy.y -= 1;
                enemy.anims.play('goUp', true)
                break;
            case 'DOWN':
                enemy.y += 1;
                enemy.anims.play('goDown', true)
                break;

        }
    }
    //Andar do player
    goLeft() {
        this.player.setVelocityX(-80);
        this.player.anims.play('left', true);
        movimentBullet = 'left';
    }
    goRight() {
        this.player.setVelocityX(80);
        this.player.anims.play('right', true);
        movimentBullet = 'right';
    }
    goUp() {
        this.player.setVelocityY(-80);
        this.player.anims.play('up', true);
        movimentBullet = 'up';
    }
    goDown() {
        this.player.setVelocityY(80);
        this.player.anims.play('down', true);
        movimentBullet = 'down';
    }
    //Movimentação no controle virtual
    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        var s = /*'Key down: '*/'';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                //s += name + ' ';
                this.moviment = name;
            }
        }
        this.force = Math.floor(this.joyStick.force * 100) / 100;
        this.angle = Math.floor(this.joyStick.angle * 100) / 100;

        if (this.force === 0 && this.angle === 0) {
            this.moviment = null;
        }
        this.text.setText(s);
    }

    //::::::::::::::::::::::COLISÕES REATIVAS::::::::::::::::::::::
    //Ativado quando player colidir com inimigo/armadilha
    damage() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        textGameOverHere = 'Voce morreu'
        this.gameOver();
    }
    //Ativado ao colidir com moeda
    getCoin(player, coin) {
        this.sndCoin.play();
        let a = coin.x;
        let b = coin.y;
        let emitter = this.particles.createEmitter({ maxParticles: 15 });
        emitter.setPosition(a, b);
        emitter.setSpeed(50);

        coin.disableBody(true, true);



        this.score += 10;
        this.scoreText.setText('Pontos: ' + this.score);

        this.qtdCoins -= 1
        if (this.qtdCoins == 0) {
            this.sndExplosion.play();

            a = this.tileEnd.x;
            b = this.tileEnd.y;
            emitter = this.blockParticle.createEmitter({ maxParticles: 50 });
            emitter.setPosition(a, b);
            emitter.setSpeed(50);

            this.tileEnd.disableBody(true);
            this.tileEnd.setVisible(false)
        }
    }
    //Ativado quando player colidir com arma
    getWeapon(player, weapon) {
        weapon.disableBody(true, true);
        this.getWeaponObject.setVisible(false);
        this.weaponButton.setVisible(true);
        this.amunitionBulletText.setVisible(true);

        if (this.isStage3) {
            this.msgAtentionStage()
        }
    }
    //Ao acertar bala no inimigo
    hitShot(bullet, enemy) {
        let x = enemy.x;
        let y = enemy.y;
        let emitter = this.blood.createEmitter({ maxParticles: 15 });
        emitter.setPosition(x, y);
        emitter.setSpeed(50);

        enemy.disableBody(true, true);
        bullet.disableBody(true, true);
        bullet.setActive(true);

        this.score += 20;
        this.scoreText.setText('Pontos: ' + this.score);

        this.enemyPosition -= 1;
        //somente para fase 3

        if (this.isStage3) {
            this.destroyTombFinal()
        }
        this.oneBulletLess(this.weaponButton);
    }
    //Sumir com a bala ao atirar contra o bloco
    missedShot(bullet, tile) {
        bullet.disableBody(true, true);
        bullet.setActive(true);
        this.oneBulletLess(this.weaponButton);
    }
    //Uma bala a menos ao atirar
    oneBulletLess(button) {
        this.amunitionBullet -= 1;

        if (this.amunitionBullet === 1) {
            this.amunitionBulletText.setText('Municao: ' + this.amunitionBullet + ' bala');
        }
        else {
            this.amunitionBulletText.setText('Municao: ' + this.amunitionBullet + ' balas');
        }

        if (this.amunitionBullet === 0) {
            button.setVisible(false);
            this.amunitionBulletText.setVisible(false);
            this.noBullets.setVisible(true);
        }

        //Para informar que tem menos balas que monstros
        if (this.isStage3) {
            //Na 3a fase você, caso você tenha menos balas que mosntros será decretado fim de jogo
            this.fewerBulletsThanMonsters()
        }
    }
    //game over
    gameOver() {
        this.desactiveSound();
        currentScore = 0
        this.scene.start('gameOver');
    }
    //Passou de fase
    callNextStage() {
        this.desactiveSound();

        this.time.addEvent({ delay: 1000, callback: this.musicVictory, callbackScope: this, loop: false });

        this.timedEvent.remove();
        //this.tempo = this.c;
        currentScore = this.score + this.c;

        this.Congratulationtext = this.add.text(this.game.renderer.width / 2, 150, 'Parabens!', { font: '35px emulogic', fill: '#ffffff' })
            .setOrigin(0.5);

        //:::::::Texto de encerramento de fase
        //::::::::encerramento do estágio 3
        if (this.isStage3) {
            this.gameObjective.destroy();
            this.textEndingStage3();
        }
        //Encerramento para os demais estágios
        else {
            //eliminar obstáculos do estágio 2
            if (this.isStage2) {
                this.destroyObstaclesStage();
            }
            this.nextStageText = this.add.text((this.game.renderer.width / 2) + 10, 200, 'Voce avancou para o proximo labirinto', { font: '20px emulogic', fill: '#ffffff' })
                .setOrigin(0.5);
            this.ScoreFinalStageText = this.add.text(this.game.renderer.width / 2, 250, 'Pts acumulados: ' + this.score, { font: '20px emulogic', fill: '#ffffff' })
                .setOrigin(0.5);
            this.ScoreFinalStageText = this.add.text(this.game.renderer.width / 2, 300, 'Tempo restante: ' + this.c, { font: '20px emulogic', fill: '#ffffff' })
                .setOrigin(0.5);
            this.ScoreFinalStageText = this.add.text(this.game.renderer.width / 2, 350, 'Total: ' + currentScore, { font: '20px emulogic', fill: '#ffffff' })
                .setOrigin(0.5);

        }
        this.time.addEvent({ delay: 5000, callback: this.callNextScene, callbackScope: this, loop: false })
        if (this.enemies.getLength() > 0) {
            for (let a = 0; a < this.enemies.getLength(); a++) {
                this.groupEnemies[a].disableBody(true, true);
            }
        }
        this.joyStick.setVisible(false)
        this.player.disableBody(true, true);
        this.weaponButton.setVisible(false);
    }
    //Musica da vitoria
    musicVictory() {
        this.sndVictory.resume();
    }

}
movimentBullet = 'down';
var textGameOverHere = ''