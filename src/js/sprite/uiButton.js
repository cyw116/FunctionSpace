import { TextBlock } from "./textblock.js";

const WINE = "#722f37";
const YELLOW = "#FF9";
const BLUE = "#6666CC80";
const LIGHT_GREY = "#EEE"

const config = {
    normal: {
        bgColor: LIGHT_GREY,
        textColor: WINE
    },
    hovered: {
        bgColor: WINE,
        textColor: LIGHT_GREY
    }
};

// UiButton ====================
class UiButton extends TextBlock {
    constructor(x, y, width = 80, height = 40, text = "") {
        super(x, y, width, height, text);

        this.setColor(config.normal.bgColor, config.normal.textColor);
        this.setBorder(4, WINE);
        this.setTextCenter();
        this.highlighted = false;

        this.setHoverListener(this, (event, isOn) => {
            if (isOn) {
                this.setColor(config.hovered.bgColor, config.hovered.textColor);
            }
            else {
                this.setColor(config.normal.bgColor, config.normal.textColor);
            }
        });
    }
    highlight() {
        if (!this.highlighted) {
            this.appendText("\u2713"); // Tick
            this.setBorder(10, YELLOW);
            this.highlighted = true;
        }
    }
}

export { UiButton };
