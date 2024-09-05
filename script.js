// SETUP
let setupListeners = 0;

// Audio Functions
function playSound(src) {
    const audio = new Audio(src);
    audio.play();
}

// CLASSE CAMERA
class Camera {
    constructor(width, height, gameWidth, gameHeight) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    follow(target) {
        // Imposta la posizione della telecamera per seguire il target
        this.x = Math.max(0, Math.min(target.x + target.width / 2 - this.width / 2, this.gameWidth - this.width));
        this.y = Math.max(0, Math.min(target.y + target.height / 2 - this.height / 2, this.gameHeight - this.height));
    }
}




// GAME MAIN CLASS
class Game {

    // Constructor (id-game & json-config-file)
    constructor(canvasId, configUrl) {

        // GET 2D CONTEXT
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.keys = {};
        this.configUrl = configUrl;

        // GAME SETTINGS
        this.collectedItems = [];
        this.playerBulletImage = new Image();
        this.enemyBulletImage = new Image();
        this.playerShoot = false;
        this.levelTargetList = [];
        this.gameRunning = false;

        // CAMERA
        this.camera = new Camera(window.innerWidth, window.innerHeight, 2000, 3000); // Esempio di area di gioco 4000x3000

        this.gamePaused = false;

        this.init();
    }




    init() {
        // Controller & JSON Configurations
        this.setupEventListeners();
        this.loadConfig();
        this.gameLoop = null; // GAME LOOP
        this.startGame();
    }

    // Player Controller
    setupEventListeners() {
       if(setupListeners==0){

        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Listener touch per dispositivi mobili
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            if (touch.clientX < window.innerWidth / 2) {
                this.keys['ArrowLeft'] = true; // Muovi a sinistra
            } else {
                this.keys['ArrowRight'] = true; // Muovi a destra
            }
        });

        this.canvas.addEventListener('touchend', () => {
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
        });
        

