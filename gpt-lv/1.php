<!-- PRESENTAZIONE STORIA -->
<container id="presentation" component-name="container">
            
        <container scene="presentation" id="presentation-header" component-name="container">
            <span id="domain-name" component-name="text">sottoalpontos.com</span>
            <h1 id="title-1" component-name="title">Well done</h1>
            <h2 id="title-2" component-name="title">Andiamo alla stasione</h2>
            <container id="controller-box" component-name="container">
                <button id="exit-btn"  class="start-btn" component-name="button">Esci</button>
                <button id="start-btn"  class="start-btn" component-name="button">Prossimo Livello</button>
            </container>
        </container>
        <!-- Fine Presentazione -->

        <!-- Messaggio -->
        <container scene="message" id="message-container" component-name="container">
            <container id="message-box" component-name="container">
                <container id="image-1" component-name="container"></container>
                <container id="message" component-name="container">
                    <span id="inner-text" component-name="text">Osas: Ohh, ma stai schezzando?? Sotto il pontos?!
                        <span id="text-inner" component-name="text" class="start-btn"> Premi Start</span>
                    </span>
                    <!-- <span id="inner-text-2" component-name="text">Osas: Bravo, ora lascia che ti racconti prima che vado con la mia ragassa. 
                    </span>-->
                </container>
            </container>
        </container>
        <!-- Fine Messaggio -->

        <!-- Scene Storia Iniziale -->
        <container hidden scene="start" timeout="5000" page="0" audio="osas-story-with-background-wt-osas">
            <span big text-animation="fade">
                La Storia di Osas <br>
                Dal pontos al successo...
            </span>
        </container>

        <container hidden scene="start" timeout="7000" page="1" audio="">
            <span medium text-animation="fade">
                Osas, un umile ragazzo determinato <br>
                a vivere una vita di sacrifici,<br> 
                ha finalmente raggiunto il successo.<br>
            </span>
        </container>

        <container hidden scene="start" timeout="1400" page="2" audio="">
            <span big text-animation="typed">
                Ma prima...
            </span>
        </container>

        <container hidden scene="start" timeout="13000" page="3" audio="">
            <span medium text-animation="fade">
                La storia di Osas ha origini in Africa.
                <br><br>
                Per anni in Italia, ha vissuto sotto un pontos, sognando di trasferirsi in un posto migliore:<br> 
                la stazione, un luogo perfetto per passare del tempo con la sua ragazza.     
            </span>
        </container>

        <container hidden scene="start" timeout="4000" page="4" audio="">
            <span big text-animation="fade">
               <span>Ha dormito sotto il pontos per anni...</span><br>
               <span text-animation="fade">MA ORA BASTA!</span>
            </span>
        </container>
        
        <container hidden scene="start" timeout="500" page="5" audio="">
            <span superbig text-animation="impact">
                MA STAI SCHERZANDO?!
            </span>
            <container></container>
        </container>
        
        <container hidden scene="start" timeout="3000" page="6" audio="">
            <span medium text-animation="fade">
                Ed è così che, per raccontare meglio<br>
                la sua incredibile storia, è nato:
            </span>
        </container>
        
        <container hidden scene="start" timeout="5000" page="7" audio="">
            <span superbig  text-animation="fade">
                <span>SOTTO AL PONTOS:</span><br>
                <span text-animation="colorfull">IL VIDEOGAME</span><br>
                <a href="httsp://www.sottoalpontos.com">www.sottoalpontos.com</a>
            </span>
        </container>

    </container>