const TILE_SIZE = 65;

class Boss {

    START = false;

    KNOCKBACK_FORCE = 20;

    ATTK_INTERVAL = 120;
    COUNT = 0;

    TARGET = {x: null, y: null};

    SPEED_LIMIT = {
        x: 20,
        y: 20
    }

    DMG_TIMEOUT = 500;


    // ACTIONS
    // S - Stand
    // A - Attacking
    // D - Take Dmg
    // L - Move Left
    // R - Move Right
    ACTION_FLOW = ['L', 'S', 'A', 'R', 'S', 'A'];
    CURRENT_ACTION = 0;

    STAND_INTERVAL = 80;

    CURRENT_INTERVAL = 0;

    LEFT_POS = {
        x: TILE_SIZE * 3,
        y: TILE_SIZE * 5
    };

    RIGHT_POS = {
        x: TILE_SIZE * 19.5,
        y: TILE_SIZE * 5
    };

    FIRST_EXEC = true;



    // Parado - 2s
    // andando - 6s
    // Ataca - 6s
    // Dano - 1s

    FRAME_COUNTER = 0;
    FRAME_MAX = 10;
    FRAME_TIME = 5;
    FRAME_TIME_COUNTER = 0;



    constructor({name, hp, x, y, w, h, attack, color, spriteImg, knockBack = true, dmgTimeout =500, onDefeated, condition, Game}){
        this.name = name;
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.attack = attack;
        this.color = color;
        this.knockBack = knockBack;
        this.dmgTimeout = dmgTimeout;
        this.onDefeated = onDefeated;

        this.vx = 0;
        this.vy = 0;
        this.acceleration = .5; // pode ajustar

        this.bossImg = new Image();
        this.bossImg.src = "../assets/imgs/boss.png";

        this.GAME = Game;
    }

    condition(){
        return this.hp.current > 0;
    }

    nextAction(){
        this.CURRENT_ACTION = this.CURRENT_ACTION + 1 > this.ACTION_FLOW.length - 1 ? 0 : this.CURRENT_ACTION + 1;

        this.FIRST_EXEC = true;
    }

    update(ctx, canvas, player){
        // Lógica do inimigo
        if(!this.START) return;


        // VERIFICA QUAL AÇÃO DO FLUXO
        switch (this.ACTION_FLOW[this.CURRENT_ACTION]){
            case 'S':
                this.standAction();
                break;
            case 'A':
                this.attackAction(player);
                break;
            case 'L':
                this.moveLeftAction();
                break;
            case 'R':
                this.moveRightAction();
                break;
            case 'D':
                this.takeDmgAction();
                break;
        }        

    }

    // if(this.COUNT >= this.ATTK_INTERVAL){
    //         this.TARGET.x = player.x;
    //         this.TARGET.y = player.y;

    //         this.COUNT = 0;
    //     }else{
    //         this.COUNT++;
    //     }

    standAction(){
        this.vx = 0;
        this.vy = 0;

        if(this.CURRENT_INTERVAL < this.STAND_INTERVAL){
            this.CURRENT_INTERVAL++;
        }else{
            this.nextAction();
            this.CURRENT_INTERVAL = 0;
        }
    }

    attackAction(player){
        if (this.FIRST_EXEC){
            this.TARGET.x = player.x;
            this.TARGET.y = player.y;

            this.FIRST_EXEC = false;
        };

        this._moveAction();
    }

    moveLeftAction(){
        if (this.FIRST_EXEC){
            this.TARGET = this.LEFT_POS;

            this.FIRST_EXEC = false;
        }

        this._moveAction();
    }

    moveRightAction(){
        if (this.FIRST_EXEC){
            this.TARGET = this.RIGHT_POS;

            this.FIRST_EXEC = false;
        }
        
        this._moveAction();
    }

    takeDmgAction(){

    }


    _moveAction() {
        const dx = this.TARGET.x - this.x;
        const dy = this.TARGET.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) {
            this.vx = 0; this.vy = 0;
            this.nextAction();
            return;
        }

        const maxSpeed = Math.min(this.SPEED_LIMIT.x, this.SPEED_LIMIT.y); // defina um scalar de velocidade
        const slowingRadius = 60; // ajustar: raio onde começa a desaceleração
        const nx = dx / dist;
        const ny = dy / dist;

        // desired speed reduz dentro do slowingRadius
        let desiredSpeed = maxSpeed;
        if (dist < slowingRadius) {
            desiredSpeed = maxSpeed * (dist / slowingRadius); // proporcional à distância
            // opcional: clamp para um mínimo, por ex. 1 pixel por frame
            desiredSpeed = Math.max(desiredSpeed, 0.5);
        }

        // calcula desired velocity
        const desiredVX = nx * desiredSpeed;
        const desiredVY = ny * desiredSpeed;

        // steering = desired - current velocity (aplica aceleração limitada)
        const steerX = desiredVX - this.vx;
        const steerY = desiredVY - this.vy;

        // limitamos a intensidade do steer pela sua aceleração (evita mudanças instantâneas)
        const steerMag = Math.hypot(steerX, steerY);
        if (steerMag > 0) {
            const maxAccel = this.acceleration; // quanto pode mudar por frame
            const sx = (steerX / steerMag) * Math.min(steerMag, maxAccel);
            const sy = (steerY / steerMag) * Math.min(steerMag, maxAccel);
            this.vx += sx;
            this.vy += sy;
        }

