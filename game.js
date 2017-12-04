
//////////////////////////////////////////////////////////////INICIALIZACIÓN DE VARIABLES



function obtener_localStorage(puntuacion){
				
					let punt_prueba = localStorage.getItem("highscore");
					punt_prueba = JSON.parse(punt_prueba);
					//console.log(punt_prueba[5] + "Jug1");
					
					
					
					if (puntuacion > punt_prueba[9]){
							punt_prueba[9]=puntuacion;
					}
					
					var aux = 0;
					var intercambiado = true;
					while (intercambiado){
						intercambiado = false;
						for (var i = 0; i<10-1; i++){
							if(punt_prueba[i]<punt_prueba[i+1]){
								aux = punt_prueba[i];
								punt_prueba[i] = punt_prueba[i+1];
								punt_prueba[i+1]= aux;
								intercambiado = true;
							}
						}
					}
					
					console.log (punt_prueba);
					localStorage.setItem("highscore", JSON.stringify(punt_prueba));
					return punt_prueba;
				}
////////////////////////////////////////////////////SPRITES

var pjImg = new Image();
pjImg.src = "Sprites/Prota.png";

var pjShieldImg = new Image();
pjShieldImg.src = "Sprites/ProtaShield.png";

var skeletonImg = new Image();
skeletonImg.src = "Sprites/Skeleton.png";

var vampireImg = new Image();
vampireImg.src = "Sprites/Vampire.png";

var demonImg = new Image();
demonImg.src = "Sprites/Demon.png";

var fireMobImg = new Image();
fireMobImg.src = "Sprites/Firemob.png";

var fireImg = new Image();
fireImg.src = "Sprites/Fire.png";

var coinImg = new Image();
coinImg.src = "Sprites/Coin.png";

var bootImg = new Image();
bootImg.src = "Sprites/Boots.png";

var shieldImg = new Image();
shieldImg.src = "Sprites/Shield.png";

var fondoImg = new Image();
fondoImg.src = "Interfaz/Mapa1.png";

//////////////////////////ARRAYS DE ENEMIGOS Y OBJETOS

var skeletons = [];
var vampires = [];
var demons = [];
var fireMobs = [];
var fires = [];
var coins = [];
var boots = [];
var shields = [];

//////////////////////////VARIABLES PÚBLICAS NECESARIAS

var id = 0;
var speed = 3;
var shieldTimer = 5;
var shieldCollision = false;
var shieldActive = false;
var firstShield = false;

var pause = false;
var lock = 0;

var RestartByGover = false;
var nextLevel = false;
var salir = false;
var quiereSalir = false;
var contMonedas = 0;
var contVidas = 0;

function Restart(numVidasActual, RestartByGover){
	skeletons = [];
	vampires = [];
	demons = [];
	fireMobs = [];
	fires = [];
	coins = [];
	boots = [];
	shields = [];

	id = 0;
	speed = 3;
	shieldTimer = 5;
	shieldCollision = false;
	shieldActive = false;
	firstShield = false;

	lock = 0;
	
	pj.lifes = 3;
	pj.score = 0;
	
	
	toSecond=20;
	$('#Ctimer').empty();
	$('#Ctimer').append(toMinute+":"+ toSecond);
	
	
	console.log("Entra en la de restart");
	console.log(RestartByGover);
	console.log(numVidasActual + "HASKDHASKDWWQE");
	if(RestartByGover && !quiereSalir){
		$("#divVidasContenedor").append('<img id="imgVida3" src="Interfaz/heart.gif">');
		$("#divVidasContenedor").append('<img id="imgVida2" src="Interfaz/heart.gif">');
		$("#divVidasContenedor").append('<img id="imgVida1" src="Interfaz/heart.gif">');
	}
	switch(numVidasActual) {
    case 3:
        break;
    case 2:
        $("#divVidasContenedor").append('<img id="imgVida3" src="Interfaz/heart.gif">');
        break;
	case 1:
        $("#divVidasContenedor").append('<img id="imgVida3" src="Interfaz/heart.gif">');
		$("#divVidasContenedor").append('<img id="imgVida2" src="Interfaz/heart.gif">');
        break;
    default:
        break;
		
	}

  //countDown();

}

//Sonido
var audioSelect = document.createElement('audio');
	audioSelect.setAttribute('src', 'Sonido/select.mp3');
	audioSelect.className = "sound";
var audioHit = document.createElement('audio');
	audioHit.setAttribute('src', 'Sonido/hit.mp3');
	audioHit.className = "sound";
var audioCoin = document.createElement('audio');
	audioCoin.setAttribute('src', 'Sonido/coin.mp3');
	audioCoin.className = "sound";
var audioBoots = document.createElement('audio');
	audioBoots.setAttribute('src', 'Sonido/boots.mp3');
	audioBoots.className = "sound";
var audioShield = document.createElement('audio');
	audioShield.setAttribute('src', 'Sonido/shield.mp3');
	audioShield.className = "sound";
var audioStart = document.createElement('audio');
	audioStart.setAttribute('src', 'Sonido/start.mp3');
	audioStart.className = "sound";
var audioPause = document.createElement('audio');
	audioPause.setAttribute('src', 'Sonido/pausa.mp3');
	audioPause.className = "sound";
var audioOver = document.createElement('audio');
	audioOver.setAttribute('src', 'Sonido/game over.mp3');
	audioOver.className = "sound";
var audioVictory = document.createElement('audio');
	audioVictory.setAttribute('src', 'Sonido/victory.mp3');
	audioVictory.className = "sound";

/////////////////////////////////////////////////////////////////////INICIALIZACIÓN DEL PROTOTIPO EL CUAL VAN A SEGUIR TODOS LOS PJS

