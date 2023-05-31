/*Capturamos los elementos del DOM*/ 
const score=document.getElementById("scores");
const cardStart=document.getElementById("card-start");
const gameArea=document.getElementById("game-area");
/*hacemos que el card-start nos funcione como un botón para iniciar el juego y inicie la función start*/
cardStart.addEventListener('click',start);
/*Se inicializan dos objetos una para el movimiento del teclado y otro para la velocidad y puntuación del jugador*/
let player={
    velocity:10,
    score:0
};
let keys ={
    ArrowUp:false,
    ArrowRight:false,
    ArrowDown:false,
    ArrowLeft:false
}
/*Nos permite escuchar el click del keydown y realizar la función keydown*/
document.addEventListener('keydown',keyDown);
/*Nos permite escuchar el click del keyup y realizar la función keyup*/
document.addEventListener('keyup',keyUp);
/*Capturamos el movimiento de las teclas */
function keyDown(evento){
    //evita que se reinicié la página
    evento.preventDefault();
    keys[evento.key]=true;
    /*console.log(e.key);
    console.log(keys);*/
}
function keyUp(evento){
    evento.preventDefault();
    keys[evento.key]=false;
    /*console.log(e.key);
    console.log(keys);*/
}
/*a que se reinicie el juego cada vez que colisiona */
function colisionar(a,b){
    aRectangulo=a.getBoundingClientRect();
    bRectangulo=b.getBoundingClientRect();
    return !((aRectangulo.bottom<bRectangulo.top)||(aRectangulo.top>bRectangulo.bottom)||(aRectangulo.right<bRectangulo.left)||(aRectangulo.left>bRectangulo.right))
}
/*movimiento en la linea en la pantalla */
function movimientoLinea(){
    let lines=document.querySelectorAll('.lines');
    lines.forEach(function(item){
        if(item.y >=650){
            item.y-=740;
        }
        item.y+=player.velocity;
        item.style.top=item.y+"px";
    })
}
/*oculta el mensaje origial y muestra uno distinto */
function finJuego(){
    player.start=false;
    cardStart.classList.remove('hide');
    cardStart.innerHTML="Fin del juego <br> Puntuación final:"+player.score+" "+"<br>Pulsa de nuevo para volver a empezar";
}
//valocidad y posicion de los carros enemigos
function movimientoEnemigo(car){
    let enemy=document.querySelectorAll('.enemy');
    enemy.forEach(function(item){

        if(colisionar(car,item)){
            //console.log("Bang!");
            console.log(item);
            finJuego();
        }
        if(item.y >=750){
            item.y=-300;
            item.style.left=Math.floor(Math.random()*350)+"px";
        }
        item.y+=player.velocity;
        item.style.top=item.y+"px";
    })
}

function jugar(){
    //console.log("here we go");
    //se captura la clase
    let car=document.querySelector('.car');
    //es para que lo que se encuentre div se devuelve a la posición original
    let road=gameArea.getBoundingClientRect();
    /*console.log(road);*/
    if(player.start){
        movimientoLinea();
        movimientoEnemigo(car);
        /*si el objeto keys cumple alguna de estás funciones no podrá salir de los términos de longitud dados */
        if(keys.ArrowUp && player.y>(road.top+200)){
            player.y-=player.velocity
        }
        if(keys.ArrowDown && player.y<(road.bottom-200)){
            player.y+=player.velocity
        }
        if(keys.ArrowLeft && player.x>0 ){
            player.x-=player.velocity
        }
        if(keys.ArrowRight && player.x<(road.width-80)){
            player.x+=player.velocity
        }
        /*agregamos las posisicones de top y left en px a los atibutos del div */
        car.style.top=player.y+"px";
        car.style.left=player.x+"px";
        //EJECUTAR hasta que la función lo diga
        window.requestAnimationFrame(jugar);
        //puntuación de player se incrementa para generar la puntuación real e inicia en 1
        player.score++;
        //puntuación de player se decrementa en 1 para la puntuación real
        let ps=player.score-1;
        //console.log(player.score++);
        //console.log(ps)
        //aparece en pantalla
        score.innerText=" Puntaje: "+ps;
    }
}

function start(){
    //gameArea.classList.remove('hide');
    cardStart.classList.add('hide');
    gameArea.innerHTML="";
    player.start=true;
    player.score=0;
    //se rquiere realizar una animatiom
    window.requestAnimationFrame(jugar);
    /*este for nos va ayudar con la separación de las líneas */
    for(x=0;x<5;x++){
        //se crea un elemento div para las lineas
        let roadLine=document.createElement('div');
        //se crea una clase para el div
        roadLine.setAttribute('class','lines');
        //creamos la brecha entre las líneas
        roadLine.y=(x*150);
        //agregamos un atributo a la etiqueta div llamada top y le damos un valor
        roadLine.style.top=roadLine.y+"px";
        //agregamos el div al gameArea
        gameArea.appendChild(roadLine);
    }
    //creamos un div para el carro
    let car=document.createElement('div');
    //agregamos un atributo al div del car
    car.setAttribute('class','car');
    //agregamos el carro al gameArea
    gameArea.appendChild(car);
    //posicion del carro y utilizamos una propiedad para devolverlo a su punto inicial
    player.x=car.offsetLeft;
    player.y=car.offsetTop;
    /*creamos al enemigo */
    for(x=0;x<3;x++){
        let enemyCar=document.createElement('div');
        enemyCar.setAttribute('class','enemy');
        //nos ayuda a posicionar muchos carros con un solo div
        enemyCar.y=((x+1)*350)*-1;
        //cambia el valor del atributo
        enemyCar.style.top=enemyCar.y+"px";
        //cambia el color del carro
        enemyCar.style.backgroundColor=randomColor();
        //cambia el valor del atributo y se juega con el random para que no sea fija
        enemyCar.style.left=Math.floor(Math.random()*350)+"px";
        //agrega los carritos al game
        gameArea.appendChild(enemyCar);
    }
}
function randomColor(){
    function c(){
        let hex=Math.floor(Math.random()*256).toString(16);
        console.log(hex)
        return ("0"+String(hex)).substr(-1);
    }
    return "#"+c()+c()+c();
}
