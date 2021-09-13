class ClickableObject {
    constructor(sprite, bindObject, clickListener) {
        this.sprite = sprite;
        if (clickListener !== undefined && clickListener !== null) {
            this.clickListener = clickListener.bind(bindObject);
        }
        else {
            this.clickListener = null;
        }
    }
    click(event) {
        if (this.clickListener !== null && this.sprite.isEnabled) {
            this.clickListener(event);
        }
    }
}

class HoverableObject {
    constructor(sprite, bindObject, hoverListener) {
        this.sprite = sprite;
        this.isHovered = false;

        if (hoverListener !== undefined && hoverListener !== null) {
            this.hoverListener = hoverListener.bind(bindObject);
        }
        else {
            this.hoverListener = null;
        }
    }
    hover(event) {
        if (this.sprite.isEnabled && !this.isHovered) {
            this.toggleHovered(event, true);
        }
    }
    unhover(event) {
        if (this.sprite.isEnabled && this.isHovered) {
            this.toggleHovered(event, false);
        }
    }
    toggleHovered(event, isOn) {
        this.isHovered = isOn;
        this.sprite.isInFocus = isOn;
        //this.sprite.focus(false);

        if (this.hoverListener !== null) {
            this.hoverListener(event, isOn);
        }
    }
}

export { ClickableObject, HoverableObject }