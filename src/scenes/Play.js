class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/cannonball.png');
        this.load.image('spaceship', './assets/pirateship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.audio('music', './assets/the-buccaneers-haul.mp3');
        
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/pirateship_animation.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 21});
    }

    create() {
        //Timer decay
        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                if (this.timer_tracker > 0) {
                    this.timer_tracker -= 1
                    this.timerRight.text = this.timer_tracker
                }
            },
            loop: true
        })



        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x663931).setOrigin(0, 0);
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add spaceships (x4)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);


        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 21, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '28px',
            backgroundColor: '#000',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 40
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // initialize word
        this.word = " SURRENDER SCALAWAGS!";

        // display word
        let wordConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '28px',
            backgroundColor: '#AC3232',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 370
        }
        this.wordCenter = this.add.text(borderUISize + borderPadding*10, borderUISize + borderPadding*2, this.word, wordConfig);
        this.wordCenter.alpha = 0;

         // initialize timer tracker
         this.timer_tracker = game.settings.gameTimer/1000;
         this.reset_timer = this.timer_tracker

         // display word
         let timerConfig = {
             fontFamily: 'Times New Roman',
             fontSize: '28px',
             backgroundColor: '#000',
             color: '#FFFFFF',
             align: 'left',
             padding: {
                 top: 5,
                 bottom: 5,
             },
             fixedWidth: 40
         }
         this.timerRight = this.add.text(borderUISize + borderPadding*49, borderUISize + borderPadding*2, this.timer_tracker, timerConfig);
        

        
        
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('music');
            this.timer_tracker = this.reset_timer;
            this.timerRight.text = this.timer_tracker;
            this.scene.restart();
            
        }
        
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
        }
        if(this.gameOver) {
            this.game.sound.stopAll();
        }
        if(Phaser.Input.Keyboard.JustUp(keyF)) {
            this.wordCenter.alpha = 1;
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.wordCenter.alpha = 0;
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.timer_tracker += 1
        this.clock.delay += 1000
        this.timerRight.text = this.timer_tracker
        this.sound.play('sfx_explosion');
        }
}