document.addEventListener('DOMContentLoaded',()=>{

    let isGameOver = false;
    let score = 0;
// arrow keys state array
// key down (true), key up (false)
// let keyState = [false,false,false,false]; //(left, right, up , down)
window.key = null;

// Arrow Keys ASCII Codes
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;

function Keyboard(){
    this.left = false;
    this.right=false;
    this.up=false;
    this.down=false;
};

function keyboardInit(){

    window.key = new Keyboard();
    document.addEventListener('keydown', controlDown);
    document.addEventListener('keyup', controlUp);

function controlDown(e){
    if (e.keyCode === KEY_LEFT){key.left=true;}
    if (e.keyCode === KEY_RIGHT){key.right=true;}
    if (e.keyCode === KEY_UP){key.up=true;}
    if (e.keyCode === KEY_DOWN){key.down=true;}
}

function controlUp(e){
    if (e.keyCode === KEY_LEFT){key.left=false;}
    if (e.keyCode === KEY_RIGHT){key.right=false;}
    if (e.keyCode === KEY_UP){key.up=false;}
    if (e.keyCode === KEY_DOWN){key.down=false;}
}

}

    class Doodler {
        constructor(width,height,color, platforms, parent,speed){
        this.myDoodler = document.createElement('div');
        //this.myDoodler.classList.add('doodler');
        this.width=width;
        this.isJumpimg = false;
        this.speed = speed;
        this.height = height;
        this.color = color;
        this.parent = parent;
        this.left = platforms[0].left;
        this.bottom = platforms[0].bottom + platforms[0].height;
        this.myDoodler.style.bottom = this.bottom + 'px';
        this.myDoodler.style.left = this.left + 'px';
        this.myDoodler.style.width = width + 'px';
        this.myDoodler.style.height = height + 'px';
        this.myDoodler.style.position = 'absolute';
        this.myDoodler.style.backgroundColor = color;
        this.myDoodler.style.zIndex=10;
        }
        addDoodler(){
            const myGrid = document.querySelector(this.parent);
            myGrid.appendChild(this.myDoodler);
            }

        jump(inc,initialVerticalPosition,maxJumpHeight) {
            let vPosition = initialVerticalPosition;
            let velocity = inc*10;
            this.isJumping = true;
            let jumpTimerID = setInterval(()=>{
                velocity -= 0.1;
                velocity *= 0.9;
                vPosition += velocity;
           //vPosition += -4.905*(time/1000)^2 + 1 * time/1000;
               this.bottom=vPosition;
               this.myDoodler.style.bottom = vPosition +'px';
               if (velocity<=0.01){
                clearInterval(jumpTimerID);
                this.fall(-inc,vPosition,myPlatformArray,maxJumpHeight);
            }
        },this.speed);

          }

        fall(dec,initialVerticalPosition,platforms,maxJumpHeight) {
            let vPosition = initialVerticalPosition;
            let velocity = 0;
            this.isJumping = false;
            let fallTimerID = setInterval(()=>{
            //    vPosition+=dec;
            velocity += 0.1;
            velocity *= 1;
            vPosition -= velocity;
            // vPosition *=.9
               if (vPosition<=0){
                gameOver();
               }
               this.bottom = vPosition;
               this.myDoodler.style.bottom = vPosition +'px' ; 
  
            // collision detection
            platforms.forEach(platform => {
                
                if (
                    ((this.bottom>platform.bottom) && (this.bottom<(platform.bottom+platform.height)))&&
                    ((this.left + this.width) > platform.left ) &&
                    (this.left < (platform.left + platform.width))
                    ){
                        console.log('landed');
                        
                        clearInterval (fallTimerID);
                        // this.bottom=platform.bottom+platform.height;
                        this.jump( -dec, this.bottom, maxJumpHeight);
                    }
            })
        
        },this.speed);
        
    }

    moveLeftRight(inc){
        if ((this.left >= 0) && (this.left<=340)){
            this.left += inc;
            if (this.left<0){
                this.left=0;
            } else if (this.left>340){
                this.left=340;
            }
        }
        this.myDoodler.style.left = this.left + 'px';

    }
    }
    
    class Platform {
        constructor(width, height, color, bottom, parentElmntClass){
            this.bottom = bottom;
            this.width= width;
            this.height = height;
            this.color = color;
            this.parentElmntClass = parentElmntClass;
            this.left = Math.random()*315;
            this.platform = document.createElement('div');
            this.platform.style.left = this.left + 'px';
            this.platform.style.bottom = this.bottom + 'px';
            this.platform.style.width = this.width + 'px';
            this.platform.style.height = this.height + 'px';
            this.platform.style.position = 'absolute';
            this.platform.style.backgroundColor = color;
            //this.platform.classList.add('platform');
        }
        
        // add platform to grid
        addPlatform(){
            var myGrid = document.querySelector(this.parentElmntClass);
            myGrid.appendChild(this.platform);
        }
        
        // platform moving down 
        movePlatform(){
                this.bottom-=5;
                this.platform.style.bottom = this.bottom + 'px';
            }

        // remove platform
        removePlatform(){
            this.platform.remove();
        }
    }
    
    function gameOver(){
        isGameOver = false;
        document.querySelector('.grid').innerHTML = score;
    };

    let myPlatformArray = [];
    let platformCount = 5;

    for (i=0; i<platformCount; i++){
        let platformGap = 600 / platformCount;
        let newPlatform = new Platform(85, 15, 'green' , (100+i*platformGap),'.grid');
        newPlatform.addPlatform();
        myPlatformArray.push(newPlatform);
    }
  
    // Create Doodler Array
    let newDoodler1 = new Doodler(60,85,'red',myPlatformArray,'.grid',15);
    newDoodler1.addDoodler();
    newDoodler1.jump(1.8,newDoodler1.bottom,200);

keyboardInit();

// Game Loop
let gameLoopID = setInterval(function(){
  if (!isGameOver){
        if (newDoodler1.bottom>300 && newDoodler1.isJumping){
            myPlatformArray.forEach(myPlatform=>{
                myPlatform.movePlatform();
                if (myPlatform.bottom<-10){
                    removedPlatform = myPlatformArray.shift(); //remove first platform (lowest platform)
                    removedPlatform.removePlatform();
                    removedPlatform = null;
                    let newPlatform = new Platform(85,15,'green', 600, '.grid');
                    newPlatform.addPlatform();
                    myPlatformArray.push(newPlatform);
                    score++;
                }
            })
        }        
    if (key.left){
        newDoodler1.moveLeftRight(-5);
    } else if (key.right){
        newDoodler1.moveLeftRight(5);
    } 
}
    else {
        clearInterval(gameLoopID);
        gameOver();
    }
},17)
});
