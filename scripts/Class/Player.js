const KNOCKBACK_FORCE = 50;

class Player {

    SPRITE_SHEET_SIZE = 32 * 5;
    TILE_SIZE = 65;
    TILES_BG = [0, 30,31,32,33, 46,61,62,63,64,65,66, 67,81,82,83,84,85,86,
        108,109,110,111,112,114,115,116,117,118,119, 124,125,126,127, 138, 139, 140, 141
    ];
    
    tempObjects = [];

    constructor({
        x,y,
        w,h,
        vx,vy,
        lives,
        hp,
        spriteSheet,
        jumpForce, // Força do pulo
        walkForce, // Força de andar
        isRunning, // Modo correr
        isWalking, // Modo andar
        direction, // Direção do personagem
        grounded,
        // Itens
        haveBall,
        haveDoubleJump,
        haveSpringBall,
        haveSpeedBooster,
        haveVaria,
        haveUpForce,
        haveThirdEye,

        keys,

        isBall, // Modo bola
        inWall,
        frame,             // quadro atual
        frameMax,          // total de quadros
        frameTime,        // tempo por quadro (em frames de jogo)
        frameCounter,       // contador de tempo,

        invencibleFrames,
        invencibleFramesMax,
        isInvencible
    }){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.lives = lives;
        this.hp = hp;
        this.spriteSheet = spriteSheet;
        this.jumpForce = jumpForce; // Força do pulo
        this.walkForce = walkForce; // Força de andar
        this.isRunning = isRunning; // Modo correr
        this.isWalking = isWalking; // Modo andar
        this.direction = direction; // Direção do personagem
        this.grounded = grounded;
        // Itens
        this.haveBall = haveBall;
        this.haveDoubleJump = haveDoubleJump;
        this.haveSpringBall = haveSpringBall;
        this.haveSpeedBooster = haveSpeedBooster;
        this.haveVaria = haveVaria;
        this.haveUpForce = haveUpForce;
        this.haveThirdEye = haveThirdEye;

        this.keys = keys;

        this.isBall = isBall; // Modo bola
        this.inWall = inWall;
        this.frame = frame;             // quadro atual
        this.frameMax = frameMax;          // total de quadros
        this.frameTime = frameTime;        // tempo por quadro (em frames de jogo)
        this.frameCounter = frameCounter;       // contador de tempo = frameCounter;       // contador de tempo;

        this.invencibleFrames = invencibleFrames;
        this.invencibleFramesMax = invencibleFramesMax;
        this.isInvencible = isInvencible;

        this.isKB = false;
        this.kBFrames = 0;
        this.kBFramesMax = 200;


        this.personagemImg = new Image();
        this.personagemImg.src = spriteSheet.src;

        this.personagemImgVaria = new Image();
        this.personagemImgVaria.src = spriteSheet.srcVaria;

    }
    
