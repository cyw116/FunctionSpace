import Scene from "./scene.js";
import { TextBlock } from "../sprite/textblock.js";
import { UiButton } from "../sprite/uiButton.js";
import { Rect } from "../sprite/basicSprite.js";
import PuzzleScene from "./puzzleScene.js";
import { Sprite } from "../sprite/sprite.js";
import { Belt } from "../sprite/belt/belt.js";

let config = {
    canvasBGColor1: "#effae9",//"#EEFFEE",

    titleLabel: {
        x: 0,
        y: 80,
        width: 600,
        height: 100,
        textColor: "#633",//"#666699",
        fontSize: 60,
        text: ["Function Space"],

        fadeIn: { 
            fromOpacity: 0,
            beforeTime: 1200,
            fadeTime: 250,
            dx: 10,
            dy: 0
        }
    },
    gameEndLabel: {
        x: 0,
        y: 380,
        width: 600,
        height: 100,
        textColor: "#633",
        fontSize: 40,
        text: ["Game Completed! Thank you!"],

        fadeIn: { 
            fromOpacity: 0,
            beforeTime: 1200,
            fadeTime: 250,
            dx: 10,
            dy: 0
        }
    },
    region: {
        width: 500,
        height: 200,
        buttonWidth: 60,
        buttonHeight: 60,
        rowCount: 2,
        columnCount: 5,

        y: 200,
        borderColor: "#FFFFFF80",
        borderWidth: 5,

        fadeIn: { 
            fromOpacity: 0,
            beforeTime: 1500,
            fadeTime: 250,
            dx: 10,
            dy: 0
        }
    },
    belts: [
        // { x1: -20, y1: 100, x2: 620, y2: 20, styleIndex: 0 },
        { x1: -20, y1: 80, x2: 620, y2: 80, styleIndex: 0 },
        { x1: 620, y1: 180, x2: -20, y2: 180, styleIndex: 0 },
        { x1: 500, y1: -20, x2: 620, y2: 400, styleIndex: 1 },
        { x1: 120, y1: 500, x2: -20, y2: 400, styleIndex: 2 },
    ]
};

// Event Listeners ====================

let commandSet = {};
commandSet.commandSelectLevel = function(levelNum) {
    this.pushScene(new PuzzleScene(this.parentGame, levelNum));
};

let commandSelectLevelCurried = function(bindObject, levelNum) {
    return function(event) {
        (commandSet.commandSelectLevel.bind(bindObject))(levelNum);
    };
};

// TitleScene Constructor ====================
class TitleScene extends Scene {
    constructor(game) {
        super(game);

        this.setBg(config.canvasBGColor1);


        let titleLabel = createLabel(config.titleLabel);
        titleLabel.setFadeInConfig(config.titleLabel.fadeIn);
    
        this.addSpriteToLayer(this.layerData.layerUI, titleLabel);
        
        this.levelSelectBorder = createLevelSelectBorder(this, config.region);
        this.levelSelectRegion = createLevelSelectRegion(this, config.region);
        this.levelSelectBorder.addSubSprite(this.levelSelectRegion);
        this.levelSelectBorder.setFadeInConfig(config.region.fadeIn);
        this.addSpriteToLayer(this.layerData.layerUI, this.levelSelectBorder);

        config.belts.forEach(beltConfig => {
            let belt = createBelt(beltConfig);
            belt.startAnimation(false);
            this.addSpriteToLayer(this.layerData.layerBackground, belt);
        });
    }
    resume() {
        super.resume();

        let completedLevels = this.getStorageManager().getCompletedLevels();
        this.levelSelectRegion.subSpriteList.forEach(levelButton => {
            if (levelButton.level !== undefined && completedLevels.includes(levelButton.level)) {
                levelButton.highlight();
            }
        });

        let levelCount = config.region.columnCount * config.region.rowCount;
        if (completedLevels.length === levelCount && this.gameEndLabel === undefined) {
            // Thank you!
            this.gameEndLabel = createLabel(config.gameEndLabel);
            this.gameEndLabel.setFadeInConfig(config.gameEndLabel.fadeIn);
            this.addSpriteToLayer(this.layerData.layerUI, this.gameEndLabel);
        }
    }
}

function createBelt({ x1, y1, x2, y2, styleIndex }) {
    let beltStart = new Sprite(x1, y1);
    let beltEnd = new Sprite(x2, y2);
    let belt = new Belt(beltStart, beltEnd, styleIndex, false);
    belt.opacity = 0.8;

    return belt;
}

function createLevelSelectBorder(scene, { y, width, height, borderColor, borderWidth }) {
    let x = (scene.width - config.region.width) / 2;
    let levelSelectBorder = new Rect(x, y, width, height, "transparent", borderColor);//, borderWidth);
    levelSelectBorder.setBorderWidth(borderWidth);

    return levelSelectBorder;
}

function createLevelSelectRegion(scene, { width, height, buttonWidth, buttonHeight, rowCount, columnCount }) {
    let levelSelectRegion = new Sprite(0, 0, width, height);
    
    let paddingX = (width - buttonWidth * columnCount) / (columnCount + 1);
    let paddingY = (height - buttonHeight * rowCount) / (rowCount + 1);
    let completedLevels = scene.getStorageManager().getCompletedLevels();

    for (let i = 0; i < rowCount * columnCount; i++) {
        let row = Math.floor(i / columnCount);
        let column = i % columnCount;
        let buttonX = paddingX * (column+1) + buttonWidth * column;
        let buttonY = paddingY * (row+1) + buttonHeight * row;

        let levelButton = new UiButton(buttonX, buttonY, buttonWidth, buttonHeight, (i+1).toString());
        levelButton.level = i;
        levelButton.setClickListener(scene, commandSelectLevelCurried(scene, i));
        levelSelectRegion.addSubSprite(levelButton);

        if (completedLevels.includes(i)) {
            levelButton.highlight();
        }
    }

    return levelSelectRegion;
}

function createLabel(param) {
    let titleLabel = new TextBlock(param.x,
        param.y,
        param.width,
        param.height);
    titleLabel.setAllText(param.text);
    titleLabel.setTextColor(param.textColor);
    titleLabel.setFontSize(param.fontSize);
    titleLabel.setTextCenter();

    return titleLabel;
}

export default TitleScene;
