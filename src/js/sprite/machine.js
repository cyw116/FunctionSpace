import { Sprite } from "./sprite.js"
import { ImageSprite, Rect } from "./basicSprite.js"
import { TextBlock } from "./textblock.js";

class FunctionMachine extends Sprite {
    constructor(param = null, x = 0, y = 0, width = 60, height = 60) {
        super(x, y, width, height);
        this.func = null;
        this.param = param;

        let base = new ImageSprite(0, 0, width, height, "function_machine");
        super.addSubSprite(base);

        const padding = 5;
        this.textBlock = new TextBlock(0, 0, width - padding, height, "");
        this.textBlock.setTextCenter();
        this.textBlock.setText(this.getLabel());
        super.addSubSprite(this.textBlock);
    }
    getLabel() {
        return "";
    }
    setFunc(func) {
        this.func = func;
    }
    process(inputValue) {
        return this.func(inputValue);
    }
}

class IdentityMachine extends FunctionMachine {
    constructor() {
        super();
        this.func = x => x;
    }
}

class AdditionMachine extends FunctionMachine {
    constructor(param) {
        super(param);
        this.param = param;
        this.func = x => x + param;
    }
    getLabel() {
        if (this.param > 0) {
            return "+" + this.param;
        }
        else {
            return this.param.toString();
        }
    }
}

class MultiplicationMachine extends FunctionMachine {
    constructor(param) {
        super(param);
        this.param = param;
        this.func = x => x * param;
    }
    getLabel() {
        if (this.param >= 0) {
            return "\u00D7" + this.param;
        }
        else {
            return `*(${this.param})`;
        }
    }
}

class SquareMachine extends FunctionMachine {
    constructor() {
        super();
        this.func = x => x * x;
    }
    getLabel() {
        return "SQ";
    }
}

class FloorMachine extends FunctionMachine {
    constructor() {
        super();
        this.func = x => Math.floor(x);
    }
    getLabel() {
        return "\u230A \u230B";
    }
}

class FlipSignMachine extends FunctionMachine {
    constructor() {
        super();
        this.func = x => -x;
    }
    getLabel() {
        return "-";
    }
}

export { FunctionMachine, 
    IdentityMachine,
    AdditionMachine,
    MultiplicationMachine,
    SquareMachine,
    FloorMachine,
    FlipSignMachine };

