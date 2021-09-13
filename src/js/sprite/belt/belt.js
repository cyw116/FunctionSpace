import Vec2 from "../../vec2.js";
import { BlinkBehavior, EaseInOutBehavior, EaseOutBackBehavior, Sprite } from "./../sprite.js"

const config = {
    beltColors: [
        "#99333380", "#33339980", "#33993380"
    ],
    waitTime: [
        100, 230, 370
    ],
    animationInterval: {
        replay: 2500,
        once: 1000
    }
};

class Belt extends Sprite {
    constructor(sprite1, sprite2, styleIndex = 0, isReplay = true) {
        let x1 = sprite1.x + sprite1.width / 2;
        let y1 = sprite1.y + sprite1.height / 2;
        let x2 = sprite2.x + sprite2.width / 2;
        let y2 = sprite2.y + sprite2.height / 2;
        super(0, 0);
        //super((x1 + x2)/2, (y1 + y2)/2);
        //this.isAnchorCenter = true;

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.styleIndex = styleIndex;

        if (styleIndex >= config.beltColors.length) {
            styleIndex = 0;
        }
        this.beltColor = config.beltColors[styleIndex];

        // if (isReplay) {
        //     this.setReplayAnimation(styleIndex, config.animationInterval.replay);
        // }
        // else {
        //     this.setOnceAnimation(config.animationInterval.once);
        // }
        // this.lerpT = 0.3;
        // let moveAnimation = new EaseInOutBehavior(this, "lerpT", 0.4, interval);
        // this.addBehavior(moveAnimation);

        // this.arrowOpacity = 0.0;
        // let blinkAnimation = new BlinkBehavior(this, "arrowOpacity", 0.8, interval);
        // this.addBehavior(blinkAnimation);

        // this.setAutoRestart(config.waitTime[styleIndex]);
    }
    startAnimation(isReplay) {
        if (isReplay) {
            this.setReplayAnimation(this.styleIndex, config.animationInterval.replay);
        }
        else {
            this.setOnceAnimation(config.animationInterval.once);
        }
    }
    setReplayAnimation(styleIndex, interval) {
        this.lerpT = 0.3;
        let moveAnimation = new EaseInOutBehavior(this, "lerpT", 0.4, interval);
        this.addBehavior(moveAnimation);

        this.arrowOpacity = 0.0;
        let blinkAnimation = new BlinkBehavior(this, "arrowOpacity", 0.8, interval);
        this.addBehavior(blinkAnimation);

        this.setAutoRestart(config.waitTime[styleIndex]);
    }
    setOnceAnimation(interval) {
        this.lerpT = 0.3;
        let moveAnimation = new EaseOutBackBehavior(this, "lerpT", 0.3, interval);
        this.addBehavior(moveAnimation);

        this.arrowOpacity = 0.0;
        let blinkAnimation = new EaseInOutBehavior(this, "arrowOpacity", 1, interval);
        this.addBehavior(blinkAnimation);
    }
    drawItself(ctx) {
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.beltColor;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();

        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "#FFFFFF";
        // ctx.setLineDash([5, 5]);

        // ctx.beginPath();
        // ctx.moveTo(this.x1, this.y1);
        // ctx.lineTo(this.x2, this.y2);
        // ctx.stroke();
        
        let arrowX = lerp(this.x1, this.x2, this.lerpT);
        let arrowY = lerp(this.y1, this.y2, this.lerpT);
        let dirVector = this.getDirUnitVector();
        dirVector.scalarMultiply(3);
        let normalVector = dirVector.getNormal();
        
        ctx.strokeStyle = "#333333";
        ctx.setLineDash([]);

        ctx.save();
        ctx.globalAlpha = ctx.globalAlpha * this.arrowOpacity;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + normalVector.x, arrowY + normalVector.y);
        ctx.lineTo(arrowX + dirVector.x, arrowY + dirVector.y);
        ctx.lineTo(arrowX - normalVector.x, arrowY - normalVector.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    getDirUnitVector() {
        let dirVector = new Vec2(this.x2 - this.x1, this.y2 - this.y1);
        dirVector.normalize();
        return dirVector;
    }
    // getNormalVector(multiplier) {
    //     return getDirUnitVector().scalarMultiply(multiplier).getNormal();
    // }
}

function lerp(start, end, t) {
    return start * (1-t) + end * t;
}

export { Belt };