function sprite (options) {
  var that = {},
      tickCount = 0,
      numberOfFramesX = options.numberOfFramesX || 9,
      numberOfFramesY = options.numberOfFramesY || 4;
  that.frameIndex = 1;
  that.ticksPerFrame = options.ticksPerFrame;
  that.context = options.context;
  that.width = options.width;
  that.height = options.height;
  that.imgWidth = options.imgWidth;
  that.imgHeight = options.imgHeight;
  that.xPos = options.xPos;
  that.yPos = options.yPos;
  that.xSpeed = options.xSpeed;
  that.ySpeed = options.ySpeed;
  that.dir = options.dir;
  that.stop = options.stop;
  that.image = options.image;
  that.count = options.count;
  that.lifes = 3;
  that.score = 0;

  ////////////////////////////////////////////////////////////////////////////FUNCIÓN QUE RENDERIZA CADA PJ

  that.render = function (){  
    if(numberOfFramesY > 1){
      that.context.drawImage(
      that.image,
      that.frameIndex * that.width / numberOfFramesX,    //xPos en la imagen
      that.dir * that.height / numberOfFramesY,   //yPos en la imagen
      that.width / numberOfFramesX,   //width en la imagen
      that.height / numberOfFramesY,  //height en la imagen
      that.xPos,  //xPos en el canvas
      that.yPos,  //yPos en el canvas
      50,    //Animation width
      50);   //Animation height
    }else{
      that.context.drawImage(
      that.image,
      that.frameIndex * that.width / numberOfFramesX,    //xPos en la imagen
      that.dir * that.height / numberOfFramesY,   //yPos en la imagen
      that.width / numberOfFramesX,   //width en la imagen
      that.height / numberOfFramesY,  //height en la imagen
      that.xPos,  //xPos en el canvas
      that.yPos,  //yPos en el canvas
      35,    //Animation width
      35);   //Animation height
    }
  };
  
  ////////////////////////////////////////////////////////////////////FUNCIÓN QUE CONTROLA LA VELOCIDAD CON QUE AVANZA LA ANIMACIÓN DEL SPRITE  
  
  that.update = function () {
    tickCount += 1;
    
    if(tickCount > that.ticksPerFrame){
      tickCount = 0;
      
      if(that.frameIndex < numberOfFramesX - 1 && that.stop == false){
        that.frameIndex += 1;
      }else{
        that.frameIndex = 1;
      }
    }
    
  };

  //////////////////////////////////////////////////////////COMPRUEBAN SI LOS PJS CONTROLADOS POR CPU PUEDEN SEGUIR AVANZANDO O MUEREN


  that.checkSkeleton = function(){
    var die = false;

    if(that.xSpeed > 0){
      if (that.xPos > body.offsetWidth * 0.41666667 - 50){
        die = true;
      }
    }else{
      if(that.xPos <3){
        die = true;
      }
    }
    if(that.ySpeed > 0){
      if (that.yPos >body.offsetHeight * 0.63224447 - 50){
        die = true;
      }
    }else{
      if(that.yPos <3){
        die = true;
      }
    }

    return die;
  };

  that.checkDemon = function(){
    var die = false;
    if(that.xSpeed > 0){
      if (that.xPos > body.offsetWidth * 0.41666667 - 50){
        that.xSpeed = -that.xSpeed;
      }
    }else{
      if(that.xPos <3){
        that.xSpeed = -that.xSpeed;
      }
    }

    if(that.ySpeed > 0){
      if (that.yPos >body.offsetHeight * 0.63224447 - 50){
        die = true;
      }
    }

    return die;
  };

  that.checkfireMob = function(){
    var die = false;

    if(that.xSpeed > 0){
      if (that.xPos > body.offsetWidth * 0.41666667 - 50){
        die = true;
      }
    }else{
      if(that.xPos < 3){
        die = true;
      }
    }
    if(that.ySpeed > 0){
      if (that.yPos >body.offsetHeight * 0.63224447 - 50){
        die = true;
      }
    }else{
      if(that.yPos < 3){
        die = true;
      }
    }

   if(that.count == 50){
      that.count = 0;

      /////////////////////////////////////////////////CREACIÓN DE LOS FUEGOS QUE SIGUEN AL FIREMOB

      var firemob = {};
      firemob.id = id;
      firemob.image = fireImg;
      firemob.xPos = that.xPos;
      firemob.yPos = that.yPos;
      firemob.frameIndex = 0;
      firemob.tickCount = 0;
      firemob.life = function(){
        setTimeout(function(){
          for(var i = 0; i < fires.length; i++){
            if(fires[i].id == firemob.id)
              fires.splice(i, 1);
          }
        }, 4000);
      };

      firemob.life();

      id++;

      switch (that.dir){
        case 0:
          that.dir = 1;
          that.xSpeed = -1;
          that.ySpeed = 0;
          break;
        case 1:
          that.dir = 0;
          that.xSpeed = 0;
          that.ySpeed = 1;
          break;
        case 2:
          that.dir = 3;
          that.xSpeed = 0;
          that.ySpeed = -1;
          break;
        case 3:
          that.dir = 2;
          that.xSpeed = 1;
          that.ySpeed = 0;
          break;
      }
      fires.push(firemob);
      
    }

    return die;
  };

  return that;
}

///////////////////////////////////////////////////////////////////CREACIÓN DEL CANVAS

var canvas = document.getElementById("pjAnimation");

var body = document.body;
console.log(body.offsetWidth);

/////TAMAÑO DEL CANVAS EN FUNCION DE TAMAÑO DE VENTANA

canvas.width = body.offsetWidth * 0.41666667;
canvas.height = body.offsetHeight * 0.6322444;

//////SI SE REDIMENSIONA LA VENTANA, SE VUELVE A REDIMENSIONAR EL CANVAS
window.addEventListener('resize', function(){
	console.log('resized');
	canvas.width = body.offsetWidth * 0.41666667;
  canvas.height = body.offsetHeight * 0.63224447;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,800,600);
  ctx.drawImage(fondoImg, 0, 0);
}, true);

////////////////////////////////////////////////////////////////////DEFINICIÓN DEL PJ PRINCIPAL

var pj = sprite ({
  context: canvas.getContext("2d"),
  ticksPerFrame: 5,
  frameIndex: 1,
  width: 274,
  height: 365,
  xPos: 350,
  yPos: 350,
  xSpeed: 0,
  ySpeed: 0,
  dir: 0,
  stop: true,
  numberOfFramesX: 3,
  numberOfFramesY:4,
  image: pjImg
});

/////////////////////////////////////////////////////////////////////////GAME LOOP

function gameLoop () {
 
  window.requestAnimationFrame(gameLoop);

  if(!pause){
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,800,600);
    ctx.drawImage(fondoImg, 0, 0);
    checkPosition(pj);
    for(var i = 0; i < skeletons.length; i++){
      if(skeletons[i] != null){
        checkPosition(skeletons[i]);
      }
    }
    for(var i = 0; i < vampires.length; i++){
      if(vampires[i] != null){
        checkPosition(vampires[i]);
      }
    }  
    for(var i = 0; i < demons.length; i++){
      if(demons[i] != null){
        checkPosition(demons[i]);
      }
    } 
    for(var i = 0; i < fireMobs.length; i++){
      if(fireMobs[i] != null){
        fireMobs[i].count += 1;
        checkPosition(fireMobs[i]);
      }
    }	
		
		pj.update();
		pj.render();

		checkShields();
		checkBoots();
		checkCoins();
		checkFires();
		checkSkeletons();
		checkVampires();
		checkDemons();
		checkfireMobs();
  }
  
}

///////////////////////////////////////////////////////////////////////FUNCIONES DE CHEQUEO DE TODAS LAS COLISIONES ENTRE PJS Y EL MAPA

