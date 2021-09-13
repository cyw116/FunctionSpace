import { Sprite } from "./sprite.js"

let shadowConfig = {
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowBlur: 5,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
};

let rectConfig = {
    borderWidth: 1,
    lineJoin: "bevel",
};

class Rect extends Sprite {
    constructor(x, y, width, height, color, borderColor = "transparent") {
        super(x, y, width, height);
        this.width = width;
        this.height = height;
        this.color = color;
        this.borderColor = borderColor;
        this.hasShadow = false;
        this.borderWidth = rectConfig.borderWidth;
        this.lineJoin = rectConfig.lineJoin;
        //this.isDrawn = false;
        //this.cacheImageData = null;
        //this.cacheImage2 = null;
    }
    drawItself(ctx) {
        ctx.save();
        if (this.hasShadow) {
            ctx.shadowColor = shadowConfig.shadowColor;
            ctx.shadowBlur = shadowConfig.shadowBlur;
            ctx.shadowOffsetX = shadowConfig.shadowOffsetX;
            ctx.shadowOffsetY = shadowConfig.shadowOffsetY;
        }
        ctx.lineWidth = this.borderWidth;
        ctx.lineJoin = this.lineJoin;
        ctx.strokeStyle = this.borderColor;
        ctx.strokeRect(0, 0, this.width, this.height);
        // ctx.restore must be called before fillRect, otherwise the shadow affects the fillRect as well
        ctx.restore();
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        Sprite.prototype.drawItself.apply(this, arguments);
    }
    setBGColor(bgColor) {
        this.color = bgColor;
    }
    setBorderWidth(borderWidth) {
        this.borderWidth = borderWidth;
    }
    toggleShadow(hasShadow) {
        this.hasShadow = hasShadow;
    }
}

// Circle ====================
class Circle extends Sprite {
    constructor(x, y, radius, color, borderWidth = 0, borderColor = "#FFFFFF") {
        super(x, y);
        this.setRadius(radius);
        this.color = color;
        this.borderColor = borderColor;
        this.borderWidth = borderWidth;
    }
    drawItself(ctx) {
        Sprite.prototype.drawItself.apply(this, arguments);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        if (this.borderWidth > 0) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.stroke();
        }
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    setRadius(radius) {
        this.radius = radius;
        //this.width = 2 * radius;
        //this.height = 2 * radius;
    }
}

// Ring ====================
// class Ring extends Sprite {
//     constructor(x, y, radius, color, borderWidth = 1) {
//         super(x, y);
//         this.setRadius(radius);
//         this.color = color;
//         this.borderWidth = borderWidth;
//     }
//     drawItself(ctx) {
//         Sprite.prototype.drawItself.apply(this, arguments);
//         ctx.beginPath();
//         ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
//         if (this.borderWidth > 0) {
//             ctx.lineWidth = this.borderWidth;
//             ctx.strokeStyle = this.color;
//             ctx.stroke();
//         }
//     }
//     setRadius(radius) {
//         this.radius = radius;
//         this.width = 2 * radius;
//         this.height = 2 * radius;
//     }
// }

// RectRing ====================
class RectRing extends Sprite {
    constructor(x, y, width, height, color, borderWidth = 2) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.color = color;
        this.borderWidth = borderWidth;
    }
    drawItself(ctx) {
        Sprite.prototype.drawItself.apply(this, arguments);
        if (this.borderWidth > 0) {
            ctx.lineWidth = this.borderWidth;
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)"; //"#00000066";
            //ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.strokeStyle = this.color;
            ctx.strokeRect(0, 0, this.width, this.height);
        }
    }
}

class ImageSprite extends Sprite {
    constructor(x, y, width, height, imgName) {
        super(x, y, width, height);
        this.imgName = imgName;
    }
    drawItself(ctx, imagePool) {
        Sprite.prototype.drawItself.apply(this, arguments);

        let imgData = imagePool.get(this.imgName);
        ctx.drawImage(imgData, this.x, this.y, this.width, this.height);
    }
}

class PatternSprite extends Sprite {
    constructor(x, y, width, height, imgName) {
        super(x, y, width, height);
        this.imgName = imgName;
    }
    drawItself(ctx, imagePool) {
        Sprite.prototype.drawItself.apply(this, arguments);

        let imgData = imagePool.get(this.imgName);
        let pattern = ctx.createPattern(imgData, "repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, this.width, this.height);
    }
}

export { Rect, Circle, RectRing, ImageSprite, PatternSprite };