    update(ACTUAL_SCREEN, Game){
        // Verifica gameOver
        if (this.hp.current < 1) {
            // Game Over
            Game.gameOver();
        }

        if(this.getItem){
            return; // pausa o jogo
        }

        // Controles horizontais
        if (Game.keys["ArrowLeft"]) {
            this.direction = "L";
            this.vx = Game.keys["Run"] && this.haveSpeedBooster && !this.isBall ? -(this.walkForce * 3.5) : -this.walkForce;
            this.isWalking = true;
        } else if (Game.keys["ArrowRight"]) {
            this.direction = "R";
            this.vx = Game.keys["Run"] && this.haveSpeedBooster && !this.isBall ? this.walkForce * 3.5 : this.walkForce;
            this.isWalking = true;
        } else {
            this.vx = 0;
            this.isWalking = false;
        }

        this.isRunning = Game.keys["Run"] && this.haveSpeedBooster && !this.isBall;

        if (this.haveBall) {
            if (Game.keys["ArrowDown"]) this.isBall = true;
            if (Game.keys["ArrowUp"]) this.isBall = false;
        }

        // JUMP
        if (Game.keys["Jump"] && (!this.isBall || (this.isBall && this.haveSpringBall))) {
            if (this.grounded) {
                this.jumpSong.currentTime = 0.0;
                this.jumpSong.volume = 0.1;
                this.jumpSong.play();
                this.isJumping = true;
                this.jumpPressedTime = 0;
                this.vy = -6;
                this.grounded = false;
            } else if (this.isJumping && this.jumpPressedTime < this.maxJumpTime) {
                const finalJump = this.haveDoubleJump ? this.jumpForce * 1.7 : this.jumpForce;
                this.vy = -(finalJump);
            }
            this.jumpPressedTime++;
        } else {
            this.isJumping = false;
        }

        // Gravidade
        const gravidade = ACTUAL_SCREEN.gravity || this.GRAVITY;
        if (this.vy < this.MAX_GRAVITY) this.vy += gravidade;

        // Movimento horizontal
        this.x += this.vx;

        // Verifica colisão horizontal (mantive sua lógica, usando isSolid atualizado)
        this.checkPlayerCollision(ACTUAL_SCREEN);

        // Se o jogador sair do mapa, faz respawn
        
        // this.x + this.w < 0 || // Saiu pela esquerda
        // this.x > this.mapWidth ||     // Saiu pela direita
        // this.y + this.h < 0    // Saiu por cima (opcional)
        if (
            this.y > ACTUAL_SCREEN.map.length * this.TILE_SIZE +10   // Caiu pra fora por baixo
        ) {
            this.respawnPlayer(ACTUAL_SCREEN);
        }

        this.atualizarAnimacao();
    }

    atualizarAnimacao() {
        this.frameCounter++;

        let ACTION_NAME = 'stand';

        // Checa frameMax da animação atual
        if (this.isJumping) {
            ACTION_NAME = 'jump';
        } else if (!this.isJumping && !this.grounded) {
            ACTION_NAME = 'falling';
        } else if (this.isRunning && this.isWalking) {
            ACTION_NAME = 'run';
        } else if (this.isBall && this.isWalking) {
            ACTION_NAME = 'crouch';
        } else if (this.isBall && !this.isWalking) {
            ACTION_NAME = 'crouch';
        } else if (this.isWalking) {
            ACTION_NAME = 'walk';
        }

        const FRAME_TIME = ACTION_NAME == 'run' ? 3 : this.frameTime;

        if (this.frameCounter >= FRAME_TIME) {
            this.frame = (this.frame + 1) % this.spriteSheet.actions[ACTION_NAME].frames;
            this.frameCounter = 0;
        }
    }

    draw(offsetX, offsetY){
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d', {willReadFrequently: true, alpha: true});
        // Desenha hitbox
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(this.x - offsetX, y - offsetY, this.w, getPlayerHeight());

        // SPRITE
        const { spriteX, spriteY } = this.getSprite();

        ctx.save();

        
        if(this.isInvencible 
            && this.invencibleFrames < this.invencibleFramesMax
        ) {
            this.invencibleFrames++;

            ctx.save();
            ctx.globalAlpha = 0.8;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(252, 252, 252, 1)";
        }

        // Define sprite
        const srcPlayer = this.haveVaria ? this.personagemImgVaria : this.personagemImg;

        if (this.direction === "L") {
            ctx.scale(-1, 1);
            ctx.translate(-70 - this.x, this.y);

            ctx.drawImage(
                srcPlayer,
                spriteX, spriteY, this.SPRITE_SHEET_SIZE, this.SPRITE_SHEET_SIZE,
                offsetX - (this.w * .5), - offsetY - (this.getPlayerHeight() *.2),
                this.w * 2.5, this.getPlayerHeight() + (this.getPlayerHeight() *.2)
            );
        } else {
            ctx.drawImage(
                srcPlayer,
                spriteX, spriteY, this.SPRITE_SHEET_SIZE, this.SPRITE_SHEET_SIZE,
                this.x - offsetX - (this.w * .65), this.y - offsetY - (this.getPlayerHeight() *.2),
                this.w * 2.5, this.getPlayerHeight() + (this.getPlayerHeight() *.2)
            );
        }

        ctx.restore();
    }

