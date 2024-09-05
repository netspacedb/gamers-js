
<body>
    <header>
        <h1>GAMERS JS - Game generator With Json</h1>
    </header>
    <div class="container">
        <nav class="index">
            <h2>Indice</h2>
            <a href="#introduzione">Introduzione</a>
            <a href="#struttura-del-codice">Struttura del Codice</a>
            <a href="#configurazione-json">Configurazione JSON</a>
            <a href="#utilizzo-delle-funzioni-principali">Utilizzo delle Funzioni Principali</a>
            <a href="#esempio-di-configurazione-json">Esempio di Configurazione JSON</a>
        </nav>
        <section id="introduzione">
            <h2>Introduzione</h2>
            <p>Questa documentazione fornisce una guida su come utilizzare la classe <code>Game</code> in JavaScript, combinata con un file di configurazione JSON per generare dinamicamente una scena di gioco su un canvas HTML5.</p>
        </section>
        <section id="struttura-del-codice">
            <h2>Struttura del Codice</h2>
            <ul>
                <li><strong>Funzioni Audio</strong>:
                    <ul>
                        <li><code>playSound(src)</code>: Riproduce un suono dato il percorso della risorsa.</li>
                    </ul>
                </li>
                <li><strong>Classe <code>Camera</code></strong>:
                    <ul>
                        <li>Permette di seguire un target all'interno di una scena di gioco.</li>
                    </ul>
                </li>
                <li><strong>Classe <code>Game</code></strong>:
                    <ul>
                        <li>Gestisce il ciclo di vita del gioco, la creazione della scena, il caricamento delle risorse e l'interazione dell'utente.</li>
                    </ul>
                </li>
            </ul>
        </section>
        <section id="configurazione-json">
            <h2>Configurazione JSON</h2>
            <p>Il file di configurazione JSON è fondamentale per la creazione della scena di gioco. Ogni elemento del gioco è definito nel JSON, e il codice lo carica per generare la scena.</p>
            <ul>
                <li><strong>Background</strong>: Definisce gli sfondi della scena.</li>
                <li><strong>Platforms</strong>: Definisce le piattaforme su cui il giocatore può camminare.</li>
                <li><strong>Player</strong>: Definisce il personaggio controllato dal giocatore.</li>
                <li><strong>Enemies</strong>: Definisce i nemici nel gioco.</li>
                <li><strong>Collectibles</strong>: Definisce gli oggetti che il giocatore può raccogliere.</li>
            </ul>
        </section>
        <section id="utilizzo-delle-funzioni-principali">
            <h2>Utilizzo delle Funzioni Principali</h2>
            <ul>
                <li><strong>Costruttore <code>Game</code></strong>:
                    <ul>
                        <li><code>new Game(canvasId, configUrl)</code>: Inizializza il gioco, richiede un ID di canvas e un URL al file di configurazione JSON.</li>
                    </ul>
                </li>
                <li><strong>Metodo <code>init()</code></strong>:
                    <ul>
                        <li>Inizializza i controlli e carica la configurazione JSON.</li>
                    </ul>
                </li>
                <li><strong>Metodo <code>update()</code></strong>:
                    <ul>
                        <li>Esegue il ciclo di aggiornamento del gioco, gestendo i movimenti, le collisioni e la logica generale.</li>
                    </ul>
                </li>
                <li><strong>Metodo <code>draw()</code></strong>:
                    <ul>
                        <li>Disegna gli elementi della scena in base alla posizione della camera.</li>
                    </ul>
                </li>
                <li><strong>Metodo <code>resetGame()</code></strong>:
                    <ul>
                        <li>Ripristina lo stato del gioco a quello iniziale.</li>
                    </ul>
                </li>
            </ul>
        </section>
        <section id="esempio-di-configurazione-json">
            <h2>Esempio di Configurazione JSON</h2>
            <pre><code>{
  "background": [
    {
      "x": 0,
      "y": 0,
      "width": 4000,
      "height": 1080,
      "img": "path/to/background.png",
      "repeat": true,
      "size": 1000
    }
  ],
  "platforms": [
    {
      "x": 100,
      "y": 900,
      "width": 200,
      "height": 20,
      "img": "path/to/platform.png",
      "repeat": false
    }
  ],
  "player": {
    "x": 100,
    "y": 450,
    "width": 50,
    "height": 50,
    "img": "path/to/player.png",
    "speed": 5,
    "jump": 15,
    "gravity": 1,
    "shootInterval": 500,
    "lives": 3,
    "shoot": true
  },
  "enemies": [
    {
      "x": 500,
      "y": 850,
      "width": 50,
      "height": 50,
      "img": "path/to/enemy.png",
      "speed": 2,
      "shootInterval": 2000,
      "enemyDefeatedAudio": "path/to/enemy-defeated.mp3",
      "hitImgSrc": "path/to/enemy-hit.png",
      "hitDuration": 500,
      "dropCollectible": [
        {
          "width": 30,
          "height": 30,
          "img": "path/to/collectible.png",
          "effect": {
            "lives": 1
          },
          "audio": "path/to/collectible.mp3"
        }
      ]
    }
  ],
  "collectibles": [
    {
      "x": 300,
      "y": 800,
      "width": 30,
      "height": 30,
      "color": "red",
      "effect": {
        "lives": 1,
        "bulletsImg": "path/to/new-bullets.png"
      },
      "img": "path/to/collectible.png",
      "audio": "path/to/collectible.mp3"
    }
  ],
  "sounds": {
    "jumpDefaultAudio": "path/to/jump.mp3",
    "loseLifeDefaultAudio": "path/to/lose-life.mp3",
    "gameOverDefaultAudio": "path/to/game-over.mp3"
  }
}</code></pre>
        </section>
    </div>
</body>
</html>