        ++setupListeners;
       }
 
    }

    // Async Load Json Config File
    async loadConfig() {

        // Load Config Url
        const response = await fetch(this.configUrl);
        const config = await response.json();

        // Reset the 2d scene
        this.ctx.reset();
        this.setupCanvas(config);
        this.createScene(config);
        this.update();

        // Sample Player & Enemy Bullets IMG
        this.playerBulletImage.src = './../players-assets/banana.png'; // Sostituisci con il percorso della tua immagine
        this.enemyBulletImage.src = './../players-assets/pallina.png'; // Sostituisci con il percorso della tua immagine
        
    }

    // Canvas Size
    setupCanvas(config) {
        this.canvas.width = 1920;
        this.canvas.height = 1080;
    
      
    }

    // GAME Scene Generator
    createScene(config) {
        
       

        // Backgrounds
        this.backgrounds = config.background.map(bg => new Background(
            bg.x,
            bg.y,
            bg.width,
            bg.height,
            bg.img,
            bg.repeat, 
            bg.size    
        ));

        // Platforms
        this.platforms = config.platforms.map(p => new Platform(
            p.x, 
            p.y, 
            p.width, 
            p.height, 
            p.img,
            p.repeat, 
            p.size 
        ));

        // Player
        this.player = new Player(
            config.player.x, 
            config.player.y, 
            config.player.img, 
            config.player.width, 
            config.player.height,
            config.player.speed, 
            config.player.jump,
            config.player.gravity, 
            config.player.shootInterval,      
            config.player.lives,
            config.player.shoot
        );

        // Enemies
        this.enemies = config.enemies.map(e => new Enemy(
            e.x, 
            e.y, 
            e.width, 
            e.height, 
            e.img, 
            e.speed, 
            e.shootInterval,
            e.enemyDefeatedAudio,
            e.hitImgSrc,
            e.hitDuration, 
            e.dropCollectible
        ));

        // Collectibles
        this.collectibles = config.collectibles.map(c => new Collectible(
            c.x, 
            c.y, 
            c.width, 
            c.height, 
            c.color, 
            c.effect, 
            c.img,
            c.audio
        ));

        // SOUND EFFECT
        this.jumpSound = new Audio(config.sounds.jumpDefaultAudio); // Jump Sound
        this.loseLifeSound = new Audio(config.sounds.loseLifeDefaultAudio); // Lose life sound
        this.gameOverSound = new Audio(config.sounds.gameOverDefaultAudio); // Gameover Sound
        this.lifeImage = new Image();
        this.lifeImage.src = './../nigga-lv/pontos-lv-1.png'; // Life image
    
        // CAMERA
        this.camera.follow(this.player);
    
    }

  
    
    draw() {

        this.camera.follow(this.player);

        // Pulizia del canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Adatta la posizione degli oggetti alla telecamera
        this.backgrounds.forEach(bg => bg.draw(this.ctx, this.camera));
        this.platforms.forEach(platform => platform.draw(this.ctx, this.camera));
        this.enemies.forEach(enemy => enemy.draw(this.ctx, this.camera));
        this.player.draw(this.ctx, this.camera);
        this.collectibles.forEach(collectible => collectible.draw(this.ctx, this.camera));

        // Draw enemies' bullets
        this.enemies.forEach(enemy => {
            enemy.bullets.forEach(bullet => {
                this.ctx.drawImage(this.enemyBulletImage, bullet.x - this.camera.x, bullet.y - this.camera.y, bullet.width, bullet.height);
            });
        });

        // Draw player bullets
        this.player.bullets.forEach(bullet => {
            this.ctx.drawImage(this.playerBulletImage, bullet.x - this.camera.x, bullet.y - this.camera.y, bullet.width, bullet.height);
        });

        // Draw player lives and items
        const lifeWidth = 45;
        const lifeSpacing = 5;
        const startX = 10;
        const startY = 10;

        for (let i = 0; i < this.player.lives; i++) {
            this.ctx.drawImage(this.lifeImage, startX + i * (lifeWidth + lifeSpacing), startY, lifeWidth, lifeWidth);
        }

        this.collectedItems.forEach((item, index) => {
            const offsetX = startX + (lifeWidth + lifeSpacing) * this.player.lives + 10 + (item.width + 10) * index;
            this.ctx.drawImage(item.img, offsetX, 5, item.width, item.height);
        });

        
    }
    

    // GAME UPDATE FUNCTION
    update() {

        if (this.gamePaused) {
            return;  // Esci dalla funzione senza aggiornare il gioco
        }

   
        // PLAYER MOVE
        if (this.keys['ArrowRight']) {
            this.player.x += this.player.speed;
        }
        if (this.keys['ArrowLeft']) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowUp'] && !this.player.jumping) {
            this.player.dy = -this.player.jump;
            this.player.jumping = true;
            this.jumpSound.play();  // Suono del salto
        }
        // PLAYER SHOOT
        if (this.keys[' '] && Date.now() - this.player.lastShot > this.player.shootInterval && this.playerShoot === true) {
            if (this.player.bullets.length <= 4) {
                const bulletSpeed = 7;
                this.player.bullets.push({
                    x: this.player.x + this.player.width / 2 - 5,
                    y: this.player.y + 58,
                    width: 20,
                    height: 20,
                    color: 'blue',
                    img: new Image(),
                    dx: bulletSpeed,
                    dy: 0,
                    isActive: true
                });
                this.player.lastShot = Date.now();
            }
        }
    
        // PLAYER GRAVITY
        this.player.dy += this.player.gravity;
        this.player.y += this.player.dy;
    
        // COLLISION CONTROLLERS
        this.detectCollision();
        this.detectPlayerEnemyCollision();
        this.detectPlayerBulletEnemyCollision();
        this.detectProjectilePlayerCollision();
        this.detectCollectibleCollision();  // Nuova funzione
    
        // ENEMIES BULLETS SYSTEM
        this.updateEnemyBullets();
    
        // PLAYER BULLETS SYSTEM
        this.updatePlayerBullets();
    
        // GRAVITY COLLISION
        if (this.player.y > this.canvas.height - this.player.height) {
            this.player.y = this.canvas.height - this.player.height;
            this.player.dy = 0;
            this.player.jumping = false;
    
            // Perdita di tutte le vite se il giocatore tocca il limite inferiore
            this.player.lives = 0;
            this.loseLifeSound.play();  // Suono della perdita di vita
            this.gameOverSound.play();  // Suono del game over
            this.showPopup('Ma stai schessando?', 'Dinuovo da capo');
        }
    
        // ENEMY BULLET SYSTEM EXTEND
        this.enemies.forEach(enemy => {
            if (enemy.alive && Date.now() - enemy.lastShot > enemy.shootInterval) {
                const bulletSpeed = 5;
                const dx = (this.player.x - enemy.x) / Math.sqrt((this.player.x - enemy.x) ** 2 + (this.player.y - enemy.y) ** 2) * bulletSpeed;
                const dy = (this.player.y - enemy.y) / Math.sqrt((this.player.x - enemy.x) ** 2 + (this.player.y - enemy.y) ** 2) * bulletSpeed;
                enemy.bullets.push({
                    x: enemy.x + enemy.width / 2 - 5,
                    y: enemy.y + enemy.height / 2 - 2.5,
                    width: 20,
                    height: 20,
                    color: '#fff',
                    img: new Image(),
                    dx: dx,
                    dy: dy,
                    isActive: true
                });
                enemy.lastShot = Date.now();
            }
        });
    
        // GAME LOOP
        if (this.gameRunning) {
            this.gameLoop = requestAnimationFrame(this.update.bind(this));
            // Disegna tutto
            this.draw();
        }
    }

    detectCollision() {
        // Assumiamo che il player non stia saltando quando collide lateralmente
        this.player.jumping = true;
    
        // Controllo collisioni con le piattaforme
        for (const platform of this.platforms) {
            
            // Controllo se il player è sopra la piattaforma
            if (this.player.y + this.player.height <= platform.y + platform.height &&
                this.player.y + this.player.height + this.player.dy >= platform.y &&
                this.player.x + this.player.width > platform.x &&
                this.player.x < platform.x + platform.width) {
                
                // Collisione verticale: il player atterra sulla piattaforma
                if (this.player.dy > 0) {
                    this.player.y = platform.y - this.player.height;
                    this.player.dy = 0;
                    this.player.jumping = false;
                }
            }
    
            // Controllo collisioni laterali
            if (this.player.x + this.player.width > platform.x &&
                this.player.x < platform.x + platform.width &&
                this.player.y + this.player.height > platform.y &&
                this.player.y < platform.y + platform.height) {
                
                // Collisione laterale sinistra
                if (this.player.x + this.player.width > platform.x &&
                    this.player.x < platform.x) {
                    this.player.x = platform.x - this.player.width;
                }
                
                // Collisione laterale destra
                if (this.player.x < platform.x + platform.width &&
                    this.player.x + this.player.width > platform.x + platform.width) {
                    this.player.x = platform.x + platform.width;
                }
            }
        }
    }
    
    applyCollectibleEffect(collectible) {


        if (collectible.audio) {
                playSound(collectible.audio);      
            }

            if (collectible.effect) {
                if (collectible.effect.bulletsImg) {
                    this.playerBulletImage.src = collectible.effect.bulletsImg; // Cambia immagine proiettili
                }

                if (collectible.effect.playerImg) {
                    this.player.img.src = collectible.effect.playerImg; // Cambia immagine giocatore
                }
                if(collectible.effect.lives && collectible.effect.lives  > 0){
                    ++this.player.lives;
                }
            }
     
    }

    detectPlayerEnemyCollision() {
        this.enemies.forEach((enemy, index) => {
            if (this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y) {
                
                if (this.player.dy > 0 && this.player.y + this.player.height - this.player.dy <= enemy.y) {
                    // Il giocatore salta sopra il nemico
                    this.player.dy = -this.player.jump / 2;  // Rimbalza verso l'alto
                    enemy.alive = false;  // Uccide il nemico
                    enemy.fadeOutStart = Date.now();
                    enemy.fading = true;

                    if(enemy.enemyDefeatedAudio){
                        console.log(enemy.enemyDefeatedAudio);
                        playSound(enemy.enemyDefeatedAudio);
                    }

                    if (enemy.dropCollectible) {
                        console.log('ucciso e drop:');
                        console.log(enemy.dropCollectible)
                        enemy.dropCollectible.forEach(c => {
                            console.log('Aggiunto collectible:', c);
                            this.collectibles.push(new Collectible(
                                enemy.x, 
                                enemy.y, 
                                c.width, 
                                c.height, 
                                c.color, 
                                c.effect, 
                                c.img.src,
                                c.audio.src
                            ));
                        });
                    }

                    setTimeout(() => {
                        this.enemies.splice(index, 1);
                    }, 0);  // Rimuove il nemico dopo il fading

                } else {
                    this.player.lives -= 1;
                    this.loseLifeSound.play();  // Suono della perdita di vita
                    if (this.player.lives <= 0) {
                        this.gameOverSound.play();  // Suono del game over

                        // RESET GAME HERE
                        //this.resetGame();
                        this.showPopup('Ma stai schessando?', 'Dinuovo da capo') ;
                    } else {
                        this.player.x = 100;
                        this.player.y = 450;
                    }
                }
            }
        });
    }

    detectPlayerBulletEnemyCollision() {
        this.player.bullets.forEach(bullet => {
            this.enemies.forEach((enemy, index) => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
    
                    bullet.isActive = false;
    
                    if (enemy.alive) {
                        enemy.alive = false;
                        enemy.fadeOutStart = Date.now();
                        enemy.fading = true;
    
                        if (enemy.enemyDefeatedAudio) {
                            playSound(enemy.enemyDefeatedAudio);
                        }
    
                        if (enemy.dropCollectible) {
                            console.log('ucciso e drop:');
                            console.log(enemy.dropCollectible)
                            enemy.dropCollectible.forEach(c => {
                                console.log('Aggiunto collectible:', c);
                                this.collectibles.push(new Collectible(
                                    enemy.x, 
                                    enemy.y, 
                                    c.width, 
                                    c.height, 
                                    c.color, 
                                    c.effect, 
                                    c.img.src,
                                    c.audio.src
                                ));
                            });
                        }
    
                        setTimeout(() => {
                            this.enemies.splice(index, 1);
                        }, 1000);
                    }
                }
            });
        });
    }

    detectProjectilePlayerCollision() {
        this.enemies.forEach(enemy => {
            enemy.bullets.forEach(bullet => {
                if (bullet.x < this.player.x + this.player.width &&
                    bullet.x + bullet.width > this.player.x &&
                    bullet.y < this.player.y + this.player.height &&
                    bullet.y + bullet.height > this.player.y) {

                    bullet.isActive = false;
                    this.player.lives -= 1;
                    this.loseLifeSound.play();  // Suono della perdita di vita
                    if (this.player.lives <= 0) {
                        this.gameOverSound.play();  // Suono del game over
                        
                        // RESET GAME HERE
                        //this.resetGame();
                        this.showPopup('Ma stai schessando?', 'Dinuovo da capo') ;
                    }
                }
            });
        });
    }

    detectCollectibleCollision() {
        this.collectibles.forEach((collectible, index) => {
            if (this.player.x < collectible.x + collectible.width &&
                this.player.x + this.player.width > collectible.x &&
                this.player.y < collectible.y + collectible.height &&
                this.player.y + this.player.height > collectible.y) {
    
          
                // Fade & Effect
                if (!this.collectedItems.includes(collectible)) {
                    collectible.startFadeOut();
                    this.applyCollectibleEffect(collectible);
                    
                    this.collectedItems.push(collectible); // Aggiunge il collectible all'array
                    
                    // Rimuove il collectible dall'array dopo il fading
                    setTimeout(() => {
                        this.collectibles.splice(index, 1);
                    }, 1000); // Tempo di fade out
                }

                // Se collide con oggetto che ha levelTargetObject levelTargetList 
    
                // Gestisci la logica di "shoot" del collectible
                if (collectible.effect.shoot === true) {
                    this.playerShoot = true;
                } else if (collectible.effect.shoot === false) {
                    this.playerShoot = false;
                }


            }
        });
    }

    updateEnemyBullets() {
        this.enemies.forEach(enemy => {
            enemy.bullets.forEach(bullet => {
                bullet.x += bullet.dx;
                bullet.y += bullet.dy;
                if (bullet.x < 0 || bullet.x > this.gameWidth || bullet.y < 0 || bullet.y > this.canvas.height) {
                    bullet.isActive = false;
                }
            });

            enemy.bullets = enemy.bullets.filter(bullet => bullet.isActive);
        });
    }

    updatePlayerBullets() {
        this.player.bullets.forEach(bullet => {
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;
            if (bullet.x > this.gameWidth) {
                bullet.isActive = false;
            }
        });

        this.player.bullets = this.player.bullets.filter(bullet => bullet.isActive);
    }

    startGame() {
        if (!this.gameRunning && !this.gamePaused) {
            this.gameRunning = true;
            this.gameLoop = requestAnimationFrame(this.update.bind(this));
        }
    }

    stopGame() {
        this.gamePaused = true;  // Imposta la variabile di pausa
    }

    resetGame() {
        // Interrompe il loop attuale prima del reset
        this.stopGame(); // Assicurati che il gioco sia fermato
    
        // Ripristina lo stato del gioco
        this.player.x = 100;
        this.player.y = 450;

     
        // Riparte il gioco
        this.startGame(); // Avvia nuovamente il ciclo di gioco
    }
 

    // UI Functions
    // start POPUP
    showPopup(title, message) {
        
        this.stopGame();  // Ferma il gioco impostando gamePaused a true
    
        let popup = document.querySelector('reset-game');
        let exit = document.querySelector('reset-game [exit]');
        let retry = document.querySelector('reset-game [retry]');
        
        if (popup.hasAttribute('hidden')) {
            popup.removeAttribute('hidden');
        }
    
        exit.addEventListener('click', () => {
            window.location.reload();
            popup.setAttribute('hidden', '');
        });
    
        retry.addEventListener('click', () => {
            location.reload(false);
            popup.setAttribute('hidden', '');
        });
    }
    // end POPUP


}

