import { ImagePool } from "./imagePool.js";
import { levelDataList } from "./level/levelData.js";
import TitleScene from "./scene/titleScene.js";
import { StorageManager } from "./storageManager.js";

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.isSceneLoaded = false;
        this.imagePool = new ImagePool();
        this.storageManager = new StorageManager();
        //this.audioManager = null;//new audioModule.AudioManager();
        //this.gameDataManager = new dataModule.GameDataManager();
    }
    async startGameLoop() {
        if (!this.isSceneLoaded) {
            await this.preloadImages();
            this.loadScenes();
        }
        //this.audioManager.load();
        let stepFunction = gameStep(this);
        requestAnimationFrame(stepFunction);
    }
    async preloadImages() {
        this.imagePool.add("function_machine", "./img/function_machine.png");
        this.imagePool.add("bg1", "./img/bg1.png");
        this.imagePool.add("bg3", "./img/bg3.png");
        await this.imagePool.preload();
    }
    loadScenes() {
        this.sceneStack = [];
        this.currentScene = null;
        this.modalScene = null;
        this.isSceneLoaded = true;
    }
    changeScene(sceneObj) {
        this.backScene();
        this.pushScene(sceneObj);
    }
    pushScene(sceneObj) {
        // Stop the current scene
        if (this.currentScene) {
            this.currentScene.pause();
        }
        // Set the scene properly
        //sceneObj.setParentGame(this);
        this.currentScene = sceneObj;
        this.sceneStack.push(sceneObj);
        activateScene(this.currentScene);
    }
    backScene() {
        this.currentScene.pause();
        this.sceneStack.pop();
        if (this.sceneStack.length === 0) {
            this.currentScene = null;
        }
        else {
            this.currentScene = this.sceneStack[this.sceneStack.length - 1];
            activateScene(this.currentScene);
        }
    }
    backSceneTillOne() {
        while (this.sceneStack.length > 1) {
            this.backScene();
        }
    }
    // openModal(sceneObj, pauseInputOnly = true) {
    //     // Stop the current scene
    //     if (this.currentScene) {
    //         this.currentScene.pause(pauseInputOnly);
    //     }
    //     this.modalScene = sceneObj;
    //     this.modalScene.onlyDrawIfUpdate = false; // Always draw
    //     activateScene(this.modalScene, false);
    // }
    // closeModal() {
    //     if (this.modalScene !== null) {
    //         this.modalScene.pause(true);
    //         this.modalScene = null;
    //         activateScene(this.currentScene, false);
    //     }
    // }
    setCanvasConfig(canvasConfig) {
        if (this.canvas) {
            if (canvasConfig.canvasWidth) {
                this.canvas.setAttribute("width", canvasConfig.canvasWidth);
            }
            if (canvasConfig.canvasHeight) {
                this.canvas.setAttribute("height", canvasConfig.canvasHeight);
            }
        }
        // else {
        //     throw new Error("The game object does not have canvas.");
        // }
    }
    addImageData(dataKey, imageSource) {
        this.imgDataResource[dataKey] = imageData;
    }
}

// Private methods ====================
let gameStep = function(gameObj)  {
    let lastTimeStamp = null;
    
    return function step(nowTimeStamp) {
        let passedTimeMillisecond = (lastTimeStamp === null) ? 0 : (nowTimeStamp - lastTimeStamp);
        lastTimeStamp = nowTimeStamp;
    
        if (gameObj.currentScene !== null) {
            gameObj.currentScene.update(passedTimeMillisecond);
            gameObj.currentScene.draw();
        }
        
        if (gameObj.modalScene !== null) {
            gameObj.modalScene.update(passedTimeMillisecond);
            gameObj.modalScene.draw();
        }
        
        requestAnimationFrame(step);
    };  
};

let activateScene = function(scene, isFadeIn = true) {
    scene.resume();
    if (isFadeIn) {
        scene.startFadeIn();
    }
};

// The Actual Game ====================
class TheGame extends Game {
    constructor(canvas) {
        super(canvas);

        this.levelDataList = levelDataList;
    }
    getLevelData(levelNum) {
        return this.levelDataList[levelNum];
    }
    loadScenes() {
        super.loadScenes();
        this.pushScene(new TitleScene(this));
    }
}

export default TheGame;
