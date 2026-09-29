export type NumberInputRangeDefs = {
    min?: number;
    max?: number;
};

export type NumberInputStepDefs = NumberInputRangeDefs & {
    step: number;
};

export type NumberInputSeparators = {
    groupSeparator: string;
    decimalSeparator: string;
};

export type NumberInputKeyMove = { direction: 1 | -1; distance?: number } | { value: number };

export type NumberInputStepRepeater = {
    start: (step: () => boolean) => boolean;
    stop: () => boolean;
};

export type NumberInputStepper = {
    /** Whether the number sits at or below the lowest allowed value. */
    getIsAtMin: () => boolean;
    /** Whether the number sits at or above the highest allowed value. */
    getIsAtMax: () => boolean;
    /** Moves the number up one step. Answers `false` when the field is disabled or read-only, or the number is already at the top. */
    stepUp: () => boolean;
    /** Moves the number down one step. Answers `false` when the field is disabled or read-only, or the number is already at the bottom. */
    stepDown: () => boolean;
    /** Steps up once and keeps stepping while held. Answers `false`, and does not repeat, when the first step is refused. */
    startSteppingUp: () => boolean;
    /** Steps down once and keeps stepping while held. Answers `false`, and does not repeat, when the first step is refused. */
    startSteppingDown: () => boolean;
    /** Stops a held step from repeating. Answers `false` when nothing was repeating. */
    stopStepping: () => boolean;
};