function checkPosition(pjs){
  if(pjs.xSpeed > 0 && pjs.xPos <= body.offsetWidth * 0.41666667 - 50)
    pjs.xPos += pjs.xSpeed;
  if(pjs.xSpeed < 0 && pjs.xPos >= 3)
    pjs.xPos += pjs.xSpeed;
  if(pjs.ySpeed > 0 && pjs.yPos <= body.offsetHeight * 0.63224447 - 50)
    pjs.yPos += pjs.ySpeed;
  if(pjs.ySpeed < 0 && pjs.yPos >= 3)
    pjs.yPos += pjs.ySpeed;
}

function checkSkeletons(){
	for(var i = 0; i < skeletons.length; i++){
	    if(skeletons[i] != null){
	      if(intersectRect(
	        pj.yPos + 5,
          pj.yPos + 45,
	        pj.xPos + 12,
	        pj.xPos + 38,
	        skeletons[i].yPos,
	        skeletons[i].yPos + 50,
	        skeletons[i].xPos + 10,
	        skeletons[i].xPos + 40 || skeletons[i] != null))
	      {
          pj.image = pjImg;
          pj.lifes -= 1;
		  quitarVida(pj.lifes);
		  
		  if(pj.lifes == 0){
			      audioOver.play();
            endGame();
          }
          shieldCollision = true;
          console.log("Lifes: "+pj.lifes);
	        skeletons.splice(i, 1);
	      }else if(skeletons[i] != null){
	        if(skeletons[i].checkSkeleton()==true){
            skeletons.splice(i, 1);
          }else{
  	        skeletons[i].update();
  	        skeletons[i].render();
          }
	      }
	    }
	}
}

function checkVampires(){
  for(var i = 0; i < vampires.length; i++){
      if(vampires[i] != null){
        if(intersectRect(
          pj.yPos + 5,
          pj.yPos + 45,
          pj.xPos + 12,
          pj.xPos + 38,
          vampires[i].yPos + 5,
          vampires[i].yPos + 45,
          vampires[i].xPos + 10,
          vampires[i].xPos + 40 || vampires[i] != null))
        {
		      pj.lifes -= 1;
		      quitarVida(pj.lifes);
          if(pj.lifes == 0){
			      audioOver.play();  
            endGame();
          }
          pj.image = pjImg;
          shieldCollision = true;
          console.log("Lifes: "+pj.lifes);
          vampires.splice(i, 1);
        }else if(vampires[i] != null){
          if(vampires[i].checkSkeleton()==true){
            vampires.splice(i, 1);
          }else{
            vampires[i].update();
            vampires[i].render();
          }
        }
      }
  }
}

function checkDemons(){
  for(var i = 0; i < demons.length; i++){
      if(demons[i] != null){
        if(intersectRect(
          pj.yPos + 5,
          pj.yPos + 45,
          pj.xPos + 12,
          pj.xPos + 38,
          demons[i].yPos + 5,
          demons[i].yPos + 45,
          demons[i].xPos + 10,
          demons[i].xPos + 40 || demons[i] != null))
        {
		  pj.lifes -= 1;
		  quitarVida(pj.lifes);
          if(pj.lifes == 0){
			audioOver.play();
            endGame();
          }
          pj.image = pjImg;
          shieldCollision = true;
          console.log("Lifes: "+pj.lifes);
          demons.splice(i, 1);
        }else if(demons[i] != null){
          if(demons[i].checkDemon()==true){
            demons.splice(i, 1);
          }else{
            demons[i].update();
            demons[i].render();
          }
        }
      }
  }
}

function checkfireMobs(){
  for(var i = 0; i < fireMobs.length; i++){
      if(fireMobs[i] != null){
        if(intersectRect(
          pj.yPos + 5,
          pj.yPos + 45,
          pj.xPos + 12,
          pj.xPos + 38,
          fireMobs[i].yPos + 7,
          fireMobs[i].yPos + 43,
          fireMobs[i].xPos + 15,
          fireMobs[i].xPos + 35 || fireMobs[i] != null))
        {
		  pj.lifes -= 1;
		  quitarVida(pj.lifes);
          if(pj.lifes == 0){
			audioOver.play();
            endGame();
          }
          pj.image = pjImg;
          shieldCollision = true;
          console.log("Lifes: "+pj.lifes);
          fireMobs.splice(i, 1);
        }else if(fireMobs[i] != null){
          if(fireMobs[i].checkfireMob()==true){
            fireMobs.splice(i, 1);
          }else{
            fireMobs[i].update();
            fireMobs[i].render();
          }
        }
      }
  }
}

function checkFires(){
  for(var i = 0; i < fires.length; i++){
      if(fires[i] != null){
        if(intersectRect(
          pj.yPos + 5,
          pj.yPos + 45,
          pj.xPos + 12,
          pj.xPos + 38,
          fires[i].yPos + 7,
          fires[i].yPos + 43,
          fires[i].xPos + 15,
          fires[i].xPos + 35 || fires[i] != null))
        {
		  pj.lifes -= 1;
		  quitarVida(pj.lifes);
          if(pj.lifes == 0){
			audioOver.play();
            endGame();
          }
          shieldCollision = true;
          pj.image = pjImg;
          console.log("Lifes: "+pj.lifes);
          fires.splice(i, 1);
        }else if(fires[i] != null){
          fires[i].tickCount += 1;
    
          if(fires[i].tickCount > 3){
            fires[i].tickCount = 0;
            
            if(fires[i].frameIndex < 4 - 1){
              fires[i].frameIndex += 1;
            }else{
              fires[i].frameIndex = 0;
            }
            
          }
          pj.context.drawImage(
          fires[i].image,
          0,    //xPos en la imagen
          fires[i].frameIndex * 365 / 4,   //yPos en la imagen
          91,   //width en la imagen
          365 / 4,  //height en la imagen
          fires[i].xPos,  //xPos en el canvas
          fires[i].yPos,  //yPos en el canvas
          50,    //Animation width
          50);   //Animation height
        }
      }
  }
}

function checkCoins(){
  for(var i = 0; i < coins.length; i++){
      if(coins[i] != null){
        if(intersectRect(
          pj.yPos + 5,
          pj.yPos + 45,
          pj.xPos + 12,
          pj.xPos + 38,
          coins[i].yPos,
          coins[i].yPos + 35,
          coins[i].xPos,
          coins[i].xPos + 35 || coins[i] != null))
        {
          pj.score += 20;
		  contMonedas += 20;
		  audioCoin.play();
		  $('#puntuacionJ1').empty();
		  $('#puntuacionJ1').append("Puntuación: " + pj.score);
          console.log("Score: "+pj.score);
          coins.splice(i, 1);
        }else if(coins[i] != null){
          coins[i].update();
          coins[i].render();
        }
      }
  }
}

function checkBoots(){
  for(var i = 0; i < boots.length; i++){
      if(boots[i] != null){
        if(intersectRect(
          pj.yPos + 5,
          pj.yPos + 45,
          pj.xPos + 12,
          pj.xPos + 38,
          boots[i].yPos,
          boots[i].yPos + 35,
          boots[i].xPos + 7,
          boots[i].xPos + 28 || boots[i] != null))
        {
		  audioBoots.play();
          speed = 5;
          setTimeout(function(){
            speed = 3;
          }, 5000);
          boots.splice(i, 1);
        }else if(boots[i] != null){
          boots[i].render();
        }
      }
  }
}

