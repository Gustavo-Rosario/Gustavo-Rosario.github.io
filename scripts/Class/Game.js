import { eventBus } from "../utils/eventBus.js";
import { getCanvasContext } from "../utils/getCanvasContext.js";
import Memory from "../utils/memory.js";


class Game {

    SCREENS = [
        'World',
        'Fase01',
        'Room02',
        'Room03',
        'Room04',
        'Room05',
        'Room06',
        'Room07',
        'Room08',
        'Room09',
        'Room10',
        'Room11',
        'Room12',
        'Room13',
        'Room14',
        'Room15',
        'Room16',
        'Room17',
        'FinalRoom'
    ];
    SCREEN_MODULES = {};

    STATE_LIST = ['MENU', 'PLAYING', 'PAUSED', 'GAMEOVER', 'LOADING', 'CREDITS'];
    GAME_TITLE = "Brenda";
    GAME_SUBTITLE = "The Seven Chakras";
    GAME_VERSION = "v1.0.0";
    TILE_SIZE = 65;
    SPRITE_SHEET_SIZE = 32 * 5;
    DEBUG = false;
    MAX_GRAVITY = 25;

    TILES_BG = [0, 30,31,32,33, 46,61,62,63,64,65,66, 67,81,82,83,84,85,86,
        108,109,110,111,112,114,115,116,117,118,119, 124,125,126,127, 138, 139, 140, 141
    ];

    NOT_SOLID_TILES = [0, 30,31,32,33, 46,61,62,63,64,65,66, 67,81,82,83,84,85,86,
        108,109,110,111,112,113,114,115,116,117,118,119,121,122, 124,125,126,127, 138, 139, 140, 141, 142, 143, 144, 145, 146, 148, 147, 149
    ];

    SCREEN_NAME = "World";
    SCREEN_MODULE = null;
    ACTUAL_SCREEN = null;
    DIAOLOG_CALLBACK = null;

    canvas = null;
    ctx = null;

    mapWidth = 0;
    mapHeight = 0;

    last = performance.now();
    load = 0;

    selectedOption = 0;
    options = ["Start Game"];

    // CAIXA DE DIALOGO
    dialogBox = {
        ativo: false,
        title: {
            color: null,
            text: "",
        },
        body: {
            color: null,
            text: "",
        },
        alpha: 0,      // Para animar a entrada (fade-in)
        animando: false
    };

    jumpPressedTime = 0;
    maxJumpTime = 15; // frames (~0.25s)
    isJumping = false;

    deParaTeclado = {
        "ArrowUp": "ArrowUp",
        "ArrowDown": "ArrowDown",
        "ArrowLeft": "ArrowLeft",
        "ArrowRight": "ArrowRight",
        "w": "ArrowUp",
        "s": "ArrowDown",
        "a": "ArrowLeft",
        "d": "ArrowRight",
        " ": "Jump", // Espaço para pular
        "Enter": "OK", // Enter para confirmar
        "Shift": "Run", // Shift para correr,
        "Esc": "Start"
    };

    keys = {};

    constructor({player} = {}) {
        this.GRAVITY = 0.5;
        // this.ctx = ctx;
        // this.canvas = canvas;
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");

        this.state = 'MENU';

        this.player = player;

        window.addEventListener('resize', this.resizeCanvas);
        this.resizeCanvas();

        // ================== INIT =======================================
        this.init();

    }

