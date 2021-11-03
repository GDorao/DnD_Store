let inventory = []
let cart = []
var inventoryJSON
let totalPriceGP=0
let totalPriceSP=0
let totalPriceCP=0
let finalPrice="Total:"



async function preload(){

  inventoryJSON=loadJSON('Inventario.json')
  //await virtual
  while(inventoryJSON[0]==undefined){await sleep(1)} //mientras no se haya cargado el json
  loadInventory(inventoryJSON)

}



function setup() {

  var canvas = createCanvas(windowWidth,windowHeight-1);
  textAlign(LEFT, TOP);

  butCheckOut = createButton('Checkout');
  butCheckOut.position(600, 450);
  butCheckOut.mousePressed(saveJ)

  CheckExpress = createCheckbox('Express Delivery (30gp)', false);
  CheckExpress.position(400, 450);
  CheckExpress.changed(()=>{
    if(CheckExpress.checked()){ChangeCartCost("30gp", "add")}
    else{ChangeCartCost("30gp", "remove")}
    
  })
}



function draw() {

  background(200);  


  text("Item", 0, 0);
  text("Price", 200, 0);
  text("Qty", 400, 0);
  text("Cart", 600, 0);

  
  
  for (let i=0; i<inventory.length;i++){//mostrar
    inventory[i].show(0,i*50+100)
  }

  
  text(finalPrice, 600, 400);

  


}

function saveJ() {
  let json="["
  for (let e of inventory){
    if(e.inCart>0){
    string=JSON.stringify(e)
    json+=string+","
    }
  }
  json+='{"Final Price": "'+finalPrice+'"}]'
  json=JSON.parse(json)
  //console.log(json)
  saveJSON(json, 'Cart.json');
  //???
}



function loadInventory(inventoryJSON){
  for(let i=0;i<Object.keys(inventoryJSON).length;i++){   
      inventory.push(new Item(inventoryJSON[i].name, inventoryJSON[i].price, inventoryJSON[i].stock))

      butP = createButton('->');
      butP.position(500, i*50+90);
      butP.mousePressed(()=>{
        if(inventory[i].stock>0){
          inventory[i].stock--
          inventory[i].inCart++
          ChangeCartCost(inventory[i].price, "add")
        }
      })


      butL = createButton('<-');
      butL.position(500, i*50+110);
      butL.mousePressed(()=>{
        if(inventory[i].inCart>0){
          inventory[i].stock++
          inventory[i].inCart--
          ChangeCartCost(inventory[i].price, "remove")
        }
      })
  }
  
}

function sleep(millisecondsDuration)
  {
    return new Promise((resolve) => {
      setTimeout(resolve, millisecondsDuration);
    })
  }

  function ChangeCartCost(price, action){
    let mult=-1; //add or remove
    if(action=="add"){mult=1}

    
    switch (price.substring(price.length-2,price.length)) {
      case "gp":
        totalPriceGP+=parseInt(price.substring(0,price.length-2))*mult
        break;
      case "sp":
        totalPriceSP+=parseInt(price.substring(0,price.length-2))*mult
        break;

      case "cp":
        totalPriceCP+=parseInt(price.substring(0,price.length-2))*mult
        break;
      default:
        totalPriceGP+=parseInt(price)*mult//if there is only number
        break;
    }
    




    if(totalPriceCP>=10){
      let extra
      extra=floor(totalPriceCP/10)
      totalPriceCP-=extra*10
      totalPriceSP+=extra
    }
    if(totalPriceSP>=10){
      let extra
      extra=floor(totalPriceSP/10)
      totalPriceSP-=extra*10
      totalPriceGP+=extra
    }
    if(totalPriceCP<0){
      totalPriceCP+=10
      totalPriceSP-=1
    }
    if(totalPriceSP<0){
      totalPriceSP+=10
      totalPriceGP-=1
    }






    finalPrice="Total: "
    if(totalPriceGP!=0){finalPrice+=totalPriceGP+"gp"}
    if(totalPriceSP!=0){finalPrice+=" "+totalPriceSP+"sp"}
    if(totalPriceCP!=0){finalPrice+=" "+totalPriceCP+"cp"}
  }