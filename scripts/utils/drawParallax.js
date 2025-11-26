const drawParallax = (layers, ctx, canvas, {position}) =>{
    layers.forEach((layer, i) => {
        layer.offsets -= layer.speed;
        const w = layer.sizeFinal.w;
        if (layer.offsets <= -w) layer.offsets = 0;

        ctx.drawImage(
            layer.img,
            position.x + layer.offsets, position.y,
            layer.sizeFinal.w, layer.sizeFinal.h
        );
        ctx.drawImage(
            layer.img,
            position.x + layer.offsets + w, position.y,
            layer.sizeFinal.w, layer.sizeFinal.h);
    });
}

export default drawParallax;