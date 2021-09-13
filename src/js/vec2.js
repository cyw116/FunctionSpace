class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    scalarMultiply(k) {
        this.x *= k;
        this.y *= k;
    }
    getNormal() {
        return new Vec2(-this.y, this.x);
    }
    normalize() {
        let length = this.getLength();
        this.x /= length;
        this.y /= length;
    }
    getLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}

export default Vec2;
