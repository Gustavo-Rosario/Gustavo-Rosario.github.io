import { eventBus } from "../utils/eventBus.js";
import { getCanvasContext } from "../utils/getCanvasContext.js";
import Memory from "../utils/memory.js";


class Game {

    STATE_LIST = ['MENU', 'PLAYING', 'PAUSED', 'GAMEOVER', 'LOADING'];
    GAME_TITLE = "Adventure";
    GAME_SUBTITLE = "The Seven Chakras";
    GAME_VERSION = "v1.0.0";
    TILE_SIZE = 65;
    SPRITE_SHEET_SIZE = 32 * 5;
    DEBUG = false;
    MAX_GRAVITY = 25;

    TILES_BG = [0, 30,31,32,33, 46];

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
        "Shift": "Run" // Shift para correr
    };

    keys = {};


    constructor({player} = {}) {

        // this.ctx = ctx;
        // this.canvas = canvas;
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");

        this.state = 'MENU';

        this.player = player;

        window.addEventListener('resize', this.resizeCanvas);
        // resizethis.Canvas();

        // ================== INIT =======================================
        // Carrega a tela inicial
        this.reloadScreen(this.SCREEN_NAME, {noLoad: true});

        // Revisa mudanças de tela
        eventBus.addEventListener('changeScreen', async (e) => {        
            const { newScreen, options } = e.detail;

            this.SCREEN_NAME = newScreen;
            await this.reloadScreen(newScreen, options);
        });

        this.jumpSong = document.getElementById("jump");


        this.general_tiles = new Image();
        this.general_tiles.src = '../assets/imgs/general.png';

        this.tileset = new Image();
        this.tileset.src = '../assets/imgs/tiles.png';


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
            this.keys[saida] = true
        });
        document.addEventListener("keyup", e => this.keys[this.deParaTeclado[e.key]] = false);


        window.addEventListener("gamepadconnected", e => this.startGamepadPolling());

    }

    async startGame(){
        // =========================== PLAYER ===========================
        console.log("Carregando jogador...");  

        await this.reloadScreen(this.SCREEN_NAME, {noLoad: true});

        this.personagemImg = new Image();
        this.personagemImg.src = this.player.spriteSheet.src;

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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update(){
        // CHECAR STATE DO JOGO
        


        if (this.dialogBox.ativo) {
            if (this.keys["OK"]) this.fecharDialogo(); // Fecha o diálogo se pressionar OK
            return; // pausa o jogo
        }
        if(this.player.getItem){
            return; // pausa o jogo
        }

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

        // Gravidade
        if (this.player.vy < this.MAX_GRAVITY) this.player.vy += 0.5;

        // Movimento horizontal
        this.player.x += this.player.vx;

        // Verifica colisão horizontal (mantive sua lógica, usando isSolid atualizado)
        this.checkPlayerCollision();

        // Se o jogador sair do mapa, faz respawn
        
        // this.player.x + this.player.w < 0 || // Saiu pela esquerda
        // this.player.x > this.mapWidth ||     // Saiu pela direita
        // this.player.y + this.player.h < 0    // Saiu por cima (opcional)
        if (
            this.player.y > this.mapHeight * this.TILE_SIZE +10   // Caiu pra fora por baixo
        ) {
            this.respawnPlayer();
        }

        this.atualizarAnimacao();
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.imageSmoothingEnabled = false;


        // Adiciona background
        this.ctx.fillStyle = this.ACTUAL_SCREEN.background || "#b2b3c8";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const { offsetX, offsetY } = this.getCameraOffset();

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

                this.ctx.imageSmoothingEnabled = false;


                this.ctx.drawImage(
                    this.tileset,
                    sx, sy, 32, 32, // src
                    dx, dy, this.TILE_SIZE, this.TILE_SIZE  // dest
                );
            }
        }

        // Desenha objetos da tela
        this.ACTUAL_SCREEN.objects
        .filter(obj => {
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
                    (obj.sprite.frame * this.SPRITE_SHEET_SIZE) + (obj.sprite.cutW||0), obj.sprite.cutH,
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

        // Desenha hitbox
        // this.ctx.strokeStyle = "red";
        // this.ctx.strokeRect(this.player.x - offsetX, getPosY() - offsetY, this.player.w, getPlayerHeight());

        // SPRITE
        const { spriteX, spriteY } = this.getSprite();

        this.ctx.save();

        if (this.player.direction === "L") {
            this.ctx.scale(-1, 1);
            this.ctx.translate(-70 - this.player.x, this.getPosY());

            this.ctx.drawImage(
                this.personagemImg,
                spriteX, spriteY, this.SPRITE_SHEET_SIZE, this.SPRITE_SHEET_SIZE,
                offsetX - (this.player.w * .5), - offsetY - (this.getPlayerHeight() *.2),
                this.player.w * 2.5, this.getPlayerHeight() + (this.getPlayerHeight() *.2)
            );
        } else {
            this.ctx.drawImage(
                this.personagemImg,
                spriteX, spriteY, this.SPRITE_SHEET_SIZE, this.SPRITE_SHEET_SIZE,
                this.player.x - offsetX - (this.player.w * .65), this.getPosY() - offsetY - (this.getPlayerHeight() *.2),
                this.player.w * 2.5, this.getPlayerHeight() + (this.getPlayerHeight() *.2)
            );
        }

        this.ctx.restore();

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


        // DIALOGO
        if (this.dialogBox.ativo) this.desenharDialogo();

        
        // PLAYER INFO
        this.exibirHUD();       

    }

    resizeCanvas() {
        // Sem isso esta dando erro
        const canvas = document.getElementById("game");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

        
    async reloadScreen (NEW_SCREEN, options){

        // Carrega tela atual
        this.SCREEN_MODULE = await import(`../screens/${NEW_SCREEN || SCREEN_NAME}/index.js`);
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
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(this.canvas.width - 400, 0, 400, 120);

        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        this.ctx.drawImage(this.general_tiles,
            0, 0, 32 * 5, 32 * 5,
            10, 10, 100, 100
        );
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "bold 35px PixelFont";
        this.ctx.fillText(Math.round(this.player.lives), 85, 65);

        if(this.DEBUG){
            this.ctx.font = "bold 20px PixelFont";
            this.ctx.fillText(this.updateStats(), 150, 65);
            this.ctx.fillText(this.measureCPU(), 150, 95);
        }


        // ====== ITENS ======
        if (this.player.haveBall) {
            this.ctx.drawImage(this.general_tiles,
                (32*5)*4, 0,32 * 5, 32 * 5,
                this.canvas.width - 370, 20, 60, 60
            );
        }
        if (this.player.haveDoubleJump) {
            this.ctx.drawImage(this.general_tiles,
                (32*5)*3, 0, 32 * 5, 32 * 5,
                this.canvas.width - 280, 20, 60, 60
            );
        }
        if (this.player.haveSpringBall) {
            this.ctx.drawImage(this.general_tiles,
                (32*5)*5, 0, 32 * 5, 32 * 5,
                this.canvas.width - 190, 20, 60, 60
            );
        }
        if (this.player.haveSpeedBooster) {
            this.ctx.drawImage(this.general_tiles,
                (32*5)*2, 0, 32 * 5, 32 * 5,
                this.canvas.width - 100, 20, 60, 60
            );
        }

        // ====== KEYS ======
        if(this.player.keys.green){
            this.ctx.drawImage(this.general_tiles,
                (32*5)*6, 0, 32 * 5, 32 * 5,
                this.canvas.width - 370, 70, 60, 60
            );
        }
        if(this.player.keys.yellow){
            this.ctx.drawImage(this.general_tiles,
                (32*5)*9, 0, 32 * 5, 32 * 5,
                this.canvas.width - 280, 70, 60, 60
            );
        }
        if(this.player.keys.blue){
            this.ctx.drawImage(this.general_tiles,
                (32*5)*7, 0, 32 * 5, 32 * 5,
                this.canvas.width - 190, 70, 60, 60
            );
        }
        if(this.player.keys.red){
            this.ctx.drawImage(this.general_tiles,
                (32*5)*8, 0, 32 * 5, 32 * 5,
                this.canvas.width - 100, 70, 60, 60
            );
        }

        // TIMER
        if(this.player.timerStart && !this.player.endTime){
            const elapsed = Math.floor((performance.now() -4) / 1000);
            const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
            const seconds = String(elapsed % 60).padStart(2, '0');
            this.ctx.font = "bold 30px PixelFont";
            this.ctx.fillText(`${minutes}:${seconds}`, this.canvas.width/2, 115);
        }else if(this.player.totalTime){
            const totalSeconds = Math.floor(this.player.totalTime / 1000);
            const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            this.ctx.font = "bold 30px PixelFont";
            this.ctx.fillText(`${minutes}:${seconds}`, this.canvas.width/2, 115);
        }


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

            if (!tile || this.TILES_BG.includes(tile)) {
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

    checkGamepad(callback) {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        for (let gp of gamepads) {
            if (!gp) continue;

            for (let index = 0; index < gp.buttons.length; index++) {
                const button = gp.buttons[index];
                const action = callback(index);
                if (button.pressed) {
                    this.keys[action] = true
                } else {
                    this.keys[action] = false
                }
            }
        }

        requestAnimationFrame(() => this.checkGamepad(callback));
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
            0: 'Jump'    // Botão B
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
        if (this.TILES_BG.includes(tile)) return false;

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
        this.player.lives--;

        if (this.player.lives <= 0) {
            // Game Over
            this.gameOver();
        }
    }

    gameOver() {
        this.mostrarDialogo("Game Over", "Não foi dessa vez minha cara...", false, async () => {
            // Reinicia o jogo
            this.player.lives = 3;
            this.player.haveBall = false;
            this.player.haveDoubleJump = false;
            this.player.haveSpringBall = false;
            this.player.haveSpeedBooster = false;

            await reloadScreen("World", {noLoad: true});
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

    changeMap(x, y) {
        const tileX = Math.floor(x / this.TILE_SIZE);
        const tileY = Math.floor(y / this.TILE_SIZE);
        console.log(`Mudando o mapa no tile: (${tileX}, ${tileY})`);
        // Exemplo de mudança de mapa
        // map[tileX][tileY] = 2;
        this.ACTUAL_SCREEN.map[tileX][tileY] == 1 ? 0 : 1; // Muda um tile específico para bloco
    }

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

}

export { Game };