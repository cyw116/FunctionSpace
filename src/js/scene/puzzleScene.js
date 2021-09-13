import Scene from "./scene.js";
import { TextBlock } from "../sprite/textblock.js";
import { NumberNode, MachineNode } from "../sprite/node.js";
import { AssemblyLine } from "../sprite/belt/assemblyLine.js";
import { InventoryPanel } from "../sprite/inventoryPanel.js";
import { MachineInventory } from "../machineInventory.js";
import { ImageSprite, PatternSprite, Rect } from "../sprite/basicSprite.js";
import { UiButton } from "../sprite/uiButton.js";



// Settings that are applicable to all games
const INIT_ANIMATION_TIME = 1000;

const config = {
    
    // Canvas
    canvasBGColor1: "#effae9",//"#EEFFEE",

    titleLabel: {
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        textColor: "#633",//"#666699",
        fontSize: 80,
        text: ["Function", "Space", "Level"],
    },

    buttonPanel: {
        x: 160,
        y: 300,
        width: 280,
        height: 160,
        bgColor: "#f0f0fff0",
        borderColor: "#000",
        borderWidth: 4,
        fontSize: 40,
        text: "Level Clear!",
        textHeight: 100,
        buttonWidth: 110,
        buttonHeight: 40,
        backButton: {
            x: 20,
            y: 100,
            text: "Select Level"
        },
        nextButton: {
            x: 150,
            y: 100,
            text: "Next"
        },

        fadeIn: { 
            fromOpacity: 0,
            beforeTime: 1000,
            fadeTime: 500,
            dx: 0,
            dy: -40
        }
    },

    nodeFadeIn: { 
        fromOpacity: 0,
        beforeTime: 0,
        fadeTime: INIT_ANIMATION_TIME,
        dx: 100,
        dy: 0
    },
    lineFadeIn: { 
        fromOpacity: 0,
        beforeTime: 0,
        fadeTime: INIT_ANIMATION_TIME,
        dx: 0,
        dy: -100
    },
    fixedBackButton: {
        margin: 10,
        height: 40,
        text: "Back"
    }
};

// Event Listeners ====================

let commandSet = {};

commandSet.commandApply = function(functionNode) {
    this.applyMachineToNode(functionNode);
};

let commandApplyCurried = function(bindObject, functionNode) {
    return function(event) {
        (commandSet.commandApply.bind(bindObject))(functionNode);
    };
};

commandSet.commandNext = function(nextLevelNum) {
    this.changeScene(new PuzzleScene(this.parentGame, nextLevelNum));
};

let commandNextCurried = function(bindObject, levelNum) {
    return function(event) {
        (commandSet.commandNext.bind(bindObject))(levelNum);
    };
};

commandSet.commandBack = function() {
    //this.resetLayer();
    this.backScene();
};