    takeDmg(dmg, options = {}){
        if(!this.isInvencible){

            if (this.hp.current > 0) {
                this.hp.current -= dmg;
                if (this.hp.current < 0) this.hp.current = 0;
            }

            // Define tempo de invencibilidade
            this.isInvencible = true;
            setTimeout(() => {
                this.isInvencible = false;
                this.invencibleFrames = 0;
                this.isInvencible = false;
            }, options.dmgTimeout || 500);

            // Som de dano
            const hitSound = document.getElementById("hitSound");
            hitSound.volume = 0.3;
            hitSound.currentTime = 0;
            hitSound.play();

            // Recuo de dano
            if(options.knockBack){
                console.log("Foi pra tras");
                this.isKB = true;
                
                // if(this.vx > 0) this.vx = KNOCKBACK_FORCE;
                // else if(this.vx <= 0) this.vx = -KNOCKBACK_FORCE;
                setTimeout(() => {
                    this.isKB = false;
                }, 500)
            }
        }
    }

    respawnPlayer(ACTUAL_SCREEN) {
        this.x = ACTUAL_SCREEN.playerStart.x;
        this.y = ACTUAL_SCREEN.playerStart.y;
        this.vx = 0;
        this.vy = 0;

        this.isBall = false;
        this.inWall = false;
        this.isJumping = false;

        // Perde uma vida
        this.takeDmg(1);
    }

    // ======================== AUXILIARES ======================
    checkPlayerCollision(ACTUAL_SCREEN) {
        const topY = this.y;
        const midY = this.y + this.getPlayerHeight() / 2;
        const botY = this.y + this.getPlayerHeight() - 1;

        if (this.vx > 0
            && (
                this.isSolid(this.x + this.w, midY, false, ACTUAL_SCREEN)
                || this.isSolid(this.x + this.w, topY, false, ACTUAL_SCREEN)
                || this.isSolid(this.x + this.w, botY, false, ACTUAL_SCREEN)
            ))
        {
            // Colidiu com a parede direita
            this.x = Math.floor((this.x + this.w) / this.TILE_SIZE) * this.TILE_SIZE - this.w - 0.01;
            this.inWall = true;
        } else {
            this.inWall = false;
        }
        if (this.vx < 0
            && (
                this.isSolid(this.x, midY, false, ACTUAL_SCREEN)
                || this.isSolid(this.x, topY, false, ACTUAL_SCREEN)
                || this.isSolid(this.x, botY, false, ACTUAL_SCREEN)
            ))
        {
            // Colidiu com a parede esquerda 
            this.x = Math.floor((this.x) / this.TILE_SIZE + 1) * this.TILE_SIZE + 0.01;
            this.inWall = true;
        } else {
            this.inWall = false;
        }

        // Movimento vertical
        this.y += this.vy;

        // --- NOVA LÓGICA DE COLISÃO VERTICAL COM SUPORTE A RAMPAS ---
        // Vamos checar a posição dos "pés" em 3 pontos: esquerda, centro, direita
        const feetY = this.y + this.getPlayerHeight();
        const sampleXs = [
            this.x + 2, // pequeno offset para evitar bordas exatas
            this.x + this.w / 2,
            this.x + this.w - 2
        ];

        let snappedToGround = false;

        for (let sx of sampleXs) {
            const { tileX, tileY } = this.getTileXY(sx, feetY + 1);
            const tile = ACTUAL_SCREEN.map[tileY]?.[tileX];

            if (!tile || this.TILES_BG.includes(tile)) {
                continue;
            }
            // tile sólido normal (ex: 1)
            // se houver um tile sólido logo abaixo dos pés, snap ao topo do tile
            const tileTopY = tileY * this.TILE_SIZE;
            if (feetY > tileTopY) {
                this.y = tileTopY - this.getPlayerHeight();
                this.vy = 0;
                this.grounded = true;
                snappedToGround = true;
                break;
            }
        }

        if (!snappedToGround) {
            // checar se colidiu com teto (mantive sua lógica)
            if (
                this.isSolid(this.x, this.y, false, ACTUAL_SCREEN) // Canto superior esquerdo
                || this.isSolid(this.x + this.w, this.y, false, ACTUAL_SCREEN) // Canto superior direito
            ) {
                this.y = Math.floor(this.y / this.TILE_SIZE + 1) * this.TILE_SIZE + 0.01;
                this.vy = 0;
                this.grounded = false;
            } else {
                this.grounded = false;
            }
        }
    }

