class Enemy {

    constructor({name, hp, x, y, w, h, attack, color, spriteImg, knockBack = true, dmgTimeout =500}){
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
    }

    update(){
        // Lógica do inimigo
    }

    draw(ctx, canvas, offset){
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - offset.x, this.y - offset.y,
            this.w, this.h
        );
        
    }

    onTouch(player){
        player.takeDmg(this.attack, {knockBack: this.knockBack, dmgTimeout: this.dmgTimeout});
    }

}

export default Enemy;