import { Sprite } from "./sprite.js"
    
let config = {
    color: "#FFFFFF",//"#FFFF00",//"rgba(255, 255, 255, 0.9)",
    textColor: "#000000",//"#000033",
    fontSize: 30,
    borderWidth: 10,
    borderColor: "#000033",

    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowBlur: 5,
    shadowOffsetX: 0,
    shadowOffsetY: 0,

};

class Xxx extends Sprite {
    constructor(x, y, width, height = 50, centerY = true) {
        super(x, y, width, height, "");

        this.content = "";
    }
}

export default Xxx;
