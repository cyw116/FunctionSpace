import { Sprite } from "../sprite/sprite.js"
import { PatternSprite, Rect } from "../sprite/basicSprite.js"
import { TextBlock } from "../sprite/textblock.js";

let config = {
    transition: {
        duration: 400,
        opacityStart: 1,
        opacityEnd: 1,
        darkOpacityStart: 0.2,
    },

    toast: {
        margin: 10,
        fadeTime: 500,
        dy: 100,
    }
}

// Scene ====================
class Scene {
    constructor(game) {

        // Display
        this.canvas = game.canvas;
        this.ctx = this.canvas.getContext("2d");

        // Event Listeners
        this.eventListeners = [];
        // Layers
        this.layerData = {
            layerBackground: new Sprite(0, 0),
            layerMain1: new Sprite(0, 0),
            layerMain2: new Sprite(0, 0),
            layerUI: new Sprite(0, 0)
        };
        this.layerList = [];
        this.layerList.push(this.layerData.layerBackground);
        this.layerList.push(this.layerData.layerMain1);
        this.layerList.push(this.layerData.layerMain2);
        this.layerList.push(this.layerData.layerUI);
        this.layerUpdateList = [];
        for (let i = 0; i < this.layerList.length; i++) {
            this.layerUpdateList.push(false);
        }
        this.hasUserInput = false;
        this.onlyDrawIfUpdate = true;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.opacity = config.transition.opacityStart;
        this.darkCurtainOpacity = 0; //transition.darkOpacityStart;
        this.isTransitionIn = false;
        this.isTransitionOut = false;

        // State
        this.isRunning = false;
        this.isAllowInput = false;

        // Parent Game (for navigation)
        this.parentGame = game;

        // Storage
        //this.storageManager = new storageModule.StorageManager();
        // this.gameDataManager = this.parentGame.gameDataManager;
        // this.currentListeners = {
        //     keydown: {},
        // };
        // this.setEventListener("keydown", null);
        this.currentListeners = {
            mousemove: {},
            mouseup: {},
        };

        this.setEventListener("mousemove", defaultMouseMoveListener);
        this.setEventListener("mouseup", defaultClickListener);

        this.bgm = null;
    }
    setBg(bgColor) {
        let background = new Rect(0, 0, this.canvas.width, this.canvas.height, bgColor);
        this.addSpriteToLayer(this.layerData.layerBackground, background);
        
        let patternSprite = new PatternSprite(0, 0, this.canvas.width, this.canvas.height, "bg1");
        this.addSpriteToLayer(this.layerData.layerBackground, patternSprite);
    }
    // Scene Transition ====================
    changeScene(sceneObj) {
        this.parentGame.changeScene(sceneObj);
    }
    pushScene(sceneObj) {
        this.parentGame.pushScene(sceneObj);
    }
    backScene() {
        this.parentGame.backScene();
    }
    backSceneTillOne() {
        this.parentGame.backSceneTillOne();
    }
    getStorageManager() {
        return this.parentGame.storageManager;
    }
    // openModal(sceneObj) {
    //     this.parentGame.openModal(sceneObj);
    // }
    // closeModal() {
    //     this.parentGame.closeModal();
    // }
    // Scene Draw & Update ====================
    draw() {

        // Optimization: If there are no updates, skip drawing the frame
        if (this.onlyDrawIfUpdate) {
            let hasUserInput = this.hasUserInput;
            this.hasUserInput = false;
            let areLayerNoUpdate = this.layerUpdateList.every(element => element === false);
            if (areLayerNoUpdate && !hasUserInput && this.darkCurtainOpacity <= 0) {
                return;
            }
        }
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        let layerCount = this.layerList.length;
        for (let i = 0; i < layerCount; i++) {
            const layer = this.layerList[i];
            // if (i !== layerCount - 1) {
            //     let isLayersAboveNoUpdate = this.layerUpdateList.slice(i).every(element => element === false);
            //     if (isLayersAboveNoUpdate && this.darkCurtainOpacity <= 0) {
            //         continue;
            //     }
            // }
            layer.draw(this.ctx, this.parentGame.imagePool);
        }
        if (this.darkCurtainOpacity > 0) {
            this.ctx.fillStyle = `rgba(100, 100, 100, ${this.darkCurtainOpacity})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.ctx.restore();
    }
    update(timeLapsed) {
        let layerCount = this.layerList.length;
        for (let i = 0; i < layerCount; i++) {
            const layer = this.layerList[i];
            this.layerUpdateList[i] = layer.update(timeLapsed);
        }

        if (this.isTransitionIn) {
            this.fadeIn(timeLapsed);
        }
        // else if (this.isTransitionOut) {
        //     this.fadeOut(timeLapsed);
        // // }
        // console.log(timeLapsed);
    }
    startFadeIn() {
        this.darkCurtainOpacity = config.transition.darkOpacityStart;
        this.isTransitionIn = true;
        //this.opacity = transition.opacityStart;
        //this.elapsedTransitionTime = 0;
        //console.log(this.opacity);
    }
    // startFadeOut() {
    //     this.isTransitionOut = true;
    // }
    fadeIn(timeLapsed) {
        if (!this.elapsedTime) {
            this.elapsedTime = 0;
        }
        if (this.elapsedTime < config.transition.duration) {
            this.elapsedTime += timeLapsed;
            this.darkCurtainOpacity = config.transition.darkOpacityStart * (1 - this.elapsedTime / config.transition.duration);
        }
        else {
            this.elapsedTime = 0;
            this.darkCurtainOpacity = 0;
            this.isTransitionIn = false;
        }
    }
    toast(text = "", beforeTime = 0, timeInterval = 1500) {
        let toastBox = new TextBlock(config.toast.margin, config.toast.margin, this.width - 2 * config.toast.margin);
        this.addSpriteToLayer(this.layerData.layerUI, toastBox);

        toastBox.opacity = 0;
        toastBox.setFontSize(20);
        toastBox.setText(text);
        toastBox.setFadeIn(0, beforeTime, config.toast.fadeTime, 0, config.toast.dy);
        
        setTimeout((() => {
            toastBox.setVisible(false);
            this.layerData.layerUI.removeSubSprite(toastBox);
        }).bind(this), timeInterval);
    }
    // fadeOut(timeLapsed) {
    //     if (!this.elapsedTime) {
    //         this.elapsedTime = 0;
    //     }
    //     if (this.elapsedTime < config.transition.duration) {
    //         this.elapsedTime += timeLapsed;
    //         //this.opacity = config.transition.opacityStart + (config.transition.opacityEnd - config.transition.opacityStart) * this.elapsedTime / config.transition.duration;
    //         this.darkCurtainOpacity = config.transition.darkOpacityStart * (this.elapsedTime / config.transition.duration);
    //     }
    //     else {
    //         this.elapsedTime = 0;
    //         this.darkCurtainOpacity = config.transition.darkOpacityStart;
    //         this.isTransitionOut = false;
    //     }
    // }
    // getImage(name) {
    //     return this.parentGame.imagePool.get(name);
    // }
    pause(pauseInputOnly = false) {
        this.clearEventListeners();
        this.pauseInput();
        if (!pauseInputOnly) {
            this.isRunning = false;
        }
    }
    resume() {
        this.isRunning = true;
        this.reAddEventListeners();
        this.allowInput();
        //this.playBGM(this.bgm);
    }
    // playBGM(bgmKey) {
    //     // this.parentGame.audioManager.playBGM(bgmKey);
    // }

    // Layers ====================
    clearLayer(layer) {
        layer.clear();
    }
    addSpriteToLayer(layer, sprite) {
        layer.addSubSprite(sprite);
        return true;
    }
    addSpriteListToLayer(layer, spriteList) {
        let i;
        for (i = 0; i < spriteList.length; i++) {
            layer.addSubSprite(spriteList[i]);
        }
        return true;
    }
    setLayerOrigin(layer, x, y) {
        layer.x = x;
        layer.y = y;
        return true;
    }

    // Input ====================
    pauseInput(timeoutMS) {
        this.isAllowInput = false;
        if (timeoutMS !== undefined) {
            setTimeout((function () { this.isAllowInput = true; }).bind(this), timeoutMS);
        }
    }
    resumeInput() {
        this.isAllowInput = true;
    }
    allowInput(ms = 0) {
        setTimeout((function () {
            this.isAllowInput = true;
            this.hasUserInput = true;
        }).bind(this), ms);
    }
    setEventListener(eventName, listener) {
        // Add the new event key
        if (!this.currentListeners.hasOwnProperty(eventName)) {
            this.currentListeners[eventName] = {};
        }
        if (!listener || this.currentListeners[eventName] === listener) {
            return;
        }
        this.canvas.removeEventListener(eventName, this.currentListeners[eventName]);
        this.currentListeners[eventName] = listener.bind(this);
        this.canvas.addEventListener(eventName, this.currentListeners[eventName]);
    }
    reAddEventListeners() {
        for (let eventName in this.currentListeners) {
            if (this.currentListeners.hasOwnProperty(eventName)) {
                this.canvas.addEventListener(eventName, this.currentListeners[eventName]);
            }
        }
    }
    clearEventListeners() {
        for (let eventName in this.currentListeners) {
            if (this.currentListeners.hasOwnProperty(eventName)) {
                this.canvas.removeEventListener(eventName, this.currentListeners[eventName]);
                //this.currentListeners[eventName] = null;
            }
        }
    }
    getMousePos(mouseEvent) {
        // https://stackoverflow.com/a/33063222

        // The Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: (mouseEvent.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width,
            y: (mouseEvent.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height
        };
    };
}

let defaultMouseMoveListener = function (event) {
    event.preventDefault();

    let mousePos = this.getMousePos(event);
    let spriteEvent = {
        globalPos: mousePos,
    };

    // Invisible elements are ignored
    let uiElementList = this.layerData.layerUI.subSpriteList.filter(element => element.isVisible && element.isEnabled);

    while (uiElementList.length > 0) {
        
        let uiElement = uiElementList.shift();
        uiElementList = uiElementList.concat(uiElement.subSpriteList.filter(element => element.isVisible && element.isEnabled));

        if (uiElement.isPointInside !== undefined && uiElement.hoverableObject !== null) {
            this.hasUserInput = true;

            if (uiElement.isPointInside(mousePos)) {
                uiElement.hover(spriteEvent);
            }
            else {
                uiElement.unhover(spriteEvent);
            }
        }
    }
};

let defaultClickListener = function (event) {
    event.preventDefault();
    
    if (!this.isAllowInput)  return;

    let mousePos = this.getMousePos(event);
    let spriteEvent = {
        globalPos: mousePos,
    };

    // Invisible elements are ignored
    let uiElementList = this.layerData.layerUI.subSpriteList.filter(element => element.isVisible && element.isEnabled);
    
    while (uiElementList.length > 0) {
        
        let uiElement = uiElementList.shift();
        uiElementList = uiElementList.concat(uiElement.subSpriteList.filter(element => element.isVisible && element.isEnabled));

        if (uiElement.isPointInside !== undefined
            && uiElement.isPointInside(mousePos)) {
            if (uiElement.clickableObject !== null) {
                uiElement.click(spriteEvent);
                
                this.hasUserInput = true;
                //this.playSFX(audioModule.SFX.BUTTON_CLICK);
                // Only 1 click listener at a time
                break;
            }
        }
    }
};

export default Scene;
