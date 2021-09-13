import { SineBehavior, Sprite } from "./sprite.js"
import { ImageSprite, Rect } from "./basicSprite.js"
import { TextBlock } from "./textblock.js"
import { IdentityMachine } from "./machine.js";

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

class NodeBase extends Sprite {
    constructor(x, y, width = 60, height = 60) {
        super(x, y, width, height);

        let centerX = x + width / 2;
        let centerY = y + height / 2;


        let rect1 = new Rect(centerX, centerY, width, height, "#CFC", "#FFF");
        let rect2 = new Rect(centerX, centerY + height / 4, width, height / 2, "#BFB");
        rect1.hasShadow = true;

        rect1.isAnchorCenter = true;
        rect2.isAnchorCenter = true;
        this.rect1 = rect1;
        this.rect2 = rect2;

        super.addSubSprite(rect1);
        super.addSubSprite(rect2);
    }
    drawItself(ctx) {
        super.drawItself(ctx);
    }
    jellyShake() {
        this.rect1.jellyShake();
        this.rect2.jellyShake();
    }
}

// class NodeBase2 extends ImageSprite {
//     constructor(x, y, width = 50, height = 50) {
//         super(x, y, width, height, "function_machine");
//     }
// }

class Node extends Sprite {
    constructor(x, y, width = 60, height = 60) {
        super(x, y, width, height);

        this.nodeLayer = new Sprite(0, 0);
        this.labelLayer = new Sprite(0, 0);

        super.addSubSprite(this.nodeLayer, false);
        super.addSubSprite(this.labelLayer, false);

        //Rect
        // this.nodeBase = new NodeBase2(0, 0, width, height, "#FFFFFF", "#000000");
        // super.addSubSprite(this.nodeBase, false);

        this.textBlock = new TextBlock(0, 0, width, height, "");
        this.textBlock.setTextCenter();
        this.labelLayer.addSubSprite(this.textBlock, false);
    }
    setText(text) {
        this.textBlock.setText(text);
    }
    // drawItself(ctx) {
    //     // super.drawItself(ctx);
    // }
}

class NumberNode extends Node {
    constructor(x, y, value = null) {
        super(x, y);

        this.nodeBase = new NodeBase(0, 0, this.width, this.height, "#FFFFFF", "#000000");
        this.nodeLayer.addSubSprite(this.nodeBase, false);
        
        this.setValue(value);
    }
    setValue(value) {
        this.value = value;
        if (value !== null && value.toString) {
            this.setText(value.toString());
        }
    }
    getValue() {
        return this.value;
    }
    jellyShake() {
        this.nodeBase.jellyShake();
    }

    // drawItself(ctx) {
    //     // super.drawItself(ctx);
    // }
}

class MachineNode extends Node {
    constructor(x, y, functionMachine) {
        super(x, y);

        //this.nodeLayer.addSubSprite(functionMachine);

        this.nodeBase = new NodeBase(0, 0, this.width, this.height);
        this.nodeLayer.addSubSprite(this.nodeBase, false);
        
        // let padding = 5;
        // //this.textBlock.y = padding;
        // this.textBlock.width -= padding;
        // //this.textBlock.height -= padding;
        // this.textBlock.setTextCenter();

        // //super.setText(func.getLabel());

        this.machineLayer = new Sprite(0, 0);
        super.addSubSprite(this.machineLayer, false);


        if (functionMachine === undefined) {
            this.functionMachine = new IdentityMachine();
        }
        else {
            // this.nodeBase = new NodeBase2(0, 0, this.width, this.height);
            // this.nodeLayer.addSubSprite(this.nodeBase, false);
        
            this.functionMachine = functionMachine;
            this.machineLayer.addSubSprite(this.functionMachine);
        }

        
        // super.setText(this.functionMachine.getLabel());
    }
    setFunctionMachine(functionMachine) {
        this.functionMachine = functionMachine;
        
        this.machineLayer.clearSubSprite();
        this.machineLayer.addSubSprite(this.functionMachine);

        //this.setText(functionMachine.getLabel());
    }
    process(inputValue) {
        return this.functionMachine.process(inputValue);
    }
}

export { Node, NumberNode, MachineNode };


