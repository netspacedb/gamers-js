<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" 
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <link href="./../css/preview-scene.css" rel="stylesheet">
	<meta name="theme-color" content="">
    <link href="./../css/compiler.css" rel="stylesheet">
    <link href="./../css/main.css" rel="stylesheet">
    <link href="./../css/animations.css" rel="stylesheet">
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;800;900&family=Italianno&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@100;200;300;400;500;600;800;900&family=Italianno&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">

    <title>SOTTO AL PONTOS - MA STAI SCHERZANDO? IL VIDEOGAME</title>
    <meta name="description" content="Sotto Al Pontos, ma stai scherzando? Il Videogioco del meme popolare Sotto al ponte ma stai schessando è quì! Giocalo ora, online e gratis! Scopri la soundbar il merch e molto altro!">

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
    <link rel="stylesheet" href="./styles.css">
</head>
<body>

    <game-scene lv="1">
     
        <canvas id="gameCanvas"></canvas>
    </game-scene>

    <reset-game hidden>
        <h4>Ma stai schessando?</h4>
        <p>Sei stato sconfitto, vuoi riprovare?</p>
        <box>
            <button exit><span>Esci</span></button>
            <button retry><span>Riprova</span></button>
        </box>
    </reset-game>

    <next-game hidden>
        <h4>IO DORMI NELLA STASIONE</h4>
        <p>Andiamo avanti, la ragassa mi sta aspettando.</p>
        <box>
            <button  exit><span>Esci</span></button>
            <!-- Click su [next] Logica local storage salva il livello attuale salvando la path specificata nel json -->
            <button class="start-btn" next><span>Avanti</span></button>
        </box>
    </next-game>

        <!-- APP CONTAINER -->
        <container id="app" component-name="container">
            <?php include_once './gpt-lv/1.php';?>
            
            <!-- General Includes -->
            <?php include_once './../html-assets/inc-menu-controller.php';?>      
            
        </container>

    <script src="./script.js"></script>
            
    <!-- JS SCRIPTS -->
    <script defer type="module" src="./../js/home.js"></script>

</body>
</html>