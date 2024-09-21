
let canvas = document.getElementById("whiteboard");
let clear = document.getElementById('clear');
let color = document.getElementById("color");
let types = document.getElementsByClassName("option")
let filled  = document.getElementById("filled");
let thin    = document.getElementById("thin");
let xy = document.getElementById("xy");
let ctx = canvas.getContext('2d');
let selectedType = 'L' // L : Line , R :Rectangle , C :Circle
canvas.width = window.innerWidth;
canvas.height =window.innerHeight;
let isDrawing = false;
let pox = 0;
let poy = 0;
let stack = [];
let startX = 0;
let startY = 0;
colorRec = "#000"
let snapshot;
let isFill = false;
let strokethin =2;


filled.addEventListener("change",(e)=>{
      isFill = e.target.checked;
})
thin.addEventListener("change",(e)=>{
      strokethin = e.target.value
})

for(let i = 0; i< types.length;i++){
      types[i].addEventListener("click",()=>{
            document.querySelector(".active").classList.remove("active");
            types[i].classList.add("active");
            selectedType = types[i].getAttribute("data-name");
            console.log(selectedType);
      })
}

clear.addEventListener("click",()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
})
color.addEventListener("change",(e)=>{
      colorRec = e.target.value;
})

function startDrawing(e){
      isDrawing = true;
      ctx.beginPath();
      ctx.strokeStyle =colorRec;
      ctx.fillStyle = colorRec;
      ctx.lineWidth = strokethin;
      pox = e.offsetX;
      poy = e.offsetY;
      startX = pox;
      startY=  poy;
      snapshot = ctx.getImageData(0,0,canvas.width,canvas.height);
}
function drawing(e){  
      xy.innerText = `{ X: ${e.offsetX} - Y: ${e.offsetY}  }`
      if (!isDrawing) return;
      ctx.putImageData(snapshot,0,0);
      if(selectedType == "L" || selectedType == "E"){
            drawLine(e,selectedType == "E");
      }else if(selectedType == "R"){
            drawRectangle(e);
      }else if (selectedType == "T"){
            drawTriangle(e);
      }else{
            drawCircle(e);
      }
}

function drawLine(e,easer){
      let easrcolor;
      easer? easrcolor = "#fff":colorRec;
      ctx.strokeStyle =easrcolor;
      ctx.moveTo(pox,poy);
      ctx.lineTo(e.offsetX,e.offsetY);
      ctx.stroke();
      pox = e.offsetX;
      poy = e.offsetY;
}
function drawRectangle(e){
      if(isFill){
            ctx.fillRect(startX,startY,e.offsetX - startX ,e.offsetY - startY)
      }else{
            ctx.strokeRect(startX,startY,e.offsetX - startX ,e.offsetY - startY)
      }
}
function drawCircle(e){
      ctx.beginPath()
      let radius = Math.sqrt(Math.pow((pox - e.offsetX),2) + Math.pow(poy - e.offsetY,2))
      ctx.arc(startX,startY,radius,0,2* Math.PI)
      isFill ? ctx.fill() : ctx.stroke();
}
function drawTriangle(e){
      ctx.beginPath();
      ctx.moveTo(pox,poy);
      ctx.lineTo(e.offsetX,e.offsetY);
      ctx.lineTo(pox * 2  - e.offsetX, e.offsetY)
      ctx.closePath();
      isFill ? ctx.fill() : ctx.stroke();

}
canvas.addEventListener("mousedown",(e)=>startDrawing(e))
canvas.addEventListener("mouseup",()=>isDrawing = false)
canvas.addEventListener("mousemove",(e)=>drawing(e))