function checkShields(){
  for(var i = 0; i < shields.length; i++){
      if(shields[i] != null){
        if(intersectRect(
          pj.yPos + 5,
          pj.yPos + 45,
          pj.xPos + 12,
          pj.xPos + 38,
          shields[i].yPos,
          shields[i].yPos + 35,
          shields[i].xPos,
          shields[i].xPos + 35 || shields[i] != null))
        {
          if(shieldActive == false){
            pj.lifes++;
            pj.image = pjShieldImg;
          }
		  audioShield.play();
          shieldTimer = 5;
          shieldActive = true;
          if(shieldTimer == 5 && firstShield == false){
            firstShield = true;
            shieldTimeout();
          } 
          shields.splice(i, 1);
        }else if(shields[i] != null){
          shields[i].render();
        }
      }
  }
}

function shieldTimeout(){
  if(shieldActive == true){
    shieldTimer = shieldTimer -1;
    if(shieldTimer < 0 && shieldCollision == true){
      pj.image = pjImg;
      shieldActive = false;
      shieldCollision = false;
    }else if(shieldTimer < 0 && shieldCollision == false){
      pj.lifes--;
      pj.image = pjImg;
      shieldActive = false;
    }
  }
  setTimeout("shieldTimeout()", 1000);
}

////////////////////////////////////////////////////////////////////////////////////////////FUNCION DE CHEQUEO DE COLISIÓN ENTRE DOS SPRITES

function intersectRect(topA, bottomA, leftA, rightA, topB, bottomB, leftB, rightB) {
  return !(leftB > rightA || 
           rightB < leftA || 
           topB > bottomA ||
           bottomB < topA);
}

/////////////////////////////////////////////////////////////////////////////////////////////CREACION DE CADA PJS CON SUS ATRIBUTOS

function createSkeleton(){
  var skeleton = sprite({
    context: canvas.getContext("2d"),
    ticksPerFrame: 8,
    width: 274,
    height: 365,
    xPos: 0,
    yPos: 0,
    xSpeed: 0,
    ySpeed: 0,
    dir: Math.floor((Math.random() * 4)),
    stop: false,
    numberOfFramesX: 3,
    numberOfFramesY:4,
    image: skeletonImg
  });
  
  switch(skeleton.dir){
    case 0:
    	skeleton.xPos = Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50));
    	skeleton.ySpeed = 1;
      break;
    case 1:
    	skeleton.xPos = body.offsetWidth * 0.41666667 - 50;
    	skeleton.yPos = Math.floor((Math.random() * body.offsetHeight * 0.63224447 - 50));
    	skeleton.xSpeed = -1;
      break;
    case 2:
    	skeleton.yPos = Math.floor((Math.random() * body.offsetHeight * 0.63224447 - 50));
    	skeleton.xSpeed = 1;
      break;
    case 3:
    	skeleton.ypos = body.offsetHeight * 0.63224447 - 50;
    	skeleton.xPos = Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50));
    	skeleton.ySpeed = -1;
      break;      
  }
  skeletons.push(skeleton);
}

function createVampire(){
  var vampire = sprite({
    context: canvas.getContext("2d"),
    ticksPerFrame: 4,
    width: 274,
    height: 365,
    xPos: 0,
    yPos: 0,
    xSpeed: 0,
    ySpeed: 0,
    dir: Math.floor((Math.random() * 4)),
    stop: false,
    numberOfFramesX: 3,
    numberOfFramesY:4,
    image: vampireImg
  });
  
  switch(vampire.dir){
    case 0:
      vampire.xPos = Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50));
      vampire.ySpeed = 4;
      break;
    case 1:
      vampire.xPos = body.offsetWidth * 0.41666667 - 50;
      vampire.yPos = Math.floor((Math.random() * body.offsetHeight * 0.63224447 - 50));
      vampire.xSpeed = -4;
      break;
    case 2:
      vampire.yPos = Math.floor((Math.random() * body.offsetHeight * 0.63224447 - 50));
      vampire.xSpeed = 4;
      break;
    case 3:
      vampire.ypos = body.offsetHeight * 0.63224447 - 50;
      vampire.xPos = Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50));
      vampire.ySpeed = -4;
      break;      
  }
  vampires.push(vampire);
}

function createDemon(){
  var demon = sprite({
    context: canvas.getContext("2d"),
    ticksPerFrame: 4,
    width: 274,
    height: 365,
    xPos: 0,
    yPos: 0,
    xSpeed: 0,
    ySpeed: 0,
    dir: 0,
    stop: false,
    numberOfFramesX: 3,
    numberOfFramesY:4,
    image: demonImg,
  });
  
  demon.ySpeed = 1.5;
  demon.xSpeed = 1.5;
  demon.xPos = Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50));

  setInterval(function() {
    demon.xSpeed = -demon.xSpeed;
  }, 2500);

  demons.push(demon);
}

function createfireMob(){
  var fireMob = sprite({
    context: canvas.getContext("2d"),
    ticksPerFrame: 4,
    width: 274,
    height: 365,
    xPos: 0,
    yPos: 0,
    xSpeed: 0,
    ySpeed: 0,
    dir: Math.floor((Math.random() * 4)),
    stop: false,
    numberOfFramesX: 3,
    numberOfFramesY:4,
    image: fireMobImg,
    count: 49
  });
  
  switch(fireMob.dir){
    case 0:
      fireMob.xPos = Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50));
      fireMob.yPos = 3;
      fireMob.ySpeed = 1;
      break;
    case 1:
      fireMob.xPos = body.offsetWidth * 0.41666667 - 50;
      fireMob.yPos = Math.floor((Math.random() * body.offsetHeight * 0.63224447 - 50));
      fireMob.xSpeed = -1;
      break;
    case 2:
      fireMob.yPos = Math.floor((Math.random() * body.offsetHeight * 0.63224447 - 50));
      fireMob.xPos = 3;
      fireMob.xSpeed = 1;
      break;
    case 3:
      fireMob.ypos = body.offsetHeight * 0.63224447 - 50;
      fireMob.xPos = Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50));
      fireMob.ySpeed = -1;
      break;      
  }
  fireMobs.push(fireMob);
}

function createCoin(){
  var coin = sprite({
    context: canvas.getContext("2d"),
    ticksPerFrame: 4,
    width: 440,
    height: 40,
    xPos: Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50)),
    yPos: Math.floor((Math.random() * body.offsetHeight * 0.63224447 - 50)),
    dir: 0,
    stop: false,
    numberOfFramesX: 10,
    numberOfFramesY:1,
    image: coinImg
  });
  coin.frameIndex = 0;
  coins.push(coin);
}

