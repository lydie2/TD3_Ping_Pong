class CanvasDrawer{
    constructor(name,width,height){
        document.getElementById(name).width = width;
        document.getElementById(name).height = height;
        this.canvasContext = document.getElementById(name).getContext("2d");
        this.width = width;
        this.height = height;
    }

    clear(){
        this.canvasContext.clearRect(0,0,this.width,this.height);
    }
    drawRect(x,y,width,height,color){
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(x,y,width,height)
    }
}

class Terrain extends CanvasDrawer{
    constructor(width,height){
        super("terrain",width,height);
    }
    drawTerrain(){
        // couleur du terrain
        this.drawRect(0,0,this.width,this.height,'#2b4f60');
        this.canvasContext.arc(this.width / 2,this.height / 2, 100, 0, 2 * Math.PI);
        this.canvasContext.moveTo(this.width / 2, 0);
        this.canvasContext.lineTo(this.width / 2, this.height);
        this.canvasContext.lineWidth = 8;
        
        this.canvasContext.strokeStyle = '#FFF';
       
        this.canvasContext.stroke();

        
        
    }
}

class MovableElements extends CanvasDrawer{
    constructor(width,height){
        super("joueursetballe",width,height);
    }
    drawJoueur(x,y,width,height){
        this.drawRect(x-width/2,y-height/2,width,height,'#FFF');
    }

    drawBall(x,y,height){
        this.drawRect(x-height/2,y-height/2,height,height,'#81b214');
    }
}

class WriteText extends CanvasDrawer{
    constructor(width,height){
        super("score",width,height);
    }
    writeText(text,x,y,size){
        this.canvasContext.font = size+"px Arial";
        this.canvasContext.fillStyle="#FFF";
        this.canvasContext.fillText(text,x,y);
    }
}