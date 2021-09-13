const levelDataList = [];

// Level 1
levelDataList.push({
    inputNodes: [
        {x: 60, y: 100, value: 1},
        {x: 60, y: 200, value: 2},
        {x: 60, y: 300, value: 3},
    ],
    outputNodes: [
        {x: 400, y: 100},
        {x: 400, y: 200},
        {x: 400, y: 300},
    ],
    machineNodes: [
        {x: 230, y: 100},
        {x: 230, y: 200},
        {x: 230, y: 300},
    ],
    lines: [
        {in: 0, out: 0, between: [0], target: 2},
        {in: 1, out: 1, between: [1], target: 5},
        {in: 2, out: 2, between: [2], target: 9}
    ],
    machines: [
        {type: 1, param: 3},
        {type: 2, param: 2},
        {type: 3},
    ]
});

// Level 2
levelDataList.push({
    inputNodes: [
        {x: 40, y: 100, value: 2},
        {x: 40, y: 300, value: 4},
    ],
    outputNodes: [
        {x: 360, y: 100},
        {x: 360, y: 300},
    ],
    machineNodes: [
        {x: 200, y: 200},
    ],
    lines: [
        {in: 0, out: 1, between: [0], target: 4},
        {in: 1, out: 0, between: [0], target: 8}
    ],
    machines: [
        {type: 1, param: 2},
        {type: 1, param: 4},
        {type: 2, param: 2},
        {type: 2, param: 4},
    ]
});

// Level 3
levelDataList.push({
    inputNodes: [
        {x: 50, y: 200, value: 6},
    ],
    outputNodes: [
        {x: 350, y: 200},
    ],
    machineNodes: [
        {x: 200, y: 100},
        {x: 200, y: 200},
        {x: 200, y: 300},
    ],
    lines: [
        {in: 0, out: 0, between: [0, 1, 2], target: 50}
    ],
    machines: [
        {type: 1, param: 1},
        {type: 3},
    ]
});

// Level 4
levelDataList.push({
    inputNodes: [
        {x: 50, y: 350, value: 1},
    ],
    outputNodes: [
        {x: 350, y: 150},
    ],
    machineNodes: [
        {x: 150, y: 150},
        {x: 250, y: 350},
    ],
    lines: [
        {in: 0, out: 0, between: [0, 1], target: 0},
    ],
    machines: [
        {type: 1, param: 1},
        {type: 5},
    ]
});

// Level 5
levelDataList.push({
    inputNodes: [
        {x: 50, y: 50, value: 5},
    ],
    outputNodes: [
        {x: 400, y: 400},
        {x: 250, y: 400},
    ],
    machineNodes: [
        {x: 150, y: 150},
        {x: 250, y: 150},
        {x: 250, y: 250},
    ],
    lines: [
        {in: 0, out: 0, between: [0, 2], target: 25},
        {in: 0, out: 1, between: [0, 1, 2], target: 16}
    ],
    machines: [
        {type: 1, param: 1},
        {type: 3},
        {type: 5},
    ]
});

// Level 6
levelDataList.push({
    inputNodes: [
        {x: 150, y: 50, value: 3},
        {x: 350, y: 50, value: 6},
    ],
    outputNodes: [
        {x: 150, y: 400},
        {x: 350, y: 400},
    ],
    machineNodes: [
        {x: 150, y: 150},
        {x: 150, y: 250},
    ],
    lines: [
        {in: 0, out: 0, between: [0, 1], target: 1},
        {in: 1, out: 1, between: [0, 1], target: 2}
    ],
    machines: [
        {type: 2, param: 0.2},
        {type: 2, param: 0.4},
        {type: 2, param: 0.5},
        {type: 4},
    ]
});

// Actual challenges start

// Level 7
levelDataList.push({
    inputNodes: [
        {x: 100, y: 50, value: 9},
    ],
    outputNodes: [
        {x: 250, y: 200},
    ],
    machineNodes: [
        {x: 100, y: 300},
        {x: 400, y: 300},
        {x: 400, y: 50},
        {x: 250, y: 50},
    ],
    lines: [
        {in: 0, out: 0, between: [0, 1, 2, 3], target: 5}
    ],
    machines: [
        {type: 2, param: 0.5},
        {type: 4},
        {type: 5},
    ]
});

// Level 8
levelDataList.push({
    inputNodes: [
        {x: 50, y: 150, value: 1},
        {x: 50, y: 250, value: 2},
        {x: 170, y: 50, value: 3},
        {x: 290, y: 50, value: 4},
    ],
    outputNodes: [
        {x: 410, y: 150},
        {x: 410, y: 250},
        {x: 170, y: 400},
        {x: 290, y: 400},
    ],
    machineNodes: [
        {x: 170, y: 150},
        {x: 290, y: 150},
        {x: 170, y: 250},
        {x: 290, y: 250},
    ],
    lines: [
        {in: 0, out: 0, between: [0, 1], target: 36},
        {in: 1, out: 1, between: [2, 3], target: 16},
        {in: 2, out: 2, between: [0, 2], target: 10},
        {in: 3, out: 3, between: [1, 3], target: 96}
    ],
    machines: [
        {type: 1, param: 2},
        {type: 1, param: 5},
        {type: 2, param: 4},
        {type: 2, param: 6},
        {type: 3},
    ]
});

// Level 9
levelDataList.push({
    inputNodes: [
        {x: 120, y: 20, value: 13},
        {x: 260, y: 20, value: 12},
        {x: 400, y: 20, value: 10},
    ],
    outputNodes: [
        {x: 120, y: 400},
        {x: 260, y: 400},
        {x: 400, y: 400},
    ],
    machineNodes: [
        {x: 120, y: 120},
        {x: 260, y: 120},
        {x: 400, y: 120},

        {x: 260, y: 200},
        {x: 400, y: 200},

        {x: 260, y: 280},
    ],
    lines: [
        {in: 0, out: 0, between: [0, 3], target: 6},
        {in: 1, out: 1, between: [1, 3, 5], target: 5},
        {in: 2, out: 2, between: [2, 4, 5], target: 2}
    ],
    machines: [
        {type: 1, param: -1},
        {type: 2, param: 0.5},
        {type: 4},
    ]
});

// Level 10 - 2021.13
levelDataList.push({
    inputNodes: [
        {x: 30, y: 240, value: 10},
        {x: 30, y: 30, value: -11},
    ],
    outputNodes: [
        {x: 400, y: 210},
        {x: 400, y: 400},
    ],
    machineNodes: [
        {x: 100, y: 100},
        {x: 350, y: 120},
        {x: 300, y: 360},
        {x: 200, y: 360},
        {x: 90, y: 320},
        {x: 150, y: 190},
    ],
    lines: [
        {in: 0, out: 0, between: [0, 1, 2, 3, 4, 5], target: 2021},
        {in: 1, out: 1, between: [0, 5, 2], target: 13}
    ],
    machines: [
        {type: 1, param: 1},
        {type: 2, param: 2},
        {type: 2, param: 10},
        {type: 3},
        {type: 5},
    ]
});

export { levelDataList };
