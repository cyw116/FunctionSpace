const NAMESPACE = "functionSpace";
const RECORD_VER = "version";
const PASSED_LEVEL = "passedLevels";

class StorageManager {
    constructor() {
        if (localStorage[NAMESPACE] === undefined) {
            // Init
            this.storageObj = {};
            this.storageObj[RECORD_VER] = 1;
            this.storageObj[PASSED_LEVEL] = [];

            save(this.storageObj);
        }
        else {
            this.storageObj = JSON.parse(localStorage[NAMESPACE]);
        }
    }
    completeLevel(levelNum) {
        if (!this.storageObj[PASSED_LEVEL].includes(levelNum)) {
            this.storageObj[PASSED_LEVEL].push(levelNum);

            save(this.storageObj);
        }
    }
    getCompletedLevels() {
        // Return a copy of the list
        return [].concat(this.storageObj[PASSED_LEVEL]);
    }
}

function save(storageObj) {
    localStorage[NAMESPACE] = JSON.stringify(storageObj);
    console.log("Save data updated.");
}

export { StorageManager };