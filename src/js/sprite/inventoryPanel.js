import { PatternSprite, Rect } from "./basicSprite.js";
import { Sprite } from "./sprite.js";
import { MachineNode } from "./node.js";

const config = {
    normal: {
        bgColor: "#CCD",
        borderColor: "#FFF",
        marginY: 20
    },
    selected: {
        borderColor: "#FF9"
    }
};

class InventoryPanel extends Sprite {
    constructor(x, y, width, height, machineInventory) {
        super(x, y, width, height);
        this.machineInventory = machineInventory;
        this.selectedIndex = null;

        this.background = new Rect(0, 0, width, height, config.normal.bgColor, "#FFF");
        this.background.setBorderWidth(5);
        this.addSubSprite(this.background);

        let patternSprite = new PatternSprite(0, 0, width, height, "bg1");
        this.addSubSprite(patternSprite);

        this.machineIconList = [];
        machineInventory.machineList.forEach((element, index) => {
            let machineIcon = new Rect(0, config.normal.marginY + 80 * index, 60, 60, "#FFFFFF40", config.normal.borderColor);
            machineIcon.setBorderWidth(3);
            machineIcon.x = (width - machineIcon.width) /2;
            machineIcon.addSubSprite(element);
            //let machineIcon = new Rect(0, 50 * index, 40, 40, "transparent", "#000");
            //machineIcon.index = index;
            this.machineIconList.push(machineIcon);
            this.addSubSprite(machineIcon);
        });

        this.setClickInventoryListener();
    }
    select(index) {
        if (index < this.machineIconList.length) {
            this.machineIconList.forEach(element => element.borderColor = config.normal.borderColor);

            this.machineIconList[index].borderColor = config.selected.borderColor;
            this.selectedIndex = index;
            return true;
        }
        else {
            return false;
        }
    }
    use() {
        if (this.selectedIndex !== null) {
            return this.machineInventory.use(this.selectedIndex);
        }
        else {
            return false;
        }
    }
    setClickInventoryListener() {
        
        this.machineIconList.forEach((element, index) => {
            element.setClickListener(this, (event) => {
                this.select(index);
            });
        });
    }
}

export { InventoryPanel };