class Collectible {
    constructor(x, y, width, height, color, effect, imgSrc, audioSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.effect = effect;
        this.img = new Image();
        this.img.src = imgSrc;

        // Verifica se l'immagine è caricata
        this.img.onload = () => {
            console.log('Immagine collectible caricata:', imgSrc);
        };
        this.audio = audioSrc ? new Audio(audioSrc) : null;
        this.fadeOutStart = 0;
        this.fading = false;
    }

    draw(ctx, camera) {
        if (this.fading) {
            const now = Date.now();
            const elapsed = now - this.fadeOutStart;
            const fadeDuration = 1000;
            const alpha = Math.max(0, 1 - elapsed / fadeDuration);
            ctx.globalAlpha = alpha;
        }
        if (this.img) {
            ctx.drawImage(this.img, this.x - camera.x, this.y - camera.y, this.width, this.height);
        }
        ctx.globalAlpha = 1; // Reset alpha
    }

    startFadeOut() {
        this.fadeOutStart = Date.now();
        this.fading = true;
        if (this.audio) {
            console.log(this.audio.src);
            playSound(this.audio.src);
            /*
            this.audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });*/
        }
    }
}


// Classi di supporto per oggetti di gioco

class Background {
    constructor(x, y, width, height, imgSrc, repeat, size) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = imgSrc;
        this.repeat = repeat; 
        this.size = size || width;
    }

    draw(ctx, camera) {
        if (this.repeat) {
            const imgWidth = this.size;
            const imgHeight = this.size * (this.img.height / this.img.width); // Mantieni il rapporto di aspetto dell'immagine

            // Calcola quante volte l'immagine deve essere ripetuta orizzontalmente e verticalmente
            const xRepeat = Math.ceil(this.width / imgWidth);
            const yRepeat = Math.ceil(this.height / imgHeight);

            for (let i = 0; i < xRepeat; i++) {
                for (let j = 0; j < yRepeat; j++) {
                    ctx.drawImage(
                        this.img,
                        this.x - camera.x + i * imgWidth,
                        this.y - camera.y + j * imgHeight,
                        imgWidth,
                        imgHeight
                    );
                }
            }
        } else {
            ctx.drawImage(this.img, this.x - camera.x, this.y - camera.y, this.width, this.height);
        }
    }
}

