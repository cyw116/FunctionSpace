import { Sprite } from "./../sprite.js"
import { Belt } from "./belt.js";
import { TextBlock } from "../textblock.js";
import { Rect } from "../basicSprite.js";

const config = {
    targetBubble: {
        default: {
            // bgColor: "#C99",
            textColor: "#333",
            borderColor: "#66666680",
            opacity: 0.5,
        },
        success: {
            // bgColor: "#FFC",
            textColor: "#000",
            borderColor: "#339",
            opacity: 1,
        },

        dx: -10,
        dy: 10,
        side: 40,
        fontSize: 20,
        bgColor: "#FFFFFF80",
        borderWidth: 2,
        borderColor: "#66666680"
    },
};

class AssemblyLine extends Sprite {
    constructor(inputNode, outputNode, functionNodeList, target, styleIndex = 0) {
        super(0, 0);

        this.target = target;
        this.isTargetMet = false;
        
        // this.nodeLayer = new Sprite(0, 0);
        this.beltLayer = new Sprite(0, 0);
        this.targetLayer = new Sprite(0, 0);
        super.addSubSprite(this.beltLayer);
        super.addSubSprite(this.targetLayer);
        // super.addSubSprite(this.nodeLayer);

        this.inputNode = inputNode;//new NumberNode(0, 0, 0);
        this.functionNodeList = functionNodeList;
        // this.functionNodeList = [];
        // for (let i = 0; i < machineCount; i++) {
        //     this.functionNodeList.push(new MachineNode(0, 0));
        // }
        
        this.outputNode = outputNode;//new NumberNode(0, 0, 0);
        
        this.beltList = [];

        this.nodeList = [];
        this.nodeList.push(this.inputNode);
        this.nodeList = this.nodeList.concat(this.functionNodeList);
        this.nodeList.push(this.outputNode);

        // this.targetBubble = new TextBlock(outputNode.x + outputNode.width - 10, outputNode.y - 50 + 10, 50, 50, "=" + targetBubble.toString());
        this.targetBubble = createTargetBubble(outputNode, config.targetBubble, target);
        this.adjustTarget(false);
        this.targetLayer.addSubSprite(this.targetBubble);

        this.setBelt(styleIndex);
    }
    // setInputNodePosition(x, y) {
    //     this.inputNode.setPos(x, y);
    // }
    // setOutputNodePosition(x, y) {
    //     this.outputNode.setPos(x, y);
    // }
    // setFunctionsNodePosition(positionList) {
    //     for (let i = 0; i < this.functionNodeList.length; i++) {
    //         let functionNode = this.functionNodeList[i];
    //         let position = positionList[i];

    //         functionNode.setPos(position.x, position.y);
    //     }
    // }
    setInputValue(value) {
        this.inputNode.setValue(value);
    }
    setFunctionMachine(functionMachine, index) {
        if (index >= this.functionNodeList.length) {
            throw new Error("[AssemblyLine] Index out of bound");
        }

        let functionNode = this.functionNodeList[index];
        functionNode.setFunctionMachine(functionMachine);
    }
    setBelt(styleIndex = 0) {
        for (let i = 0; i < this.nodeList.length - 1; i++) {
            let node1 = this.nodeList[i];
            let node2 = this.nodeList[i+1];
            
            let belt = new Belt(node1, node2, styleIndex);
            this.beltList.push(belt);
            this.beltLayer.addSubSprite(belt);
        }
    }
    run() {
        let intermediate = this.inputNode.getValue();

        for (let i = 0; i < this.functionNodeList.length; i++) {
            let functionHolderNode = this.functionNodeList[i];
            intermediate = functionHolderNode.process(intermediate);
        }
        let finalValue = Math.round(intermediate * 10) / 10;

        let previousValue = this.outputNode.getValue(); 

        this.outputNode.setValue(finalValue);
        this.adjustTarget(this.target === finalValue);

        // OutputNode animation
        if (previousValue !== null && finalValue !== previousValue) {
            this.outputNode.jellyShake();
        }
        
        // Ask for redraw
        this.hasUpdate = true;
    }
    adjustTarget(isTargetMet) {
        this.isTargetMet = isTargetMet;
        //this.targetBubble.setLookDisabled(!isTargetMet);

        if (isTargetMet) {
            this.setTargetBubbleColor(config.targetBubble.success);
            // this.targetBubble.setColor(config.targetBubble.success.bgColor, config.targetBubble.success.textColor);
            
        }
        else {
            this.setTargetBubbleColor(config.targetBubble.default);
            // this.targetBubble.setColor(config.targetBubble.default.bgColor, config.targetBubble.default.textColor);
        }
    }
    setTargetBubbleColor(param) {
        this.targetBubble.subSpriteList[0].setTextColor(param.textColor);
        this.targetBubble.borderColor = param.borderColor;
        this.targetBubble.opacity = param.opacity;
    }
    startBeltAnimation() {
        this.beltList.forEach(belt => belt.startAnimation(true));
    }
    // drawItself(ctx) {
    //     // super.drawItself(ctx);
    // }
}

function createTargetBubble(outputNode, param, target) {
    let { x: nodeX, y: nodeY, width: nodeWidth } = outputNode;
    let { dx, dy, side, bgColor, borderWidth, borderColor, fontSize } = param;

    let targetBubble = new Rect(nodeX + nodeWidth + dx, nodeY - side + dy, side, side, bgColor, borderColor);
    targetBubble.setBorderWidth(borderWidth);
    targetBubble.toggleShadow(true);

    let innerText = new TextBlock(0, 0, side, side, "=" + target.toString());
    innerText.setFontSize(fontSize);
    innerText.setTextCenter();
    targetBubble.addSubSprite(innerText);

    return targetBubble;
}

export { AssemblyLine };