function createBoot(){
  var boot = sprite({
    context: canvas.getContext("2d"),
    ticksPerFrame: 4,
    width: 200,
    height: 200,
    xPos: Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50)),
    yPos: Math.floor((Math.random() * body.offsetHeight * 0.63224447 - 50)),
    dir: 0,
    stop: false,
    numberOfFramesX: 1,
    numberOfFramesY:1,
    image: bootImg
  });
  boot.frameIndex = 0;
  boots.push(boot);
}

function createShield(){
  var shield = sprite({
    context: canvas.getContext("2d"),
    ticksPerFrame: 4,
    width: 175,
    height: 167,
    xPos: Math.floor((Math.random() * body.offsetWidth * 0.41666667 - 50)),
    yPos: Math.floor((Math.random() * body.offsetHeight * 0.63224447 - 50)),
    dir: 0,
    stop: false,
    numberOfFramesX: 1,
    numberOfFramesY:1,
    image: shieldImg
  });
  shield.frameIndex = 0;
  shields.push(shield);
}

///////////////////////////////////////////////////////FUNCIONES DE CONTROL DEL TECLADO

function move(e){

  if(e.keyCode==39 && pj.xPos<body.offsetWidth * 0.41666667 - 50){
    pj.xSpeed = speed;
    pj.dir = 2;
  }
  if(e.keyCode==37 && pj.xPos>0){
    pj.xSpeed = -speed;
    pj.dir = 1;
  }
  if(e.keyCode==40 && pj.yPos<body.offsetHeight * 0.63224447 - 50){
    pj.ySpeed = speed;
    pj.dir = 0;
  }
  if(e.keyCode==38 && pj.yPos>0){
    pj.ySpeed = -speed;
    pj.dir = 3;
  }
  if(!pause){
    if(e.keyCode==80 || e.keyCode==32){
  	  pausa();
    }
  }else if(e.keyCode == 80 || e.keyCode == 32){
    vuelta();
  }

  pj.stop = false;
}


function stop(e){
  if(e.keyCode == 39 || e.keyCode == 37){

    pj.xSpeed = 0;
    if(pj.ySpeed > 0){
      pj.dir = 0;
    }else if(pj.ySpeed < 0){
      pj.dir = 3;
    }

  }

  if(e.keyCode == 40 || e.keyCode == 38){ 

    pj.ySpeed = 0;
    if(pj.xSpeed > 0){
      pj.dir = 2;
    }else if(pj.xSpeed < 0){
      pj.dir = 1;
    }

  }

  if(pj.xSpeed == 0 && pj.ySpeed == 0){
    pj.stop = true;
  } 
}

function endGame(){
  pause = true;
  pauseSpawn();
  parameters = location.search.substring(1).split("&").toString();
	if(parameters ==="ES"){
		$("#interfaz").append('<div id="contGameOver"/>');
		$("#contGameOver").append('<div id="divTituloGameOver"><img id="imgGover" src="Interfaz/gameover.png"/></div>');
		$("#contGameOver").append('<div id="botonesGameOver"><div id="divReintentarOver"><img id="breintentarover" src="Interfaz/breintentar.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnScore"><img id="bpuntuacionesover" src="Interfaz/bpuntuaciones.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnSalirOver"><img id="bsalirover" src="Interfaz/bsalir.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div></div>');
	
	}				
	else{
		$("#interfaz").append('<div id="contGameOver"/>');
		$("#contGameOver").append('<div id="divTituloGameOver"><img id="imgGover" src="Interfaz/gameover.png"/></div>');
		$("#contGameOver").append('<div id="botonesGameOver"><div id="divReintentarOver"><img id="breintentarover" src="Interfaz/btryagain.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnScore"><img id="bpuntuacionesover" src="Interfaz/bscores.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnSalirOver"><img id="bsalirover" src="Interfaz/bexit.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div></div>');
	
	}
	obtener_localStorage(pj.lifes);
}

document.onkeydown = move;
document.onkeyup = stop;

pjImg.addEventListener("load", gameLoop);

/////////////////////////////////INTERVALOS DE CREACIÓN DE PJS

var SkeletonTimer, VampireTimer, DemonTimer, FireMobTimer, CoinTimer, BootTimer, ShieldTimer;
var numSkeleton=500, numVampire=2000, numDemon=4000, numFireMob=4000, numCoin=5000, numBoot=10000, numShield=15000;

function Timer(callback, delay) {
    var timerId;

    this.pause = function() {
        window.clearTimeout(timerId);
    };

    this.resume = function() {
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, delay);
    };

    this.levelup = function(){
        window.clearTimeout(timerId);
        console.log("Level up");
        delay = delay/1.5;
        console.log(delay);
        timerId = window.setTimeout(callback, delay);
    }

    this.leveldown = function(){
      window.clearTimeout(timerId);
      console.log("Level down");
      delay = delay * 1.5;
      console.log(delay);
      timerId = window.setTimeout(callback,delay);
    }

    this.resume();
}

function beginGame(){

	SkeletonTimer = new Timer(function() {
    createSkeleton();
    SkeletonTimer.resume();
  }, numSkeleton);

  VampireTimer = new Timer(function() {
    createVampire();
    VampireTimer.resume();
  }, numVampire);

  DemonTimer = new Timer(function() {
    createDemon();
    DemonTimer.resume();
  }, numDemon);

  FireMobTimer = new Timer(function() {
    createfireMob();
    FireMobTimer.resume();
  }, numFireMob);

  CoinTimer = new Timer(function() {
    createCoin();
    CoinTimer.resume();
  }, numCoin);

  BootTimer = new Timer(function() {
    createBoot();
    BootTimer.resume();
  }, numBoot);

  ShieldTimer = new Timer(function() {
    createShield();
    ShieldTimer.resume();
  }, numShield);

}

function resumeSpawn(){
  pause = false;
  SkeletonTimer.resume();
  VampireTimer.resume();
  DemonTimer.resume();
  FireMobTimer.resume();
  CoinTimer.resume();
  BootTimer.resume();
  ShieldTimer.resume();
}

function pauseSpawn(){
  SkeletonTimer.pause();
  VampireTimer.pause();
  DemonTimer.pause();
  FireMobTimer.pause();
  CoinTimer.pause();
  BootTimer.pause();
  ShieldTimer.pause();
}

function levelup(){
  SkeletonTimer.levelup();
  VampireTimer.levelup();
  DemonTimer.levelup();
  FireMobTimer.levelup();
  CoinTimer.levelup();
  BootTimer.levelup();
  ShieldTimer.levelup();
}

function leveldown(){
  SkeletonTimer.leveldown();
  VampireTimer.leveldown();
  DemonTimer.leveldown();
  FireMobTimer.leveldown();
  CoinTimer.leveldown();
  BootTimer.leveldown();
  ShieldTimer.leveldown();
}

  ////////////////////////////////RELOJ