        // clampa velocidade por magnitude
        const speed = Math.hypot(this.vx, this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        // move
        this.x += this.vx;
        this.y += this.vy;

        // snap final
        if (dist < 1.5) {
            this.x = this.TARGET.x;
            this.y = this.TARGET.y;
            this.vx = 0; this.vy = 0;
            this.nextAction();
        }
    }






    draw(ctx, canvas, offset){

        ctx.save();

        // AREA DE DANO
        // ctx.fillStyle = "red";
        // ctx.fillRect(
        //     this.x - offset.x, this.y - offset.y,
        //     this.w, 20
        // );

        // //Resto do corpo        
        // ctx.fillStyle = this.color;
        // ctx.fillRect(
        //     this.x - offset.x, this.y - offset.y + 20,
        //     this.w, this.h + 20
        // );

        const {frameX, frameY} = this.getDrawFrame();

        ctx.drawImage(
            this.bossImg,
            frameX, frameY, 
            32 * 5, 32 * 5,
            this.x - offset.x - this.w * .2, this.y - offset.y - this.h * .2,
            this.w * 1.4, this.h * 1.4
        )

        
        if(!this.START) return;
        // Desenha vida do Boss
        ctx.fillStyle = "#665e5eff";
        ctx.strokeStyle = "#19191bff";
        ctx.lineWidth = 10;
        ctx.strokeRect(
            canvas.width * 0.94, canvas.height * 0.1,
            canvas.width * 0.04, canvas.height * 0.7
        )

        ctx.fillRect(
            canvas.width * 0.94, canvas.height * 0.1,
            canvas.width * 0.04, canvas.height * 0.7
        );


        //Barra de vida
        const percentual = (this.hp.current * 100) / this.hp.max;
        console.log("VIDA %: ", percentual);
        
        ctx.fillStyle = "#ec2424ff";
        ctx.fillRect(
            canvas.width * 0.94, canvas.height * 0.1 + ((canvas.height * 0.7) * (1 - percentual/100)),
            canvas.width * 0.04, (canvas.height * 0.7) * (percentual/100)
        );

        ctx.restore();
        
    }

    getDrawFrame(){

        let frameX = 32 * 5;
        let frameY = 32 * 5 * 0;

        if(this.isInvencible){
            // Dmg Left
            frameX = 0;
            frameY = 32 * 5 * 3;
    
            // Dmg Right
        }else{

            // Stand
            if(this.vx < 4 && this.vx > -4
                && this.vy < 4 && this.vy > -4
            ){
                frameY = 32 * 5 * 0;
            }
    
            // Go left
            if(this.vx < -4){
                frameY = 32 * 5 * 2;
            }
    
            // Go Right
            if(this.vx > 4){
                frameY = 32 * 5 * 1;
            }
    
            
    
            if(this.FRAME_TIME_COUNTER < this.FRAME_TIME){
                this.FRAME_TIME_COUNTER++;
            }else{
                this.FRAME_TIME_COUNTER = 0;
                if(this.FRAME_COUNTER < this.FRAME_MAX-1){
                    this.FRAME_COUNTER++;
                }else{
                    this.FRAME_COUNTER = 0;
                }            
            }

            frameX = frameX * this.FRAME_COUNTER;
        }


        return {
            frameX,
            frameY
        }
    }

    takeDmg(dmg){

        if(!this.isInvencible){

            if (this.hp.current > 0) {
                this.hp.current -= dmg;
                if (this.hp.current < 0) this.hp.current = 0;
            }

            // PARA DE ANDAR 
            this.vx = 0;
            this.vy = 0;

            // Define tempo de invencibilidade
            this.isInvencible = true;
            setTimeout(() => {
                this.isInvencible = false;
                this.invencibleFrames = 0;
                this.isInvencible = false;
                this.nextAction();
            }, this.DMG_TIMEOUT || 500);

            // Som de dano
            const hitSound = document.getElementById("hitBoss");
            hitSound.volume = 0.1;
            hitSound.currentTime = 0;
            hitSound.play();

            // Recuo de dano
            this.isKB = true;
            
            if(this.vx > 0) this.vx = -this.KNOCKBACK_FORCE;
            else if(this.vx <= 0) this.vx = this.KNOCKBACK_FORCE;

            if(this.vy > 0) this.vy = -this.KNOCKBACK_FORCE;
            else if(this.vy <= 0) this.vy = this.KNOCKBACK_FORCE;
            setTimeout(() => {
                this.isKB = false;
            }, 500);
        }

        // Verifica se morreu
        if(this.hp.current <= 0 ) return this.onDefeated(this.GAME);
    }

    checkTopCollision(player) {

        const tolerance = 10;

        const topY = this.y;          // início do topo
        const topHeight = 50;         // área válida para pisar
        const topEnd = topY + topHeight;

        const feet = player.y + player.h;

        const horizontally =
            player.x + player.w > this.x &&
            player.x < this.x + this.w;

        // Garantir que o player está caindo
        const falling = player.vy > 0;

        // A colisão com o topo ocorre se o pé entrar na faixa [topY, topEnd]
        const hitTop =
            horizontally &&
            falling &&
            feet >= topY &&                      // pé desceu até o topo
            (feet - player.vy) <= topEnd + tolerance; // no frame anterior estava acima da faixa

        return hitTop;
    }



    onTouch(player){
        
        if(!this.START) return;

        // Verifica quem toma o dano
        if(this.checkTopCollision(player)){
            // Boss            
            player.vy = -10;
            this.takeDmg(5);
        }else{
            // Player
            // console.log("Pegou");
            player.takeDmg(this.attack, {knockBack: this.knockBack, dmgTimeout: this.dmgTimeout});

        }
    }

}

export default Boss;