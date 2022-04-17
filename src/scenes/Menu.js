class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/splash.wav');
        this.load.audio('sfx_explosion', './assets/splash.wav');
        this.load.audio('sfx_rocket', './assets/cannon_shot.wav');
        this.load.audio('music', './assets/the-buccaneers-haul.mp3');
        //Music: The Buccaneer's Haul by Shane Ivers - https://www.silvermansound.com
    }

    create() {
        //menu text configuration
        let menuConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '28px',
            backgroundColor: '#AC3232',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'PIRATE PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#663931';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);


        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
 
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // Easy mode
            game.settings = {
                spaceshipSpeed: 2,
                gameTimer: 60000    
           }
           this.sound.play('sfx_select');
           this.sound.play('music');
           this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // Expert mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 45000    
            }
            this.sound.play('sfx_select');
            this.sound.play('music');
            this.scene.start("playScene");
        }
    }
}