class Platform {
    constructor(x, y, width, height, imgSrc, repeat = false, size = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = imgSrc;
        this.repeat = repeat; // Nuovo parametro
        this.size = size; // Nuovo parametro
    }

    draw(ctx, camera) {
        if (this.repeat) {
            // Calcola quante volte l'immagine deve essere ripetuta
            const imgWidth = this.size || this.width; // Usa `size` se definito, altrimenti `width`
            const imgHeight = this.size || this.height; // Usa `size` se definito, altrimenti `height`
            for (let x = this.x - camera.x; x < this.x - camera.x + this.width; x += imgWidth) {
                for (let y = this.y - camera.y; y < this.y - camera.y + this.height; y += imgHeight) {
                    ctx.drawImage(this.img, x, y, imgWidth, imgHeight);
                }
            }
        } else {
            ctx.drawImage(this.img, this.x - camera.x, this.y - camera.y, this.width, this.height);
        }
    }
}

class Player {
    constructor(x, y, imgSrc, width, height, speed, jump, gravity, shootInterval, lives, hitImgSrc, hitDuration) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.jump = jump;
        this.gravity = gravity;
        this.dy = 0;
        this.jumping = false;
        this.lastShot = 0;
        this.shootInterval = shootInterval;
        this.lives = lives;
        this.img = new Image();
        this.img.src = imgSrc;
        this.bullets = [];
        this.hitImg = hitImgSrc ? new Image() : null;
        if (hitImgSrc) this.hitImg.src = hitImgSrc;
        this.hitDuration = hitDuration || 1000;
    }

    draw(ctx, camera) {
        if (this.hitImg && this.hitStart) {
            const now = Date.now();
            const elapsed = now - this.hitStart;
            if (elapsed < this.hitDuration) {
                ctx.drawImage(this.img, this.x - camera.x, this.y - camera.y, this.width, this.height);
            } else {
                this.hitStart = null;
                ctx.drawImage(this.img, this.x - camera.x, this.y - camera.y, this.width, this.height);
            }
        } else {
            ctx.drawImage(this.img, this.x - camera.x, this.y - camera.y, this.width, this.height);
        }

    }

    takeHit() {
        this.hitStart = Date.now();
    }

}


