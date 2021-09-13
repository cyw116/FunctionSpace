class ImagePool {
    constructor() {
        this.urlRecord = {};
        this.pool = {};
    }
    add(name, imgSourceUrl) {
        if (this.urlRecord[name] === undefined) {
            this.urlRecord[name] = imgSourceUrl;
        }
    }
    async preload() {
        let inputList = Object.entries(this.urlRecord).map(([key, value]) => ({key,value}));

        //let urlList = Object.values(this.urlRecord);
        let promiseList = inputList.map(data => new loadImagePromise(data));
        let loadedImageList = await Promise.all(promiseList);

        loadedImageList.forEach(data => {
            this.pool[data.key] = data.img;
        });

        return true;
    }
    get(name) {
        return this.pool[name];
    }
}

function loadImagePromise(data) {
    return new Promise(function(resolve) {
        let img = new Image();

        img.src = data.value;
        img.onload = (event) => {
            resolve({ key: data.key, img: img });
        };
    });
}

export { ImagePool };
