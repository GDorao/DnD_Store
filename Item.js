class Item {
    constructor(name="Item", price="0cp", stock="0") {
        this.name=name
        this.price=price
        this.stock=stock
        this.inCart=0
    }

    show(x,y){
        textSize(20);
        text(this.name, x, y);
        text(this.price, x+200, y);
        text(this.stock, x+400, y);
        text(this.inCart, x+600, y);
    }

}