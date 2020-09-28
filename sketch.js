
var dog,happyDog,database,foodStock,foodS,milkImg,milk;
var button1,button2,fedTime,lastFed,foodObj;
var changingGameState,readingGameState,bedroom,garden,washroom;

function preload(){
  dogImg = loadImage("images/virtual pet images/Dog.png");
  happyDog = loadImage("images/virtual pet images/happy dog.png");
  milk = loadImage("images/virtual pet images/milk.png")
  washroom = loadImage("images/virtual pet images/washroom.png");
  bedroom = loadImage("images/virtual pet images/bedroom.png");
  garden = loadImage("images/virtual pet images/garden.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  
  foodObj=createSprite(120,300,210,31);
  foodObj.addImage("milk",milk);
  foodObj.scale=0.5;
  
  dog = createSprite(250, 350, 150, 150);
  dog.addImage(dogImg);
  dog.scale = 0.5; 
  foodStock = database.ref('Food');
  foodStock.on("value", readStock,writeStock);
  
  feed=createButton("Feed the Dog");
  feed.position(450,100);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(710,100);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
  gameState=data.val();
  });

}

function draw() {
  background(46,139,87);
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    
   }
 
  drawSprites();
}
  
  function readStock(data) {
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  }
  
  function writeStock(x) {
    if (x<=0) {
      x = 0;
    }
    else {
      x= x-1
    }
  database.ref('/').update({
    Food:x
  })
}
  
  
  function feedDog() {
    dog.addImage(happyDog);
  
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }
  function addFoods() {
    foodS++
    database.ref('/').update({
      Food:foodS
    })
    }
  
  function update(state){
  database.ref('/').update({
    gameState:state
  })
}