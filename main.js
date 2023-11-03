const getElem = s => document.querySelector(s);


(function(){
    console.log('%cPOXA VIDA, NAO VALE COLAAAAAAR!!!!!', 'color: #AA4DBE; font-size: 30px; font-weight: bold')

    // Lock
    const senhaLock = getElem('#senha-pag');
    if(senhaLock){
        senhaLock.addEventListener('keyup', function(e){
            const v = e.target.value;
            if(v == SENHA_LOCK){
                getElem('#lock').remove();
                startConfetti();
            }
        })
    }

    
    const dica1 = getElem('#dica1');
    if(dica1){
        dica1.addEventListener('click', function(){
            const r = prompt('Sempre uma pessoa muito Vitoriosa...\nQuantas Vitorias será que cabem numa imagem?');
            if(r == DICA_UM_RESP){
                alert('Pra uma página de uma imagem até que esse projeto tem muitos ASSETS né?!')
            }
            console.log(r);
        });
    }


})();