// PuzzleScene Constructor ====================
class PuzzleScene extends Scene {
    constructor(game, levelNum = 0) {
        super(game);
        this.levelNum = levelNum;

        this.setBg(config.canvasBGColor1);
        this.toast("Level " + (levelNum + 1).toString());

        let titleLabel = createTitleLabel(config.titleLabel, levelNum + 1);
        this.addSpriteToLayer(this.layerData.layerBackground, titleLabel);
        
        this.fixedBackButton = createBackButton(config.fixedBackButton, this);

        let isLastLevel = levelNum === 9; // Hard-code because lack of time
        this.buttonPanel = createButtonPanel(config.buttonPanel, levelNum, this, isLastLevel);

        const levelData = game.getLevelData(levelNum);
        this.processLevelData(levelData);

        setTimeout((() => {
            this.addSpriteToLayer(this.layerData.layerUI, this.fixedBackButton);
            if (this.inventoryPanel) {
                this.addSpriteToLayer(this.layerData.layerUI, this.inventoryPanel);  
            }

            if (this.assemblyLineList) {
                this.assemblyLineList.forEach((element) => {
                    element.startBeltAnimation();
                });
            }
        }).bind(this), INIT_ANIMATION_TIME);
    }
    processLevelData(levelData) {
        let inputNodeList = levelData.inputNodes.map(data => new NumberNode(data.x, data.y, data.value));
        let outputNodeList = levelData.outputNodes.map(data => new NumberNode(data.x, data.y));
        let machineNodeList = levelData.machineNodes.map(data => new MachineNode(data.x, data.y));
        
        machineNodeList.forEach(node => node.setClickListener(this, commandApplyCurried(this, node)));

        this.nodeList = inputNodeList.concat(outputNodeList).concat(machineNodeList);
        this.assemblyLineList = levelData.lines.map((data,index) => {
            let inputNode = inputNodeList[data.in];
            let outputNode = outputNodeList[data.out];
            let betweenNodeList = data.between.map(value => machineNodeList[value]);
            return new AssemblyLine(inputNode, outputNode, betweenNodeList, data.target, index);
        });
        this.assemblyLineList.forEach(line => line.run());

        this.nodeList.forEach((element) => {
            element.setFadeInConfig(config.nodeFadeIn);
            this.addSpriteToLayer(this.layerData.layerUI, element);
        });

        this.assemblyLineList.forEach((element) => {
            element.setFadeInConfig(config.lineFadeIn);
            this.addSpriteToLayer(this.layerData.layerMain1, element);
        });

        this.machineInventory = new MachineInventory(levelData.machines);

        let inventoryPanelWidth = this.width * 0.15;
        this.inventoryPanel = new InventoryPanel(this.width - inventoryPanelWidth, 0, inventoryPanelWidth, this.height, this.machineInventory);
        // Add inventoryPanel after INIT_ANIMATION_TIME passed.
    }
    selectMachine(index) {
        this.inventoryPanel.select(index);
    }
    applyMachineToNode(functionNode) {
        let functionMachine = this.inventoryPanel.use();

        if (functionMachine) {
            functionNode.setFunctionMachine(functionMachine);
            this.refreshLine();
        }
    }
    refreshLine() {
        this.assemblyLineList.forEach(element => {
            element.run();
        });

        let isComplete = this.assemblyLineList.every(element => element.isTargetMet === true);
        if (isComplete) {
            this.disableGameplayInput();
            
            this.getStorageManager().completeLevel(this.levelNum);

            this.buttonPanel.setFadeInConfig(config.buttonPanel.fadeIn);
            this.addSpriteToLayer(this.layerData.layerUI, this.buttonPanel);
        }
    }
    disableGameplayInput() {
        this.nodeList.forEach(element => element.isEnabled = false);
        this.inventoryPanel.isEnabled = false;
        this.fixedBackButton.isEnabled = false;
    }
}

function createTitleLabel(param, levelNum) {
    let titleLabel = new TextBlock(param.x,
        param.y,
        param.width,
        param.height);
    titleLabel.setAllText(param.text.concat(levelNum.toString()));
    titleLabel.setTextColor(param.textColor);
    titleLabel.setFontSize(param.fontSize);
    // titleLabel.setTextCenter();
    titleLabel.opacity = 0.05;

    return titleLabel;
}

function createBackButton(param, scene) {
    let { margin, height, text } = param;
    let backButton = new UiButton(margin, scene.height - height - margin);
    backButton.setText(text);
    backButton.setClickListener(scene, commandSet.commandBack);

    return backButton;
}


function createButtonPanel(param, levelNum, scene, isLastLevel) {
    let { x, y, width, height, bgColor, borderColor, borderWidth, text, textHeight, fontSize } = param;
    let buttonPanel = new Rect(x, y, width, height, bgColor, borderColor);
    buttonPanel.setBorderWidth(borderWidth);

    let patternSprite = new PatternSprite(0, 0, width, height, "bg3");
    buttonPanel.addSubSprite(patternSprite);

    let clearLevelText = new TextBlock(0, 0, width, textHeight, text);
    clearLevelText.setFontSize(fontSize);
    clearLevelText.setTextCenter();
    buttonPanel.addSubSprite(clearLevelText);

    let { buttonWidth, buttonHeight } = param;
    
    ({ x, y, text } = param.backButton);
    let backButton = new UiButton(x, y, buttonWidth, buttonHeight, text);
    backButton.setClickListener(scene, commandSet.commandBack);
    buttonPanel.addSubSprite(backButton);

    if (!isLastLevel) { 
        ({ x, y, text } = param.nextButton);
        let nextButton = new UiButton(x, y, buttonWidth, buttonHeight, text);
        nextButton.setClickListener(scene, commandNextCurried(scene, levelNum + 1));
        buttonPanel.addSubSprite(nextButton);
    }
    
    return buttonPanel;
}
    
export default PuzzleScene;