toHour=0;
toMinute=0;
toSecond=5;

function countDown(){
	
    toSecond=toSecond-1;
	$('#Ctimer').empty();
	$('#Ctimer').append(toMinute+":"+ toSecond);
    if(toSecond<0 && toMinute!=0)
    {
      toSecond=59;
      toMinute=toMinute-1;
    }
    console.log(toMinute+":"+toSecond);

    if(toSecond == 0 && toMinute == 0){
        pj.score += 500;
		switch (pj.lifes){
			case 3:
			contVidas = 50;
			break;
			case 2:
			contVidas = 30;
			break;
			default:
			break;
		}
		pj.score += contVidas;
			
		levelCompleted();
    Restart(pj.lifes, false);

		obtener_localStorage(pj.score);
		
    }else if(!pause){
      setTimeout("countDown()",1000);
     }
}

//INTERFAZ
	var music = localStorage.getItem('music');		
	var parameters = location.search.substring(1).split("&").toString();
	console.log(parameters);
	if(parameters ==="EN"){
		english();
	}				
	else{
		spanish();
	}

	function english(){
		$('#pausa').attr('src',"Interfaz/pause.png");
		$('#level').attr('src',"Interfaz/level1.png");
		$('#bcomenzar').attr('src',"Interfaz/bstart.png");
		$("a[href='UnJugador.html?ES']").attr('href', 'UnJugador.html?EN');
		$("a[href='DosJugadores.html?ES']").attr('href', 'DosJugadores.html?EN');
		$("a[href='Main.html?ES']").attr('href', 'Main.html?EN');
		$('#puntuacionJ1').append("Score: ");
	}
				
	function spanish(){
		$('#pausa').attr('src',"Interfaz/pausa.png");
		$('#level').attr('src',"Interfaz/nivel1.png");
		$('#bcomenzar').attr('src',"Interfaz/bcomenzar.png");
		$("a[href='UnJugador.html?ES']").attr('href', 'UnJugador.html?ES');
		$("a[href='DosJugadores.html?ES']").attr('href', 'DosJugadores.html?ES');
		$("a[href='Main.html?EN']").attr('href', 'Main.html?ES');
		$('#puntuacionJ1').append("Puntuación: ");
	}
	
	if (music!=="false"){
		$(".sound").prop('muted', false);
		localStorage.removeItem("music");
	}
	else{
		$(".sound").prop('muted', true);
		audioSelect.muted = true;
		audioHit.muted = true;
		audioCoin.muted = true;
		audioBoots.muted = true;
		audioShield.muted = true;
		audioStart.muted = true;
		audioPause.muted = true;
		audioOver.muted = true;
		audioVictory.muted = true;
		//localStorage.clear();
	}
	
	function quitarVida(num){
		var numero = num+1;
		$("#imgVida"+numero).remove();
		audioHit.play();
	}
	function pausa(){
    pauseSpawn();
		audioSelect.play();
		audioPause.play();
		pause = true;
		parameters = location.search.substring(1).split("&").toString();
		if(parameters ==="ES"){
			$("#interfaz").append('<div id="intPause"/>');
			$("#intPause").append('<div id="divPausa"><img id="pausa" src="Interfaz/pausa.png"/>');
			$("#intPause").append('<div id="divBotonesPausa"/>');
			$("#divBotonesPausa").append('<div id="divreiniciar"><img id="breiniciar" src="Interfaz/breiniciar.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
			$("#divBotonesPausa").append('<div id="divsalir"><img id="bsalir" src="Interfaz/bsalir.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
			$("#divBotonesPausa").append('<div id="divvolver"><img id="bv" src="Interfaz/bvolver.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
		}				
		else{
			$("#interfaz").append('<div id="intPause"/>');
			$("#intPause").append('<div id="divPausa"><img id="pausa" src="Interfaz/pause.png"/>');
			$("#intPause").append('<div id="divBotonesPausa"/>');
			$("#divBotonesPausa").append('<div id="divreiniciar"><img id="breiniciar" src="Interfaz/brestart.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
			$("#divBotonesPausa").append('<div id="divsalir"><img id="bsalir" src="Interfaz/bexit.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
			$("#divBotonesPausa").append('<div id="divvolver"><img id="bv" src="Interfaz/breturn.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
			}
	}
	
	function vuelta(){
		audioSelect.play();
		$("#pausa, #reiniciar, #salir, #intPause, #divconfirmar, #bsi, #bno, #divreiniciar, #divsalir, #divvolver").remove();
		pause = false;
    countDown();
    resumeSpawn();
	}
	
	var started_pause = false;
	//Botón comenzar
	$("#bcomenzar").click(function(){
		audioSelect.play();
		audioStart.play();
    countDown();
    beginGame();
		$("#contComienzo").remove();
			$("#interfaz").fadeIn( "slow", function() {
				$('#bpausaDisabled').prop("src", "Interfaz/bpause.png");
				$('#bpausaDisabled').prop("style", "cursor:url(Interfaz/cursorPointer.png), pointer");
				started_pause=true;
				console.log(started_pause);
				$("#puntuacionJ1").append(pj.score);				
			});
	});	
	
	//Botón pausa
	
	$("#interfaz").on('click','#bpausaDisabled', function() {
			if (!pause && started_pause){
			pausa();	
			}
			console.log('click');
							
		});
	
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////REINICIARRRRRRRRRRRRRRRRRRR////////////////////////////////
		$("#interfaz").on('click','#breiniciar', function(){
			audioSelect.play();
			$("#breiniciar, #bsalir, #bv, #divreiniciar, #divsalir, #divvolver").remove();
			$("#divBotonesPausa").remove();
				if(parameters ==="ES"){
					$("#intPause").append('<div id="divQReiniciar"><img id="Qreiniciar" src="Interfaz/reiniciar.png"/></div>');
					$("#intPause").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/bsi.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
				}
				else{
					$("#intPause").append('<div id="divQReiniciar"><img id="Qreiniciar" src="Interfaz/restart.png"/></div>');
					$("#intPause").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/byes.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
				}
			});
				
			$("#interfaz").on('click','#bsi', function(){	
				audioSelect.play();
				$("#intPause, #divQReiniciar, #divconfirmar, #botonesGameOver, #divLevelComplete, #divTituloGameOver").remove();
				if (salir){
					endGame();
					salir = false;
				}else{
					if (!$("#contGameOver").length){
						console.log('Viene de Restart');
						RestartByGover = false;
					}else{
						RestartByGover = true;
						
						console.log('Viene de GOVER');
					}
					
					audioStart.play();
					pause = false;
					console.log('CUANTOVALE' + pj.lifes);
					
					var numVidasActual = pj.lifes;
					Restart(numVidasActual, RestartByGover);
					console.log(pj.score);
					pj.score = 0;
					console.log(pj.score);
					leveldown();
					resumeSpawn();	
					countDown();
					$("#contGameOver").remove();
				}
				
			});
				
			$("#interfaz").on('click','#bno', function(){
				audioSelect.play();
				$("#divReinicioJuego, #divQReiniciar, #divconfirmar, #divSalir").remove();
					if(parameters ==="ES"){						
						$("#intPause").append('<div id="divBotonesPausa"/>');
						$("#divBotonesPausa").append('<div id="divreiniciar"><img id="breiniciar" src="Interfaz/breiniciar.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
						$("#divBotonesPausa").append('<div id="divsalir"><img id="bsalir" src="Interfaz/bsalir.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
						$("#divBotonesPausa").append('<div id="divvolver"><img id="bv" src="Interfaz/bvolver.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
					}
					else{
		
						$("#intPause").append('<div id="divBotonesPausa"/>');
						$("#divBotonesPausa").append('<div id="divreiniciar"><img id="breiniciar" src="Interfaz/brestart.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
						$("#divBotonesPausa").append('<div id="divsalir"><img id="bsalir" src="Interfaz/bexit.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
						$("#divBotonesPausa").append('<div id="divvolver"><img id="bv" src="Interfaz/breturn.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
					}
				});
			//Botón salir	
			$("#interfaz").on('click','#bsalir', function(){
				salir = true;
				quiereSalir = true;
				audioSelect.play();
				$("#divBotonesPausa").remove();
					if(parameters ==="ES"){
						$("#intPause").append('<div id="divSalir"><img id="imgSalir" src="Interfaz/salir.png"/>');
						$("#intPause").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/bsi.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
					}
					else{
						$("#intPause").append('<div id="divSalir"><img id="imgSalir" src="Interfaz/exit.png"/>');
						$("#intPause").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/byes.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
					}
				});
				
			$("#interfaz").on('click','#bsisalir', function(){
				audioSelect.play();
				
				if(parameters ==="ES"){
					if (music!=="false"){
					$(location).attr('href', 'Main.html?ES');
					}
					else{
					$(location).attr('href', 'Main.html?ESOFF');
					}					
				}
				else{
					if (music!=="false"){
					$(location).attr('href', 'Main.html?EN');
					}
					else{
					$(location).attr('href', 'Main.html?ENOFF');
					}
					}
				});
				
			$("#interfaz").on('click','#bv', function(){
				vuelta();
			});
			

			$("#interfaz").on('click','#breintentarover', function(){
				audioSelect.play();

					$("#divScore, #botonesGameOver").remove();
					if(parameters ==="ES"){
					
					$("#contGameOver").append('<div id="divQReiniciar"><img id="Qreiniciar" src="Interfaz/reiniciar.png"/></div>');
					$("#contGameOver").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/bsi.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
				}
				else{

					$("#contGameOver").append('<div id="divQReiniciar"><img id="Qreiniciar" src="Interfaz/restart.png"/></div>');
					$("#contGameOver").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/byes.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
				}
			});
				
			$("#interfaz").on('click','#imgReiniciar', function(){
				audioSelect.play();
					$("#botonesGameOver").remove();
					if(parameters ==="ES"){
					
					$("#intPause").append('<div id="divQReiniciar"><img id="Qreiniciar" src="Interfaz/reiniciar.png"/></div>');
					$("#intPause").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/bsi.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
				}
				else{
					$("#intPause").append('<div id="divQReiniciar"><img id="Qreiniciar" src="Interfaz/restart.png"/></div>');
					$("#intPause").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/byes.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
				}
			});
				
			$("#interfaz").on('click','#bpuntuacionesover', function(){
				audioSelect.play();
				$("#botonesGameOver, #divScore").remove();
				if(parameters ==="ES"){
					$("#contGameOver").append('<div id="divScore"><img id="imgMejorPunt" src="Interfaz/mejorespuntuaciones.png"/></div>');
					$("#contGameOver").append('<div id="divTablaPuntIngame">');
						var cont = 0;
						var punt_prueba = obtener_localStorage();
						for (var i=0; i<10; i++){
							
							if (punt_prueba[i] != 0){
							
							var num = i+1;
							$("#divTablaPuntIngame").append('<div id="divTablaPunt' + i + '"><p id="puntuacionJ1">' + num + " : " + punt_prueba[i] +'</p>');
							}else{
								cont++;
							}
							if (cont == 10){
							$("#divTablaPunt").append('<div id="divTablaPunt_Vacio"><p id="puntuacionJ1">No hay puntuaciones</p>');
							}
						}
					$("#contGameOver").append('</div>');
					$("#contGameOver").append('<div id="divvolverscore"><img id="bvolverscore" src="Interfaz/bvolver.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
				}
				else{
					$("#contGameOver").append('<div id="divScore"><img id="imgMejorPunt2" src="Interfaz/bestscores.png"/></div>');
					$("#contGameOver").append('<div id="divTablaPuntIngame">');
						var cont = 0;
						var punt_prueba = obtener_localStorage();
						for (var i=0; i<10; i++){
							
							if (punt_prueba[i] != 0){
							
							var num = i+1;
							$("#divTablaPuntIngame").append('<div id="divTablaPunt' + i + '"><p id="puntuacionJ1">' + num + " : " + punt_prueba[i] +'</p>');
							}else{
								cont++;
							}
							if (cont == 9){
							$("#divTablaPunt").append('<div id="divTablaPunt_Vacio"><p id="puntuacionJ1">No scores</p>');
							}
						}
					$("#contGameOver").append('</div>');
					$("#contGameOver").append('<div id="divvolverscore"><img id="bvolverscore" src="Interfaz/breturn.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
				}
			});
				
			$("#interfaz").on('click','#bvolverscore', function(){
				audioSelect.play();
				$("#divvolverscore, #contGameOver").remove();
					if(parameters ==="ES"){						
						
						$("#interfaz").append('<div id="contGameOver"/>');
						$("#contGameOver").append('<div id="divTituloGameOver"><img id="imgGover" src="Interfaz/gameover.png"/></div>');
						
						$("#contGameOver").append('<div id="botonesGameOver"><div id="divReintentarOver"><img id="breintentarover" src="Interfaz/breintentar.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnScore"><img id="bpuntuacionesover" src="Interfaz/bpuntuaciones.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnSalir"><img id="bsalirover" src="Interfaz/bsalir.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div></div>');
						
					
					}
					else{
						
						$("#interfaz").append('<div id="contGameOver"/>');
						$("#contGameOver").append('<div id="divTituloGameOver"><img id="imgGover" src="Interfaz/gameover.png"/></div>');
						
						$("#contGameOver").append('<div id="botonesGameOver"><div id="divReintentarOver"><img id="breintentarover" src="Interfaz/btryagain.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnScore"><img id="bpuntuacionesover" src="Interfaz/bscores.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnSalir"><img id="bsalirover" src="Interfaz/bexit.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div></div>');
						
					}
				});
				
			$("#interfaz").on('click','#bsalirover', function(){
				audioSelect.play();
				if(parameters ==="ES"){
					if (music!=="false"){
					$(location).attr('href', 'Main.html?ES');
					}
					else{
					$(location).attr('href', 'Main.html?ESOFF');
					}					
				}
				else{
					if (music!=="false"){
					$(location).attr('href', 'Main.html?EN');
					}
					else{
					$(location).attr('href', 'Main.html?ENOFF');
					}
					}
			});
			
			//LevelComplete
				function levelCompleted(){
        pauseSpawn();
				audioVictory.play();
				
        pause = true;

				
				parameters = location.search.substring(1).split("&").toString();
				$('#puntuacionJ1').empty();
				
				if(parameters ==="ES"){
					$('#puntuacionJ1').append("Puntuación: " + pj.score);
					$("#interfaz").append('<div id="intLevelComplete"/>');
					$("#intLevelComplete").append('<div id="divLevelComplete"><img id="levelcomplete" src="Interfaz/nivelcompletado.png"/></div>');
					$("#intLevelComplete").append('<div id="divPuntPartida"><img id="imgScoreGover" src="Interfaz/puntuacion.png"/></div>');
					$("#intLevelComplete").append('<div id="divDesglosePunt"></div>');
					$("#divDesglosePunt").append('<ul id="listaReglas"><li type="circle"><p id="pItemsLista"><font><img id="life" src="Interfaz/Dragon.png" align="middle"/>Nivel completado: 500</li><li type="circle"><p id="pItemsLista"><font><img id="life" src="Interfaz/coin.gif" align="middle"/>Monedas: '+ contMonedas + '</li><li type="circle"><p id="pItemsLista"><font><img id="coin" src="Interfaz/heart.gif"/>Recuento de vidas: ' + contVidas + ' </li></ul>');
					$("#intLevelComplete").append('<div id="botonesCompleted"><div id="divReiniciar"><img id="breiniciarcompleted" src="Interfaz/breiniciar.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnSalir"><img id="bsalircompleted" src="Interfaz/bsalir.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
					
					if (!nextLevel){
						$("#botonesCompleted").append('<div id="divBtnNext"><img id="bnextcompleted" src="Interfaz/bsiguiente.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
					}else{
						$("#botonesCompleted").append('<div id="divBtnNext"><img id="bnextcompletedisabled" src="Interfaz/bsiguiente_disabled.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
					}
				}				
				else{
					$('#puntuacionJ1').append("Score: " + pj.score);
					$("#interfaz").append('<div id="intLevelComplete"/>');
					$("#intLevelComplete").append('<div id="divLevelComplete"><img id="levelcomplete" src="Interfaz/levelcompleted.png"/></div>');
					$("#intLevelComplete").append('<div id="divPuntPartida"><img id="imgScoreGover" src="Interfaz/score.png"/></div>');
					$("#intLevelComplete").append('<div id="divDesglosePunt"></div>');
					$("#divDesglosePunt").append('<ul id="listaReglas"><li type="circle"><p id="pItemsLista"><font><img id="life" src="Interfaz/Dragon.png" align="middle"/>Level completed: 500</li><li type="circle"><p id="pItemsLista"><font><img id="life" src="Interfaz/coin.gif" align="middle"/>Coins: '+ contMonedas + '</li><li type="circle"><p id="pItemsLista"><font><img id="coin" src="Interfaz/heart.gif"/>Life count: ' + contVidas + ' </li></ul>');
					$("#intLevelComplete").append('<div id="botonesCompleted"><div id="divReiniciar"><img id="breiniciarcompleted" src="Interfaz/brestart.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divBtnSalir"><img id="bsalircompleted" src="Interfaz/bexit.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div>');
					
						if (!nextLevel){
							$("#botonesCompleted").append('<div id="divBtnNext"><img id="bnextcompleted" src="Interfaz/bnext.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
						}else{
							$("#botonesCompleted").append('<div id="divBtnNext"><img id="bnextcompletedisabled" src="Interfaz/bnext_disabled.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
						}
					}
					nextLevel = true;
				}
				
				$("#interfaz").on('click','#breiniciarcompleted', function(){
				audioSelect.play();
				console.log('clickasdasdasd');
					$("#divPuntPartida, #divDesglosePunt, #botonesCompleted").remove();
					if(parameters ==="ES"){
					
					$("#intLevelComplete").append('<div id="divQReiniciar"><img id="Qreiniciar" src="Interfaz/reiniciar.png"/></div>');
					$("#intLevelComplete").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/bsi.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
				}
				else{
					$("#intLevelComplete").append('<div id="divQReiniciar"><img id="Qreiniciar" src="Interfaz/restart.png"/></div>');
					$("#intLevelComplete").append('<div id="divconfirmar"><div id="divSi"><img id="bsi" src="Interfaz/byes.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div><div id="divNo"><img id="bno" src="Interfaz/bno.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"/></div></div>');
				}
			});

			$("#interfaz").on('click','#bsalircompleted', function(){
				audioSelect.play();
				if(parameters ==="ES"){
					if (music!=="false"){
					$(location).attr('href', 'Main.html?ES');
					}
					else{
					$(location).attr('href', 'Main.html?ESOFF');
					}					
				}
				else{
					if (music!=="false"){
					$(location).attr('href', 'Main.html?EN');
					}
					else{
					$(location).attr('href', 'Main.html?ENOFF');
					}
					}
			});
				
			$("#interfaz").on('click','#bnextcompleted', function(){
				audioSelect.play();
				parameters = location.search.substring(1).split("&").toString();
				$("#intLevelComplete").remove();
				if(parameters ==="ES"){
					
					
					$("#interfaz").append('<div id="contComienzo"></div>');
					$("#contComienzo").append('<div id="divNivel2"><img id="level" src="Interfaz/nivel2.png"></div>');
					$("#contComienzo").append('<div id="divComenzar"><img id="bcomenzar2" src="Interfaz/bcomenzar.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"></div>');
					
				}
				else{
					$("#intPause").remove();
					
					$("#interfaz").append('<div id="contComienzo"></div>');
					$("#contComienzo").append('<div id="divNivel2"><img id="level" src="Interfaz/level2.png"></div>');
					$("#contComienzo").append('<div id="divComenzar"><img id="bcomenzar2" src="Interfaz/bstart.png" style="cursor:url(Interfaz/cursorPointer.png), pointer"></div>');
					
				}
			});			
	
			
		$("#interfaz").on('click','#bcomenzar2', function(){
				audioSelect.play();
				pause = false;
				levelup();
				resumeSpawn();
        
				$("#contComienzo").remove();
					if(parameters ==="ES"){						
			
					console.log('SIG LEVEL');
					}
					else{
					
					console.log('NEXT LEVEL');
					}
          countDown();
				});
			
			
