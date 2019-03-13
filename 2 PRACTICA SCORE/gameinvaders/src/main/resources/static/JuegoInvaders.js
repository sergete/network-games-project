var game = new Phaser.Game(800, 600, Phaser.AUTO, 'SpaceInv', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bullet', 'phaser-examples-master/examples/assets/games/invaders/bullet.png');
    //game.load.image('enemyBullet', 'phaser-examples-master/examples/assets/games/invaders/newBulletEnemy.png');
    game.load.image('enemyBullet', 'phaser-examples-master/examples/assets/games/invaders/newBulletEnemy.png');
    game.load.spritesheet('invader', 'phaser-examples-master/examples/assets/games/invaders/invader32x32x4.png', 32, 32);
    game.load.spritesheet('enemy', 'phaser-examples-master/examples/assets/games/invaders/NuevosContrarios.png', 793.75, 709);
    game.load.image('ship', 'phaser-examples-master/examples/assets/games/invaders/player.png');
    game.load.image('othership', 'phaser-examples-master/examples/assets/games/invaders/player2.png');
    game.load.spritesheet('kaboom', 'phaser-examples-master/examples/assets/games/invaders/explode.png', 128, 128);
    game.load.image('starfield', 'phaser-examples-master/examples/assets/games/invaders/starfield.png');
    game.load.image('background', 'phaser-examples-master/examples/assets/games/starstruck/background2.png');
}

//Definimos los jugadores del juego (2)
var player;
var player2;
//Cursores para ambos jugadores
var cursors;
var cursors2 = [];
//Boton de disparo de los jugadores
var fireButton;
var fireButton2;
//Vidas de los personajes
var lives;
var lives2;
//Enemigos
var aliens;
var newenemies;
//Balas de cada personaje
var bullets;
var bullets2;

var bulletTime = 0;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var enemyBullets;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Balas del jugador 1
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    //  Balas del jugador 2
    bullets2 = game.add.group();
    bullets2.enableBody = true;
    bullets2.physicsBodyType = Phaser.Physics.ARCADE;
    bullets2.createMultiple(30, 'bullet');
    bullets2.setAll('anchor.x', 0.5);
    bullets2.setAll('anchor.y', 1);
    bullets2.setAll('outOfBoundsKill', true);
    bullets2.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);


    //  The player1!
    player = game.add.sprite(400, 550, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    // The player2!
    player2 = game.add.sprite(400,50, 'othership');
    player2.anchor.setTo(0.5,0.5);
    game.physics.enable(player2, Phaser.Physics.ARCADE);
    player2.angle = 180;

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
    
    newenemies = game.add.group();
    newenemies.enableBody = true;
    newenemies.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens2();
    createAliens();
    
    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  Habilitamos los controladores para definir los controles de cada nave
    cursors = game.input.keyboard.createCursorKeys();
    cursors2 [0] = game.input.keyboard.addKey(Phaser.Keyboard.A);
    cursors2 [1] = game.input.keyboard.addKey(Phaser.Keyboard.D);
    //Asignamos al Jugador1 el botón de disparo 0 y al jugador2 el botón de disparo SPACEBAR
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);
    fireButton2 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
}

function createAliens () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 48, y * 32, 'invader');
            if(y<2){
                alien.angle = 180;
                alien.x = newenemies.x + x*48;
                alien.y = newenemies.y - (32 + y * 40);
            }
            else {
                alien.x = newenemies.x + x*48;
                alien.y = newenemies.y + (32 + y * 48);
            }
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = true;
            //aliens.x = 20;
            //aliens.y = 100;
        }
    }

    //aliens.x = 20;
    //aliens.y = 250;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 350 }, 2500, Phaser.Easing.Quadratic.Out, true, 0, 100, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
}

function createAliens2 () {
    
        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                var alien = newenemies.create(x * 48, y * 32, 'enemy');
                alien.scale.x = 0.05;
                alien.scale.y = 0.05;
                alien.anchor.setTo(0.5, 0.5);
                if(y<2){
                    alien.angle = 180;
                    
                }
                //Pasamos las animaciones 1 y 2 de la carita
                //Falta programar que cuando tenga una colisión cambie a la siguiente animación
                alien.animations.add('flying', [ 0, 1], 5, true);
                alien.play('flying');
                alien.body.moves = false;
            }
        }
    
        newenemies.x = 20;
        newenemies.y = 250;
    
        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(newenemies).to( { x: 350 }, 4000, Phaser.Easing.Linear.None, true, 200, -500, true);
    
        //  When the tween loops it calls descend
        tween.onLoop.add(descend, this);
    }

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += 10;

}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;

    if (player.alive)
    {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;
        }

        //  Firing?
        if (fireButton.isDown)
        {
            player = fireBullet(player, 1);
        }

        if (game.time.now > firingTimer)
        {
            enemyFires();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        //Para detectar las colisiones del jugador 1 con los enemigos centrales (caras amarillas)
        game.physics.arcade.overlap(bullets, newenemies, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    }

    if (player2.alive)
    {
        //  Reset the player, then check for movement keys
        player2.body.velocity.setTo(0, 0);

        if (cursors2[0].isDown)
        {
            player2.body.velocity.x = -200;
        }
        else if (cursors2[1].isDown)
        {
            player2.body.velocity.x = 200;
        }

        //  Firing?
        if (fireButton2.isDown)
        {
            player2 = fireBullet(player2, -1);
        }

        if (game.time.now > firingTimer)
        {
            enemyFires();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets2, aliens, collisionHandler, null, this);
        //Para detectar las colisiones del jugador 2 con los enemigos centrales (caras amarillas)
        game.physics.arcade.overlap(bullets2, newenemies, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player2, enemyHitsPlayer, null, this);
    }

}

function render() {
    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 2000;
    }

}

function fireBullet (Jugador, direccion) {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        if(direccion == 1){
            bullet = bullets.getFirstExists(false);
        }
        else
            bullet = bullets2.getFirstExists(false);

        if (bullet && direccion == 1)
        {
            //  And fire it
            bullet.reset(Jugador.x, Jugador.y + 8);
            bullet.body.velocity.y = -400 * direccion;
            bulletTime = game.time.now + 200;
        }
        else if (bullet && direccion == -1)
        {
            //  And fire it
            bullet.angle = 180;
            bullet.reset(Jugador.x, Jugador.y +30);
            bullet.body.velocity.y = -400 * direccion;
            bulletTime = game.time.now + 200;
        }
    }

    return Jugador;
}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}