class Enemy {
    constructor(x, y, width, height, imgSrc, speed, shootInterval, enemyDefeatedAudio, hitImgSrc, hitDuration, dropCollectible) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.img = new Image();
        this.img.src = imgSrc;
        this.shootInterval = shootInterval;
        this.lastShot = 0;
        this.bullets = [];
        this.alive = true;
        this.fading = false;
        this.fadeOutStart = 0;
        this.enemyDefeatedAudio = enemyDefeatedAudio;
        this.hitImg = hitImgSrc ? new Image() : null;
        if (hitImgSrc) this.hitImg.src = hitImgSrc;
        this.hitDuration = hitDuration || 1000;
        this.dropCollectible = dropCollectible ? dropCollectible.map(c => new Collectible(c.x, c.y, c.width, c.height, c.color, c.effect, c.img, c.audio)) : [];
    }

    draw(ctx, camera) {
        if (this.fading) {
            const now = Date.now();
            const elapsed = now - this.fadeOutStart;
            const fadeDuration = 1000;
            const alpha = Math.max(0, 1 - elapsed / fadeDuration);
            ctx.globalAlpha = alpha;
        }
        if (this.alive || this.fading) {
            ctx.drawImage(this.img, this.x - camera.x, this.y - camera.y, this.width, this.height);
        }
        ctx.globalAlpha = 1;  // Reset alpha
   
    }

    releaseCollectibles(game) {
        this.dropCollectible.forEach(collectible => {
            game.collectibles.push(collectible);
        });
    }
}



// Avvia il gioco
let game = new Game('gameCanvas', './gpt-lv/1.json');