    isSolid(x, y, ignoreY = false, ACTUAL_SCREEN) {
        const tileX = Math.floor(x / this.TILE_SIZE);
        const tileY = Math.floor(y / this.TILE_SIZE);
        const tile = ACTUAL_SCREEN.map[tileY]?.[tileX];
        // Tiles inexistentes contam como sólidos (evita cair fora do mapa)
        if (tile === undefined) return true;

        // Tile 0 = ar (não sólido)
        if (this.TILES_BG.includes(tile)) return false;

        return true;
    }

    getTileXY(x, y) {
        return {
            tileX: Math.floor(x / this.TILE_SIZE),
            tileY: Math.floor(y / this.TILE_SIZE)
        };
    }

    getSprite() {
        let spriteX = 0;
        let spriteY = 0;

        if(this.getItem){
            spriteX = 0; 
            spriteY = this.SPRITE_SHEET_SIZE * 4;
        }else{

            if (this.isJumping) {
                // JUMP
                spriteX = 0;
                spriteY = this.SPRITE_SHEET_SIZE * 3;
            } else if (!this.isJumping && !this.grounded) {
                // FALLING
                spriteX = ((this.frame - 1) * this.SPRITE_SHEET_SIZE) + this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 3;

            } else if (this.isRunning && this.isWalking) {
                // RUNNING
                spriteX = this.frame * this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 2;

            } else if (this.isBall && this.isWalking) {
                // CROUNCH WALKING
                spriteX = this.frame * this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 5;

            } else if (this.isBall && !this.isWalking) {
                // CROUNCH
                spriteX = 0;
                spriteY = this.SPRITE_SHEET_SIZE * 5;

            } else if (this.isWalking) {
                // WALKING
                spriteX = this.frame * this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 1;
            } else if (false) {
                // MID
                // spriteX = 570 + 30;
                // spriteY = 90;

            } else if (this.isMeditating) {
                // MEDITATING
                spriteX = this.frame * this.SPRITE_SHEET_SIZE;
                spriteY = this.SPRITE_SHEET_SIZE * 6;
            } else {
                // STAND
                spriteX = this.frame * this.SPRITE_SHEET_SIZE; 
                spriteY = this.SPRITE_SHEET_SIZE * 0;
            }
        }

        return { spriteX, spriteY };
    }

    getPlayerHeight() {
        return this.isBall ? this.h / 2 : this.h;
    }

    useUpForce(ACTUAL_SCREEN){
        // Deixar colocar apenas 1
        if(!this.haveUpForce) return;

        const now = performance.now();
        const cooldown = 200; // 1 segundo

        if (!this.springPressed || now - this.springPressed > cooldown) {
            this.springPressed = now;

            if(this.tempObjects.length > 0) {
                this.tempObjects = [];

            }else{

                // Define local 
                const adjustX = this.direction == "R" ? 80 : -100;

                // Checa se é possível colocar spring
                const canPlace = this.isSolid(this.x + adjustX, this.y, false, ACTUAL_SCREEN);

                if(!canPlace){
                    this.tempObjects = [new Object({
                        name: "Spring",
                        color: "blue",
                        sprite: {
                            width: 18 * 3,
                            height: 18 * 3,
                            src: "/assets/imgs/items.png", // Caminho para a imagem do sprite
                            cutW: 0,
                            cutH: (18 * 3) * 7,
                            frame: 0, // Quadro atual do sprite
                            frameMax: 10, // Total de quadros do sprite
                            frameTime: 5, // Tempo por quadro (em frames de jogo)
                            frameCounter: 0 // Contador de tempo para animação
                        },
                        x: this.x + adjustX,
                        y: this.y,
                        w: 80,
                        h: 80,
                        onTouch: (player) => {
                            player.vy = -30;
                        },
                    })];
                }
            }
            


        }
    }
}

export default Player;