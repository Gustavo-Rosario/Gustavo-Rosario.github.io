class Object {

    constructor({name, x, y, w, h, color, spriteImg, onTouch, onTouchLeave}){
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.onTouch = onTouch;
        this.onTouchLeave = onTouchLeave;
    }

    update(){
        
    }

    draw(ctx, canvas, offset){
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - offset.x, this.y - offset.y,
            this.w, this.h
        );
        
    }

    onTouch(player){
        this.onTouch(player)
    }

}

export default Object;