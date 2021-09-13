import { AdditionMachine, FlipSignMachine, FloorMachine, MultiplicationMachine, SquareMachine } from "./sprite/machine.js";

class MachineInventory {
    constructor(machineData) {
        this.capacity = machineData.length;
        this.machineList = [];

        this.parseMachineData(machineData);
    }
    // push(machine) {
    //     if (this.machineList.length <= this.capacity) {
    //         this.machineList.push(machine);
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
    use(index) {
        // Unlimited supply
        return this.machineList[index];
        
        // let machine = this.machineList.splice(index, 1);
        // return machine[0];
    }
    parseMachineData(machineData) {
        machineData.forEach(data => {
            let machine;
            switch (data.type) {
                case 1:
                    machine = new AdditionMachine(data.param);
                    break;
                case 2:
                    machine = new MultiplicationMachine(data.param);
                    break;
                case 3:
                    machine = new SquareMachine();
                    break;
                case 4:
                    machine = new FloorMachine();
                    break;
                case 5:
                    machine = new FlipSignMachine();
                    break;
            }

            this.machineList.push(machine);
        });
    }
}

export { MachineInventory };