    async init(){

        // Carrega a tela inicial
        // this.reloadScreen(this.SCREEN_NAME, {noLoad: true});

        // Revisa mudanças de tela
        eventBus.addEventListener('changeScreen', (e) => {        
            const { newScreen, options } = e.detail;

            
            this.player.tempObjects = [];
            
            this.SCREEN_NAME = newScreen;
            this.reloadScreen(newScreen, options);
        });

        // Altera o state do jogo
        eventBus.addEventListener('changeState', (e) => {
            const { newState } = e.detail;
            this.state = newState;
        });

        this.jumpSong = document.getElementById("jump");


        this.general_tiles = new Image();
        this.general_tiles.src = '../assets/imgs/general.png';

        this.tileset = new Image();
        this.tileset.src = '../assets/imgs/tiles.png';

        this.pauseImg = new Image();
        this.pauseImg.src = '../assets/imgs/pause.png';

        this.titleImg = new Image();
        this.titleImg.src = '../assets/imgs/title.png';

        this.itemsImg = new Image();
        this.itemsImg.src = '../assets/imgs/items.png';

        // this.titleBgImg = new Image();
        // this.titleBgImg.src = '../assets/imgs/title-background.png';
        // this.bgTitle = {
        //     frame: 0,             // quadro atual
        //     frameMax: 30,          // total de quadros
        //     frameTime: 5,        // tempo por quadro (em frames de jogo)
        //     frameCounter: 0       // contador de tempo
        // }

        // Camadas do fundo
        const l1 = new Image();
        l1.src = '../assets/imgs/bg-layer-1.png';

        const l2 = new Image();
        l2.src = '../assets/imgs/bg-layer-2.png';

        const l3 = new Image();
        l3.src = '../assets/imgs/bg-layer-3.png';

        const l4 = new Image();
        l4.src = '../assets/imgs/bg-layer-4.png';

        const l5 = new Image();
        l5.src = '../assets/imgs/bg-layer-5.png';

        this.bgParallaxLayers = [
            {
                img: l1,
                speed: 1,
                position: {x: 0, y: 0},
                sizeFinal: {w: this.canvas.width, h: this.canvas.height},
                cutSize: {w: 160, h: 90},
                offsets: 0
            },
            {
                img: l2,
                speed: 2,
                position: {x: 0, y: 0},
                sizeFinal: {w: this.canvas.width, h: this.canvas.height},
                cutSize: {w: 160, h: 90},
                offsets: 0
            },
            {
                img: l3,
                speed: 5,
                position: {x: 0, y: 0},
                sizeFinal: {w: this.canvas.width, h: this.canvas.height},
                cutSize: {w: 160, h: 90},
                offsets: 0
            },
            {
                img: l4,
                speed: 7,
                position: {x: 0, y: 0},
                sizeFinal: {w: this.canvas.width, h: this.canvas.height},
                cutSize: {w: 160, h: 90},
                offsets: 0
            },
            {
                img: l5,
                speed: 9,
                position: {x: 0, y: 0},
                sizeFinal: {w: this.canvas.width, h: this.canvas.height},
                cutSize: {w: 160, h: 90},
                offsets: 0
            }
        ]


        const fontePersonalizada = new FontFace("PixelFont", "url('../fonts/PixelifySans-VariableFont_wght.ttf')");

        fontePersonalizada.load().then(function (font) {
            document.fonts.add(font);
        });

        eventBus.addEventListener('showDialog', (e) => {
            const { color, text, fullText, n, callback } = e.detail;
            this.mostrarDialogo({ color, text }, fullText, n, callback);
        });

        // =========================== ITEMS ===========================
        document.addEventListener("keydown", e => {
            const saida = this.deParaTeclado[e.key];
            // console.log("KEY: ", e.key, "\nSaida: ", saida);
            this.keys[saida] = true;

            if (this.state == "MENU") {
                if (e.key === "ArrowUp") this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
                if (e.key === "ArrowDown") this.selectedOption = (this.selectedOption + 1) % this.options.length;
                if (e.key === "Enter") this.handleMenuSelection();
            }
        });
        document.addEventListener("keyup", e => this.keys[this.deParaTeclado[e.key]] = false);


        window.addEventListener("gamepadconnected", e => this.startGamepadPolling());

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.state === "PLAYING") {
                this.state = "MENU";
            }
        });


        // CARREGA PATTERNS
        this.loadPatterns();

        this.topPadding = 0;

        this.grayscalePerc = 0;
    }


    async loadScreensToMemory(){
        this.IS_LOADING = true;
        try{
            for(let screen of this.SCREENS){
                this.SCREEN_MODULES[screen] = await import(`../screens/${screen}/index.js`);
                
            }
        }catch(err){
            console.log(err);
        }finally{
            this.IS_LOADING = false;
        }
        
    }

    loadPatterns(){

        //Pattern
        const caveImg = new Image();
        caveImg.src = "../assets/imgs/cave-pattern.png"
        this.cavePattern =  null;

        caveImg.onload = () => {
            // 🔹 Cria um canvas temporário para redimensionar a imagem
            const tempCanvas = document.createElement("canvas");
            const scale = 3; // aumente o fator conforme quiser
            tempCanvas.width = caveImg.width * scale;
            tempCanvas.height = caveImg.height * scale;

            const tctx = tempCanvas.getContext("2d");
            tctx.imageSmoothingEnabled = false;
            tctx.drawImage(caveImg, 0, 0, tempCanvas.width, tempCanvas.height);

            // 🔹 Cria o pattern a partir da imagem ampliada
            this.cavePattern = this.ctx.createPattern(tempCanvas, "repeat");
        }


        //MX - Pattern
        const mxImg = new Image();
        mxImg.src = "../assets/imgs/mx-pattern.png"
        this.mxPattern =  null;

        mxImg.onload = () => {
            // 🔹 Cria um canvas temporário para redimensionar a imagem
            const tempCanvas = document.createElement("canvas");
            const scale = 3; // aumente o fator conforme quiser
            tempCanvas.width = mxImg.width * scale;
            tempCanvas.height = mxImg.height * scale;

            const tctx = tempCanvas.getContext("2d");
            tctx.imageSmoothingEnabled = false;
            tctx.drawImage(mxImg, 0,0, tempCanvas.width, tempCanvas.height);
            
            // Escurecendo
            tctx.fillStyle = "rgba(0,0,0,.3)";
            tctx.fillRect(0,0, tempCanvas.width, tempCanvas.height);

            // 🔹 Cria o pattern a partir da imagem ampliada
            this.mxPattern = this.ctx.createPattern(tempCanvas, "repeat");
        }
    }

    handleMenuSelection() {
        // Audio de seleção
        const selectSound = document.getElementById("menuConfirmSelect");
        selectSound.volume = 0.5;
        selectSound.play();

        // setTimeout(() => {
        //     selectSound.pause();
        //     selectSound.currentTime = 0;
        // }, 300);

        if (this.options[this.selectedOption] === "Start Game") {
            this.state = "PLAYING";
        } else if (this.options[this.selectedOption] === "Load Game") {
            this.mostrarDialogo("Em implementação", "Aguarde...");
            // this.state = "LOADING";
            // setTimeout(() => {
            //     this.state = "PLAYING"; // simula carregamento
            // }, 1000);
        }
    }

    async startGame(){
        // =========================== PLAYER ===========================
        
        // Carrega todas as telas
        await this.loadScreensToMemory();

        console.log("Carregando jogador...");  

        this.reloadScreen(this.SCREEN_NAME, {noLoad: true});

        // =========================== MAPA ===========================
        this.mapWidth = this.ACTUAL_SCREEN.map[0].length;
        this.mapHeight = this.ACTUAL_SCREEN.map.length;

        this.gameLoop();
    }


    setState(state){
        this.state = state;
        Memory.set('gameState', state);

    }

    getState(){

        
        return this.state;
    }



    /**
     * Loop de jogo
     * Atualiza os sprites e renderiza
     * 
    */
    gameLoop(){
        this.update();
        // this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update(){
        // CHECAR STATE DO JOGO
        if(this.state == 'MENU') {
            this.drawMenu();
        }
        else if(this.state == 'PLAYING') {
            this.drawGame();
        }
        else if(this.state == 'PAUSED'){
            this.drawPause();
        }
        else if(this.state == "LOAD") {
            this.ctx.fillStyle = "#222";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "#fff";
            this.ctx.font = "32px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Carregando...", this.canvas.width / 2, this.canvas.height / 2);
        }else if(this.state == 'CREDITS'){
            this.updateCredits();
        }

        
    }

    updateCredits(){

        // Toca musica de final
        const endingSong = document.getElementById("ending");
        if(endingSong.paused){
            endingSong.volume = 0.6; // Ajusta o volume
            endingSong.play();
        }

        if(this.topPadding > -3300){


            this.topPadding -= 0.8;

            if(this.topPadding < -300 && this.grayscalePerc < 100){
                this.grayscalePerc += 0.5;
            }

            if(this.topPadding < -3050 && endingSong.volume > 0){
                const newVol = endingSong.volume - 0.002;
                endingSong.volume = newVol < 0 ? 0 : newVol;
            }
        } 
        else{
            if(!this.TOCOU_FINAL){
                this.TOCOU_FINAL = true;

                const bgm = document.getElementById("bjXau");
                bgm.volume = 1; // Ajusta o volume
                bgm.play();
            }
        }

        this.drawCredits();

    }

    // Função para desenhar os créditos
    drawCredits() {
        // const ctx = this.ctx;
        // const canvas = this.canvas;

        const canvas = this.canvas;
        const ctx = this.ctx;

        ctx.imageSmoothingEnabled = false;

        // Definindo as propriedades do canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

        ctx.fillStyle = "#1d1d1dff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white'; // Define a cor do texto padrão (branco)
        ctx.font = 'bold 30px PixelFont'; // Define a fonte do texto

        // Lista de créditos
        const creditos = [
            { text: "Criado por", color: 'yellow', topPadding: 200 },
            { text: "GMaster", color: 'white', topPadding: 100 },
            { text: "Diretor", color: 'yellow', topPadding: 135  },
            { text: "GMaster", color: 'white', topPadding: 100 },
            { text: "Coprodutor", color: 'yellow', topPadding: 120.5  },
            { text: "GMaster", color: 'white', topPadding: 100 },
            { text: "Artista", color: 'yellow', topPadding: 115  },
            { text: "GMaster", color: 'white', topPadding: 100 },
            { text: "Efeitos especiais", color: 'yellow', topPadding: 111  },
            { text: "GMaster", color: 'white', topPadding: 100 },
            { text: "Desenvolvimento", color: 'yellow', topPadding: 109  },
            { text: "GMaster", color: 'white', topPadding: 100 },
            { text: "Localização", color: 'yellow', topPadding: 108  },
            { text: "GMaster", color: 'white', topPadding: 100 },
            { text: "Agradecimentos especiais", color: 'yellow', topPadding: 107  },
            { text: "Brenda Cenzi", color: 'white', topPadding: 100  },
            { text: "FIM", color: 'yellow', topPadding: 134, fontSize: 80 }
        ];

        // Centralizar o texto na tela
        const centerX = canvas.width / 2;
        let startY = this.topPadding; // Começo da posição Y

        ctx.filter = `grayscale(${this.grayscalePerc}%)`;
        ctx.drawImage(
            this.titleImg,
            canvas.width/2 - canvas.width * 0.2, canvas.height * 0.2,
            canvas.width * 0.4, canvas.width * 0.24 
        );
        ctx.filter = "none"; // importante resetar!

        // Desenhando o texto
        creditos.forEach((credito,i) => {
            ctx.fillStyle = credito.color; // Definir a cor do texto
            const textWidth = ctx.measureText(credito.text).width * 1.7; // Medir a largura do texto

            ctx.font = `${credito.color == 'white' ? 'normal' : "bold"} ${credito.fontSize || 30}px PixelFont`;

            this.drawText(credito.text, centerX - textWidth / 2, 700 +  startY + ((40 + credito.topPadding) * (i+1)), {
                fontSize: credito.fontSize,
                fontColor: credito.color
            })
            // ctx.fillText(credito.text, centerX - textWidth / 2, startY + ((40 + credito.topPadding) * (i+1))); // Centralizar e desenhar o texto
            // startY += this.topPadding + 240; // Espaço entre os créditos
        });
    }

    drawMenu() {

        // Musica de fundo
        const menuTheme = document.getElementById("menuTheme");
        if (menuTheme.paused) {
            menuTheme.volume = 0.3;
            menuTheme.play();
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.imageSmoothingEnabled = false;

        this.ctx.fillStyle = "#37b8e3ff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // ========== DESENHA FUNDO ==========
        this.drawParallax(this.bgParallaxLayers);

        this.ctx.save();

        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.ctx.font = "bold 32px PixelFont";

        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.fillStyle = "#37b8e3ff";
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // ========== DESENHA TITULO E OPÇÕES ==========
        const tituloWidth = this.canvas.width * 0.55;
        this.ctx.drawImage(
            this.titleImg,
            this.canvas.width / 2 - (tituloWidth * 0.55), tituloWidth * 0.05,
            tituloWidth, tituloWidth /2
        );

        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 3.5;
        this.ctx.shadowOffsetY = 3.5;
        this.ctx.font = "bold 32px PixelFont";
        
        this.options.forEach((opt, i) => {
            this.ctx.fillStyle = i === this.selectedOption ? "rgba(220, 251, 45, 1)" : "#e1dfdfff";
            this.ctx.fillText(opt, this.canvas.width / 2 - (tituloWidth * 0.18), (tituloWidth * 0.65) + i * 60);
        });


        // VERSION
        this.ctx.font = "16px PixelFont";
        this.ctx.fillStyle = "#ffffffaa";
        this.ctx.textAlign = "right";
        this.ctx.fillText(this.GAME_VERSION, this.canvas.width - 20, this.canvas.height - 20);

        // Creator credit
        this.ctx.font = "16px PixelFont";
        this.ctx.fillStyle = "#ffffffaa";
        this.ctx.textAlign = "left";
        this.ctx.fillText("Created by GMaster", 20, this.canvas.height - 20);

        this.ctx.restore();
    }

    drawParallax(layers) {
        layers.forEach((layer, i) => {
            layer.offsets -= layer.speed;
            const w = layer.sizeFinal.w;
            if (layer.offsets <= -w) layer.offsets = 0;

            this.ctx.drawImage(
                layer.img,
                layer.offsets, 0,
                layer.sizeFinal.w, layer.sizeFinal.h
            );
            this.ctx.drawImage(
                layer.img,
                layer.offsets + w, 0,
                layer.sizeFinal.w, layer.sizeFinal.h);
        });
    }


    drawGame(){
        // DIALOGO
        if (this.dialogBox.ativo) this.desenharDialogo();
        // Verifica gameOver
        if (this.player.hp.current < 1) {
            // Game Over
            this.gameOver();
        }

        // Desliga som do menu
        const menuTheme = document.getElementById("menuTheme");
        if (!menuTheme.paused) {
            menuTheme.pause();
            menuTheme.currentTime = 0;
        }

        if (this.dialogBox.ativo) {
            if (this.keys["OK"]) this.fecharDialogo(); // Fecha o diálogo se pressionar OK
            return; // pausa o jogo
        }
        if(this.player.getItem){
            return; // pausa o jogo
        }


        if(this.player.isKB){
            if(this.player.vx > 0) this.player.vx = -5;
            else if(this.player.vx < 0) this.player.vx = 5;

            if(this.player.vy > 0) this.player.vy = -5;
            else if(this.player.vy < 0) this.player.vy = 5;

            this.player.isKB = false;
        }else{

            // Controles horizontais
            if (this.keys["ArrowLeft"]) {
                this.player.direction = "L";
                this.player.vx = this.keys["Run"] && this.player.haveSpeedBooster && !this.player.isBall ? -(this.player.walkForce * 3.5) : -this.player.walkForce;
                this.player.isWalking = true;
            } else if (this.keys["ArrowRight"]) {
                this.player.direction = "R";
                this.player.vx = this.keys["Run"] && this.player.haveSpeedBooster && !this.player.isBall ? this.player.walkForce * 3.5 : this.player.walkForce;
                this.player.isWalking = true;
            } else {
                this.player.vx = 0;
                this.player.isWalking = false;
            }
    
            this.player.isRunning = this.keys["Run"] && this.player.haveSpeedBooster && !this.player.isBall;
    
            if (this.player.haveBall) {
                if (this.keys["ArrowDown"]) this.player.isBall = true;
                if (this.keys["ArrowUp"]) this.player.isBall = false;
            }
    
            // JUMP
            if (this.keys["Jump"] && (!this.player.isBall || (this.player.isBall && this.player.haveSpringBall))) {
                if (this.player.grounded) {
                    this.jumpSong.currentTime = 0.0;
                    this.jumpSong.volume = 0.1;
                    this.jumpSong.play();
                    this.isJumping = true;
                    this.jumpPressedTime = 0;
                    this.player.vy = -6;
                    this.player.grounded = false;
                } else if (this.isJumping && this.jumpPressedTime < this.maxJumpTime) {
                    const finalJump = this.player.haveDoubleJump ? this.player.jumpForce * 1.7 : this.player.jumpForce;
                    this.player.vy = -(finalJump);
                }
                this.jumpPressedTime++;
            } else {
                this.isJumping = false;
            }
        }

        // Soltar objeto
        if(this.keys["Spring"]){
            this.player.useUpForce(this.ACTUAL_SCREEN);
            
        }

        // Atualiza IA de inimigo
        if(this.ACTUAL_SCREEN.enemies && this.ACTUAL_SCREEN.enemies.length > 0){
            this.ACTUAL_SCREEN.enemies
            .filter(e => e.condition && typeof e.condition == 'function' ? e.condition() : true)
            .forEach(e => e.update(this.ctx, this.canvas, this.player));
        }




        // Gravidade
        const gravidade = this.ACTUAL_SCREEN.gravity || this.GRAVITY;
        if (this.player.vy < this.MAX_GRAVITY) this.player.vy += gravidade;

        // Movimento horizontal
        this.player.x += this.player.vx;

        // Verifica colisão horizontal (mantive sua lógica, usando isSolid atualizado)
        this.checkPlayerCollision();
        if (
            this.player.y > this.mapHeight * this.TILE_SIZE +10   // Caiu pra fora por baixo
        ) {
            this.respawnPlayer();
        }

        this.atualizarAnimacao();

        // Chama efeito ambiental da fase
        if(this.ACTUAL_SCREEN.envEffect){
            this.ACTUAL_SCREEN.envEffect(this.player);
        }

        this.draw();
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.imageSmoothingEnabled = false;

        // ==================== BACKGROUND =======================
        // Verifica se há background personalizado

        const { offsetX, offsetY } = this.getCameraOffset();

        if(this.ACTUAL_SCREEN.drawBg){
            this.ACTUAL_SCREEN.drawBg({
                canvas: this.canvas,
                ctx: this.ctx,
                cameraOffset: this.getCameraOffset()
            });
        }else{
            // Adiciona background
            this.ctx.fillStyle = this.ACTUAL_SCREEN.background || "#3e417eff";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        if(this.ACTUAL_SCREEN.bgPattern){
            this.ctx.save();
            this.ctx.translate(-offsetX, 0); // move o padrão

            this.ctx.fillStyle = this[this.ACTUAL_SCREEN.bgPattern];
            this.ctx.fillRect(offsetX, 0, this.canvas.width + offsetX, this.canvas.height);

            this.ctx.restore();
        }

        const startCol = Math.floor(offsetX / this.TILE_SIZE);
        const endCol = Math.ceil((offsetX + this.canvas.width) / this.TILE_SIZE);
        const startRow = Math.floor(offsetY / this.TILE_SIZE);
        const endRow = Math.ceil((offsetY + this.canvas.height) / this.TILE_SIZE);

        // Desenha mapa que estiver atras (tiles com índice >= 10 no seu esquema original)
        for (let y = startRow; y < endRow; y++) {
            for (let x = startCol; x < endCol; x++) {
                if (this.ACTUAL_SCREEN.map[y] && this.ACTUAL_SCREEN.map[y][x] === undefined) continue;
                if (!this.ACTUAL_SCREEN.map[y] || !this.ACTUAL_SCREEN.map[y][x]) continue;
                const tileIndex = this.ACTUAL_SCREEN.map[y][x];
                if (!this.TILES_BG.includes(tileIndex)) continue;

                // this.ctx.strokeStyle = "gray";
                // this.ctx.strokeRect(x * this.TILE_SIZE -offsetX, y * this.TILE_SIZE -offsetY, this.TILE_SIZE, this.TILE_SIZE);

                if (tileIndex === 0) continue; // Pula tiles vazios

                // índice na spritesheet
                const sx = 32 * (tileIndex - 1);
                const sy = 0;

                // Nao mexer
                const dx = x * this.TILE_SIZE - offsetX;
                const dy = y * this.TILE_SIZE - offsetY;


                this.ctx.drawImage(
                    this.tileset,
                    sx, sy, 32, 32, // src
                    dx, dy, this.TILE_SIZE, this.TILE_SIZE  // dest
                );
            }
        }

        // Desenha objetos da tela
        [...this.player.tempObjects, ...this.ACTUAL_SCREEN.objects]
        .filter(obj => {
            if(!obj) return false;
            if(obj.condition) return obj.condition(this.player);
            return true;
        })
        .forEach(obj => {
            if (obj.sprite) {
                const spriteImg = new Image();
                spriteImg.src = obj.sprite.src; // Caminho para a imagem do sprite

                obj.sprite.frameCounter++;
                if (obj.sprite.frameCounter >= obj.sprite.frameTime) {
                    obj.sprite.frame = (obj.sprite.frame + 1) % obj.sprite.frameMax;
                    obj.sprite.frameCounter = 0;
                }

                const spriteWidth = obj.sprite.width || this.SPRITE_SHEET_SIZE;
                const spriteHeight = obj.sprite.height || this.SPRITE_SHEET_SIZE;

                this.ctx.drawImage(
                    spriteImg,
                    (obj.sprite.frame * spriteWidth) + (obj.sprite.cutW||0), obj.sprite.cutH,
                    spriteWidth, spriteHeight,
                    obj.x - offsetX, obj.y - offsetY,
                    obj.w, obj.h
                );

            } else {
                this.ctx.fillStyle = obj.color;
                this.ctx.fillRect(obj.x - offsetX, obj.y - offsetY, obj.w, obj.h);
            }

            if (this.isColliding(this.player, obj)) {
                obj.onTouch(this.player);

                if (obj.isSolid) {
                    // Verifica se há sobreposição (colisão)
                    const overlapX = this.player.x < obj.x + obj.w && this.player.x + this.player.w > obj.x;
                    const overlapY = this.player.y < obj.y + obj.h && this.player.y + this.player.h > obj.y;

                    if (overlapX && overlapY) {
                        // Calcula o quanto o player invadiu o objeto em cada eixo
                        const overlapLeft = this.player.x + this.player.w - obj.x;
                        const overlapRight = obj.x + obj.w - this.player.x;
                        const overlapTop = this.player.y + this.player.h - obj.y;
                        const overlapBottom = obj.y + obj.h - this.player.y;

                        // Determina o menor deslocamento necessário
                        const minOverlapX = Math.min(overlapLeft, overlapRight);
                        const minOverlapY = Math.min(overlapTop, overlapBottom);

                        // Corrige a posição do jogador empurrando-o para fora
                        if (minOverlapX < minOverlapY) {
                            if (overlapLeft < overlapRight) {
                                // bateu pela esquerda
                                this.player.x -= overlapLeft;
                            } else {
                                // bateu pela direita
                                this.player.x += overlapRight;
                            }
                        } else {
                            if (overlapTop < overlapBottom) {
                                // bateu por cima
                                this.player.y -= overlapTop;
                                this.player.grounded = true;
                                this.player.vy = 0;
                            } else {
                                // bateu por baixo
                                this.player.y += overlapBottom;
                            }
                        }
                    }
                }

            }else{
                if(obj.onTouchLeave){
                    obj.onTouchLeave(this.player);
                }
            }
        });

        // ==================== DESENHA PLAYER =====================
        this.player.draw(offsetX, offsetY);

        // Desenha mapa que estiver na frente (tiles com índice < 10)
        for (let y = startRow; y < endRow; y++) {
            for (let x = startCol; x < endCol; x++) {
                if (this.ACTUAL_SCREEN.map[y] && this.ACTUAL_SCREEN.map[y][x] === undefined) continue;                
                if (!this.ACTUAL_SCREEN.map[y] || !this.ACTUAL_SCREEN.map[y][x]) continue;
                const tileIndex = this.ACTUAL_SCREEN.map[y][x];

                if(this.TILES_BG.includes(tileIndex)) continue;

                // this.ctx.strokeStyle = "gray";
                // this.ctx.strokeRect(x * this.TILE_SIZE -offsetX, y * this.TILE_SIZE -offsetY, this.TILE_SIZE, this.TILE_SIZE);

                if (tileIndex === 0) continue; // Pula tiles vazios

                const dx = x * this.TILE_SIZE - offsetX;
                const dy = y * this.TILE_SIZE - offsetY;

                this.drawTile(dx, dy, tileIndex);
            }
        }

        // Desenha inimigos
        if(this.ACTUAL_SCREEN.enemies && this.ACTUAL_SCREEN.enemies.length > 0){
            this.ACTUAL_SCREEN.enemies
            .filter(e => e.condition && typeof e.condition == 'function' ? e.condition() : true)
            .forEach(e => e.draw(this.ctx, this.canvas, { x: offsetX, y: offsetY }));

            // Checa colisão com inimigo
            this.ACTUAL_SCREEN.enemies
            .filter(e => e.condition && typeof e.condition == 'function' ? e.condition() : true)
            .forEach(e => {
                if (this.isColliding(this.player, e)) {
                    e.onTouch(this.player);
                }
            });

        }

        
        // PLAYER INFO
        this.exibirHUD();

    }

    drawPause(){
        this.ctx.save();
        this.ctx.imageSmoothingEnabled = false;

        // this.frame = this.frame || 0;
        // this.frameCounter = this.frameCounter || 0;

        // ==============  HUD DE PAUSA ================
        // Desenha fundo
        // this.ctx.fillStyle = "rgba(35, 31, 75, 1)";
        // this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.pauseImg,
            0,0, 160, 90,
            0,0, this.canvas.width, this.canvas.height
        );

        this.drawText("Pause", this.canvas.width * 0.42, this.canvas.width * 0.06, {});
        

        // Personagem
        // Define sprite
        const srcPlayer = this.player.haveVaria ? this.player.personagemImgVaria : this.player.personagemImg;

        this.frameCounter++;

        // if(this.frameCounter == 10){
        //     this.frameCounter = 0;
        //     this.frame = this.frame > 6 ? 0 : this.frame + 1;
        // }

        this.drawText(`Life: ${this.player.hp.current} / ${this.player.hp.max}`, this.canvas.width * 0.07, this.canvas.width * 0.084, {fontSize: "30px"});
        
        this.ctx.drawImage(
            srcPlayer,
            0, 32*5 * 4, this.SPRITE_SHEET_SIZE, this.SPRITE_SHEET_SIZE,
            0, this.canvas.width * .1, this.canvas.width * .35, this.canvas.width * .35
        )

        // Chakras
        this.drawText("Chakras", this.canvas.width * 0.72, this.canvas.width * 0.063, {fontSize: "30px"});

        if (this.player.haveThirdEye) {
            this.ctx.drawImage(this.itemsImg,
                18 * 3, 0, 18 * 3, 18 * 3,
                this.canvas.width * 0.638, this.canvas.width * 0.093, this.canvas.width * 0.05, this.canvas.width * 0.05
            );
        }

        if (this.player.haveDoubleJump) {
            this.ctx.drawImage(this.itemsImg,
                18 * 3, 18 * 3 * 1, 18 * 3, 18 * 3,
                this.canvas.width * 0.714, this.canvas.width * 0.093, this.canvas.width * 0.05, this.canvas.width * 0.05
            );
        }

        if (this.player.haveSpeedBooster) {
            this.ctx.drawImage(this.itemsImg,
                18 * 3, 18 * 3 * 2, 18 * 3, 18 * 3,
                this.canvas.width * 0.7885, this.canvas.width * 0.093, this.canvas.width * 0.05, this.canvas.width * 0.05
            );
        }

        if (this.player.haveBall) {
            this.ctx.drawImage(this.itemsImg,
                18 * 3, 18 * 3 * 3, 18 * 3, 18 * 3,
                this.canvas.width * 0.8635, this.canvas.width * 0.093, this.canvas.width * 0.05, this.canvas.width * 0.05
            );
        }

        // Segunda linha
        if (this.player.haveVaria) {
            this.ctx.drawImage(this.itemsImg,
                18 * 3, 18 * 3 * 4, 18 * 3, 18 * 3,
                this.canvas.width * 0.674, this.canvas.width * 0.145, this.canvas.width * 0.05, this.canvas.width * 0.05
            );
        }

        if (this.player.haveSpringBall) {
            this.ctx.drawImage(this.itemsImg,
                18 * 3, 18 * 3 * 5, 18 * 3, 18 * 3,
                this.canvas.width * 0.749, this.canvas.width * 0.145, this.canvas.width * 0.05, this.canvas.width * 0.05
            );
        }

        if (this.player.haveUpForce){
            this.ctx.drawImage(this.itemsImg,
                18 * 3, 18 * 3 * 6, 18 * 3, 18 * 3,
                this.canvas.width * 0.824, this.canvas.width * 0.145, this.canvas.width * 0.05, this.canvas.width * 0.05
            );
        }


        //  ================ Keys =================================
        this.drawText("Keys", this.canvas.width * 0.72, this.canvas.width * 0.27, {fontSize: "30px"});

        if(this.player.keys.green){
            this.ctx.drawImage(this.general_tiles,
                (32*5)*6, 0, 32 * 5, 32 * 5,
                this.canvas.width * 0.62, this.canvas.height * 0.56, this.canvas.width * 0.1, this.canvas.width * 0.1
            );
        }
        if(this.player.keys.yellow){
            this.ctx.drawImage(this.general_tiles,
                (32*5)*9, 0, 32 * 5, 32 * 5,
                this.canvas.width * 0.76, this.canvas.height * 0.56, this.canvas.width * 0.1, this.canvas.width * 0.1
            );
        }
        if(this.player.keys.blue){
            this.ctx.drawImage(this.general_tiles,
                (32*5)*7, 0, 32 * 5, 32 * 5,
                this.canvas.width * 0.696, this.canvas.height * 0.714, this.canvas.width * 0.1, this.canvas.width * 0.1
            );
        }
        if(this.player.keys.red){
            this.ctx.drawImage(this.general_tiles,
                (32*5)*8, 0, 32 * 5, 32 * 5,
                this.canvas.width * 0.834, this.canvas.height * 0.714, this.canvas.width * 0.1, this.canvas.width * 0.1
            );
        }


        this.ctx.restore();
        
    }

    handlePause(){
        if(this.state == 'PAUSED'){
            // Despausando
            this.state = "PLAYING";

            
            const bgm = document.getElementById("bgm");
            bgm.volume = 0.5; // Ajusta o volume
        }else{
            // Pausa o jogo
            this.state = "PAUSED";
            this.ctx.save();
    
            this.ctx.fillStyle = "rgba(0,0,0,0.5)";
            this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
    
            this.ctx.restore();

            // Diminui o volume da musica
            const bgm = document.getElementById("bgm");
            bgm.volume = 0.05; // Ajusta o volume


        }

    }

    resizeCanvas() {
        // Sem isso esta dando erro
        const canvas = document.getElementById("game");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

        
    reloadScreen (NEW_SCREEN, options){
        // Carrega tela atual

        this.ctx.fillStyle = "rgba(0,0,0,.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.SCREEN_MODULE = this.SCREEN_MODULES[NEW_SCREEN || this.SCREEN_NAME];
        this.ACTUAL_SCREEN = this.SCREEN_MODULE.default;

        this.mapWidth = this.SCREEN_MODULE.default.map[0].length;
        this.mapHeight = this.SCREEN_MODULE.default.map.length;
        
        //Efeito de loading - ESTA QUEBRANDO O VERIFICAR  DE PLAYER FORA DA TELA
        // if(!options || !options.noLoad) await loadingScreen(0); 

        this.resizeCanvas();
        
        
        // Revisar posição do jogador
        if(options.playerStart){
            this.player.x = options.playerStart.x;
            this.player.y = options.playerStart.y;
            this.player.direction = options.playerStart.direction || "R";
        }else{
            this.player.x = this.SCREEN_MODULE.default.playerStart.x;
            this.player.y = this.SCREEN_MODULE.default.playerStart.y;
        }
    }


    // ============== Funções de apoio ==============
    loadingScreen(duration) {
        return new Promise((resolve) => {
            const fadeTime = 200; // tempo de fade-in/out em ms
            const totalTime = duration + fadeTime * 2; // inclui entrada e saída
            const startTime = performance.now();

            function drawLoading() {
                const currentTime = performance.now();
                const elapsed = currentTime - startTime;
                let alpha = 1;

                // Calcula o alpha (transparência)
                if (elapsed < fadeTime) {
                    // Fade-in
                    alpha = elapsed / fadeTime;
                } else if (elapsed > totalTime - fadeTime) {
                    // Fade-out
                    alpha = 1 - (elapsed - (totalTime - fadeTime)) / fadeTime;
                }

                // Limpa tela
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // Desenha fundo e texto com o alpha calculado
                this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.font = "bold 40px PixelFont";
                this.ctx.fillText("Carregando...", this.canvas.width / 2 - 100, this.canvas.height / 2);

                if (elapsed < totalTime) {
                    requestAnimationFrame(drawLoading);
                } else {
                    resolve();
                }
            }

            drawLoading();
        });
    }


    exibirHUD() {
        this.ctx.save();

        // ====== VIDAS ======
        // this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        // this.ctx.fillRect(this.canvas.width - 400, 0, 400, 120);

        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        // Checa se tem varia
        if(this.player.haveVaria){
            this.ctx.drawImage(this.general_tiles,
                32 * 5 * 9, 32 * 5 * 2, 32 * 5, 32 * 5,
                10, 10, 100, 100
            );
        }else{
            this.ctx.drawImage(this.general_tiles,
                0, 0, 32 * 5, 32 * 5,
                10, 10, 100, 100
            );
        }
        
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "bold 35px PixelFont";
        this.ctx.fillText(Math.round(this.player.hp.current), 85, 65);

        if(this.DEBUG){
            this.ctx.font = "bold 20px PixelFont";
            this.ctx.fillText(this.updateStats(), 150, 65);
            this.ctx.fillText(this.measureCPU(), 150, 95);
        }


        // ====== ITENS ======
        // if (this.player.haveBall) {
        //     this.ctx.drawImage(this.general_tiles,
        //         (32*5)*4, 0,32 * 5, 32 * 5,
        //         this.canvas.width - 370, 20, 60, 60
        //     );
        // }
        // if (this.player.haveDoubleJump) {
        //     this.ctx.drawImage(this.general_tiles,
        //         (32*5)*3, 0, 32 * 5, 32 * 5,
        //         this.canvas.width - 280, 20, 60, 60
        //     );
        // }
        // if (this.player.haveSpringBall) {
        //     this.ctx.drawImage(this.general_tiles,
        //         (32*5)*5, 0, 32 * 5, 32 * 5,
        //         this.canvas.width - 190, 20, 60, 60
        //     );
        // }
        // if (this.player.haveSpeedBooster) {
        //     this.ctx.drawImage(this.general_tiles,
        //         (32*5)*2, 0, 32 * 5, 32 * 5,
        //         this.canvas.width - 100, 20, 60, 60
        //     );
        // }

        // // ====== KEYS ======
        // if(this.player.keys.green){
        //     this.ctx.drawImage(this.general_tiles,
        //         (32*5)*6, 0, 32 * 5, 32 * 5,
        //         this.canvas.width - 370, 70, 60, 60
        //     );
        // }
        // if(this.player.keys.yellow){
        //     this.ctx.drawImage(this.general_tiles,
        //         (32*5)*9, 0, 32 * 5, 32 * 5,
        //         this.canvas.width - 280, 70, 60, 60
        //     );
        // }
        // if(this.player.keys.blue){
        //     this.ctx.drawImage(this.general_tiles,
        //         (32*5)*7, 0, 32 * 5, 32 * 5,
        //         this.canvas.width - 190, 70, 60, 60
        //     );
        // }
        // if(this.player.keys.red){
        //     this.ctx.drawImage(this.general_tiles,
        //         (32*5)*8, 0, 32 * 5, 32 * 5,
        //         this.canvas.width - 100, 70, 60, 60
        //     );
        // }

        // TIMER
        // if(this.player.timerStart && !this.player.endTime){
        //     const elapsed = Math.floor((performance.now() - this.player.timerStart) / 1000);
        //     const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
        //     const seconds = String(elapsed % 60).padStart(2, '0');
        //     this.ctx.font = "bold 30px PixelFont";
        //     this.ctx.fillText(`${minutes}:${seconds}`, this.canvas.width/2, 115);
        // }else if(this.player.totalTime){
        //     const totalSeconds = Math.floor(this.player.totalTime / 1000);
        //     const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        //     const seconds = String(totalSeconds % 60).padStart(2, '0');
        //     this.ctx.font = "bold 30px PixelFont";
        //     this.ctx.fillText(`${minutes}:${seconds}`, this.canvas.width/2, 115);
        // }


        this.ctx.restore();
    }
    
    checkPlayerCollision() {
        const topY = this.getPosY();
        const midY = this.getPosY() + this.getPlayerHeight() / 2;
        const botY = this.getPosY() + this.getPlayerHeight() - 1;

        if (this.player.vx > 0
            && (
                this.isSolid(this.player.x + this.player.w, midY)
                || this.isSolid(this.player.x + this.player.w, topY)
                || this.isSolid(this.player.x + this.player.w, botY)
            ))
        {
            // Colidiu com a parede direita
            this.player.x = Math.floor((this.player.x + this.player.w) / this.TILE_SIZE) * this.TILE_SIZE - this.player.w - 0.01;
            this.player.inWall = true;
        } else {
            this.player.inWall = false;
        }
        if (this.player.vx < 0
            && (
                this.isSolid(this.player.x, midY)
                || this.isSolid(this.player.x, topY)
                || this.isSolid(this.player.x, botY)
            ))
        {
            // Colidiu com a parede esquerda 
            this.player.x = Math.floor((this.player.x) / this.TILE_SIZE + 1) * this.TILE_SIZE + 0.01;
            this.player.inWall = true;
        } else {
            this.player.inWall = false;
        }

        // Movimento vertical
        this.player.y += this.player.vy;

        // --- NOVA LÓGICA DE COLISÃO VERTICAL COM SUPORTE A RAMPAS ---
        // Vamos checar a posição dos "pés" em 3 pontos: esquerda, centro, direita
        const feetY = this.getPosY() + this.getPlayerHeight();
        const sampleXs = [
            this.player.x + 2, // pequeno offset para evitar bordas exatas
            this.player.x + this.player.w / 2,
            this.player.x + this.player.w - 2
        ];

        let snappedToGround = false;

        for (let sx of sampleXs) {
            const { tileX, tileY } = this.getTileXY(sx, feetY + 1);
            const tile = this.ACTUAL_SCREEN.map[tileY]?.[tileX];

            if (!tile || this.NOT_SOLID_TILES.includes(tile)) {
                continue;
            }
            // tile sólido normal (ex: 1)
            // se houver um tile sólido logo abaixo dos pés, snap ao topo do tile
            const tileTopY = tileY * this.TILE_SIZE;
            if (feetY > tileTopY) {
                this.player.y = tileTopY - this.getPlayerHeight();
                this.player.vy = 0;
                this.player.grounded = true;
                snappedToGround = true;
                break;
            }
        }

        if (!snappedToGround) {
            // checar se colidiu com teto (mantive sua lógica)
            if (
                this.isSolid(this.player.x, this.getPosY()) // Canto superior esquerdo
                || this.isSolid(this.player.x + this.player.w, this.getPosY()) // Canto superior direito
            ) {
                this.player.y = Math.floor(this.getPosY() / this.TILE_SIZE + 1) * this.TILE_SIZE + 0.01;
                this.player.vy = 0;
                this.player.grounded = false;
            } else {
                this.player.grounded = false;
            }
        }
    }


    formatBytes(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

    updateStats() {
        if (performance.memory) {
            const mem = performance.memory;
            const used = this.formatBytes(mem.usedJSHeapSize);
            const total = this.formatBytes(mem.totalJSHeapSize);
            const limit = this.formatBytes(mem.jsHeapSizeLimit);

            return `Memória usada: ${used}\nHeap total: ${total}\nLimite: ${limit}`;
        } else {
            return "performance.memory não suportado neste navegador.";
        }
    }

    

    measureCPU() {
        const start = performance.now();

        // Faz um pequeno trabalho artificial
        for (let i = 0; i < 1e6; i++) Math.sqrt(i);

        const end = performance.now();
        const delta = end - start;
        const elapsed = end - last;

        // Quanto maior delta, maior o "uso"
        this.load = (delta / elapsed * 100).toFixed(1);
        this.last = end;

        return `\nCPU estimada: ${load}%`;
    }


    drawTile(x, y, tileIndex) {
        // this.ctx.beginPath();

        const tileSize = 16 * 2; // Tamanho total da spritesheet

        // índice na spritesheet
        const sx = tileSize * (tileIndex - 1);
        const sy = 0;

        this.ctx.drawImage(
            this.tileset,
            sx, sy, tileSize, tileSize, // src
            x, y, this.TILE_SIZE, this.TILE_SIZE  // dest
        );
    }


    mostrarDialogo(titulo, texto, exibirFim = false, callback = null) {
        this.dialogBox.ativo = true;
        this.dialogBox.title = typeof titulo == 'object' ? titulo : { color: "#fff", text: titulo };
        this.dialogBox.body = typeof texto == 'object' ? texto : { color: "#fff", text: texto };
        this.dialogBox.alpha = 0;        // Começa invisível
        this.dialogBox.animando = true;  // Começa a animação
        this.dialogBox.exibirFim = exibirFim; // Flag para exibir o fim do jogo

        if (callback) this.DIAOLOG_CALLBACK = callback;
    }

    fecharDialogo() {
        this.dialogBox.ativo = false;

        if (this.DIAOLOG_CALLBACK) {
            this.DIAOLOG_CALLBACK();
            this.DIAOLOG_CALLBACK = null; // Reseta o callback
        }
    }

    getCameraOffset() {
        let offsetX = this.player.x - this.canvas.width / 2 + this.player.w / 2;
        let offsetY = this.player.y - this.canvas.height / 1.5 + this.player.h / 2;

        // limitar aos limites do mapa
        offsetX = Math.max(0, Math.min(offsetX, this.mapWidth * this.TILE_SIZE - this.canvas.width));
        offsetY = Math.max(0, Math.min(offsetY, this.mapHeight * this.TILE_SIZE - this.canvas.height));

        return { offsetX, offsetY };
    }

    startGamepadPolling() {
        requestAnimationFrame(() => this.checkGamepad(this.deParaGamepad));
    }

    // 
    
    checkGamepad(callback) {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const now = performance.now();

        for (let gp of gamepads) {
            if (!gp) continue;

            for (let index = 0; index < gp.buttons.length; index++) {
                const button = gp.buttons[index];

                
                const action = callback(index);

                // Inicializa controle de cooldown se ainda não existir
                if (!this.lastButtonPress) this.lastButtonPress = {};
                const cooldown = 500; // 1 segundo

                if (button.pressed) {         

                    if (this.state === "MENU"){
                        if (!this.lastButtonPress[index] || now - this.lastButtonPress[index] > cooldown) {
                            this.lastButtonPress[index] = now;
                            this.sendCommandToMenu(action);
                        }
                    }
                    if(['PLAYING', 'PAUSED'].includes(this.state) && action == 'Start'){
                        if (!this.lastButtonPress[index] || now - this.lastButtonPress[index] > cooldown) {
                            this.lastButtonPress[index] = now;
                            this.handlePause();
                        }
                    }

                    this.keys[action] = true;
                } else {
                    this.keys[action] = false;
                    // Reseta tempo se quiser permitir novo clique ao soltar
                    // delete this.lastButtonPress[index];
                }
            }
        }

        requestAnimationFrame(() => this.checkGamepad(callback));
    }

    sendCommandToMenu(command){
        const changeSelectionSound = document.getElementById("menuChangeSelect");
        changeSelectionSound.currentTime = 0.0;
        changeSelectionSound.volume = 0.2;

        // Verifica controle
        switch(command){
            case "ArrowUp":
                this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
                changeSelectionSound.play();
                break;
            case "ArrowDown":
                this.selectedOption = (this.selectedOption + 1) % this.options.length;
                changeSelectionSound.play();
                break;
            case "OK":
                this.handleMenuSelection();
                break;
        }
    }

    deParaGamepad(button) {
        // Mapeia os botões do gamepad para ações
        const buttonMap = {
            12: 'ArrowUp',   // Botão UP
            13: 'ArrowDown',  // Botão DOWN
            14: 'ArrowLeft',  // Botão LEFT
            15: 'ArrowRight', // Botão RIGHT
            2: 'Run',       // Botão Y   
            1: 'OK',        // Botão A         
            0: 'Jump',    // Botão B
            9: 'Start',
            3: 'Spring'
        };

        return buttonMap[button] || null; // Retorna a ação correspondente ou null se não houver mapeamento
    }

    getTileXY(x, y) {
        return {
            tileX: Math.floor(x / this.TILE_SIZE),
            tileY: Math.floor(y / this.TILE_SIZE)
        };
    }

    isSolid(x, y, ignoreY = false) {
        const tileX = Math.floor(x / this.TILE_SIZE);
        const tileY = Math.floor(y / this.TILE_SIZE);
        const tile = this.ACTUAL_SCREEN.map[tileY]?.[tileX];
        // Tiles inexistentes contam como sólidos (evita cair fora do mapa)
        if (tile === undefined) return true;

        // Tile 0 = ar (não sólido)
        if (this.NOT_SOLID_TILES.includes(tile)) return false;

        return true;
    }

    // =========================== LÓGICA DO JOGO ===========================
    atualizarAnimacao() {
        this.player.frameCounter++;

        let ACTION_NAME = 'stand';

        // Checa frameMax da animação atual
        if (this.isJumping) {
            ACTION_NAME = 'jump';
        } else if (!this.isJumping && !this.player.grounded) {
            ACTION_NAME = 'falling';
        } else if (this.player.isRunning && this.player.isWalking) {
            ACTION_NAME = 'run';
        } else if (this.player.isBall && this.player.isWalking) {
            ACTION_NAME = 'crouch';
        } else if (this.player.isBall && !this.player.isWalking) {
            ACTION_NAME = 'crouch';
        } else if (this.player.isWalking) {
            ACTION_NAME = 'walk';
        }

        const FRAME_TIME = ACTION_NAME == 'run' ? 3 : this.player.frameTime;

        if (this.player.frameCounter >= FRAME_TIME) {
            this.player.frame = (this.player.frame + 1) % this.player.spriteSheet.actions[ACTION_NAME].frames;
            this.player.frameCounter = 0;
        }
    }

    respawnPlayer() {
        this.player.x = this.ACTUAL_SCREEN.playerStart.x;
        this.player.y = this.ACTUAL_SCREEN.playerStart.y;
        this.player.vx = 0;
        this.player.vy = 0;

        this.player.isBall = false;
        this.player.inWall = false;
        this.player.isJumping = false;

        // Perde uma vida
        this.player.takeDmg(1);
    }

    gameOver() {
        console.log("GAME OVER");
        this.mostrarDialogo("Game Over", "Não foi dessa vez minha cara...", false, async () => {
            // Reinicia o jogo
            this.player.hp = {
                max: 100,
                current: 100
            };
            this.player.haveBall = false;
            this.player.haveDoubleJump = false;
            this.player.haveSpringBall = false;
            this.player.haveSpeedBooster = false;

            this.reloadScreen("World", {noLoad: true});
            this.player.direction = "R";
        });
    }


    

    desenharDialogo() {
        if (!this.dialogBox.ativo && this.dialogBox.alpha <= 0) return;

        // Animação de fade-in
        if (this.dialogBox.animando) {
            this.dialogBox.alpha += 0.05;
            if (this.dialogBox.alpha >= 1) {
                this.dialogBox.alpha = 1;
                this.dialogBox.animando = false;
            }
        }

        const largura = 600;
        const altura = 200;
        const x = (this.canvas.width - largura) / 2;
        const y = (this.canvas.height - altura) / 2;

        this.ctx.save();
        this.ctx.globalAlpha = this.dialogBox.alpha;

        // Caixa
        this.ctx.fillStyle = this.dialogBox.bgColor || "#202035ff";
        this.ctx.fillRect(x, y, largura, altura);
        this.ctx.strokeStyle = "#fff";
        this.ctx.strokeRect(x, y, largura, altura);

        // Título
        this.ctx.fillStyle = this.dialogBox.title.color || "#fff";
        this.ctx.font = "bold 30px PixelFont";
        this.ctx.fillText(this.dialogBox.title.text, x + (largura / 2) - (this.dialogBox.title.text.length * 7), y + 30);

        // Texto
        this.ctx.fillStyle = this.dialogBox.body.color || "#fff";
        this.ctx.font = "20px PixelFont";
        const linhas = this.quebrarTexto(this.ctx, this.dialogBox.body.text, largura - 40);
        linhas.forEach((linha, i) => {
            this.ctx.fillText(linha, x + 20, y + 90 + i * 20);
        });

        // Botao OK
        this.ctx.fillStyle = this.dialogBox.body.color || "#fff";
        this.ctx.font = "20px PixelFont";
        this.ctx.fillText("Fechar (A)", x + largura - 120, y + 180);


        if (this.dialogBox.exibirFim) {
            // Desenha a imagem final
            // this.ctx.drawImage(arteFinal, x - 40, y + 150, 1680 / 2.5, 560 / 2.5);
        }


        this.ctx.restore();
    }

    getSprite() {
        let spriteX = 0;
        let spriteY = 0;

        if(this.player.getItem){
            spriteX = 0; 
            spriteY = this.SPRITE_SHEET_SIZE * 4;
        }else{

            if (this.isJumping) {
                // JUMP
                spriteX = 0;
                spriteY = this.SPRITE_SHEET_SIZE * 3.05;
            } else if (!this.isJumping && !this.player.grounded) {
                // FALLING
                spriteX = ((this.player.frame - 1) * this.SPRITE_SHEET_SIZE) + this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 3.05;

            } else if (this.player.isRunning && this.player.isWalking) {
                // RUNNING
                spriteX = this.player.frame * this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 2;

            } else if (this.player.isBall && this.player.isWalking) {
                // CROUNCH WALKING
                spriteX = this.player.frame * this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 5;

            } else if (this.player.isBall && !this.player.isWalking) {
                // CROUNCH
                spriteX = 0;
                spriteY = this.SPRITE_SHEET_SIZE * 5;

            } else if (this.player.isWalking) {
                // WALKING
                spriteX = this.player.frame * this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 1;
            } else if (false) {
                // MID
                // spriteX = 570 + 30;
                // spriteY = 90;

            } else if (this.player.isMeditating) {
                // MEDITATING
                spriteX = this.player.frame * this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 6;
            } else {
                // STAND
                spriteX = this.player.frame * this.SPRITE_SHEET_SIZE; 
                spriteY = this.SPRITE_SHEET_SIZE * 0;
            }
        }

        return { spriteX, spriteY };
    }

    // changeMap(x, y) {
    //     const tileX = Math.floor(x / this.TILE_SIZE);
    //     const tileY = Math.floor(y / this.TILE_SIZE);
    //     console.log(`Mudando o mapa no tile: (${tileX}, ${tileY})`);
    //     // Exemplo de mudança de mapa
    //     // map[tileX][tileY] = 2;
    //     this.ACTUAL_SCREEN.map[tileX][tileY] == 1 ? 0 : 1; // Muda um tile específico para bloco
    // }

    getPosY() {
        return this.player.y;
    }

    getPlayerHeight() {
        return this.player.isBall ? this.player.h / 2 : this.player.h;
    }

    isColliding(a, b) {
        return (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
        );
    }

    quebrarTexto(ctx, texto, larguraMax) {
        const palavras = texto.split(' ');
        const linhas = [];
        let linhaAtual = '';

        for (let palavra of palavras) {
            const testeLinha = linhaAtual + palavra + ' ';
            const largura = this.ctx.measureText(testeLinha).width;
            if (largura > larguraMax) {
                linhas.push(linhaAtual);
                linhaAtual = palavra + ' ';
            } else {
                linhaAtual = testeLinha;
            }
        }
        linhas.push(linhaAtual);
        return linhas;
    }


    drawText(text, x, y, {fontSize, fontColor, strokeColor} = {} ){
        const DEFAULT = {fontSize: "55px", fontColor: "#fff", strokeColor:"black"};
        
        this.ctx.save();
        this.ctx.imageSmoothingEnabled = false;
        // Letras
        this.ctx.fillStyle = fontColor || DEFAULT.fontColor;
        this.ctx.font = `bold ${fontSize || DEFAULT.fontSize} PixelFont`;
        // Cor do contorno
        this.ctx.strokeStyle = strokeColor || DEFAULT.strokeColor;
        this.ctx.lineWidth = 4; // Espessura do contorno
        this.ctx.strokeText(text, x, y);

        this.ctx.fillText(text, x, y);

        this.ctx.restore();
    }

}

export { Game };