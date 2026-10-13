export const WORD_LETTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const WORD_LENGTH = 7;

export const WORDS = ["LONDON", "PARIS", "TOKYO", "BERLIN", "OSLO", "MADRID", "LIMA"].map((word) =>
    word.padEnd(WORD_LENGTH),
);

export const EXAMPLE_NAMES = {
    counter: "Counter",
    reels: "Reels",
    splitFlap: "Departures board",
    words: "Words, a letter at a time",
};

export const EXAMPLES_ROOT = "/src/App/Pages/SlotTextPage/Examples";

export const ZERO = 0;

export const SMALL_STEP = 1;

export const BIG_STEP = 137;

export const GROUP_SIZE = 3;

export const FIRST = 0;

export const REEL_DIGITS = 4;

export const REEL_PAD = "0";

export const REEL_RANGE = 10 ** REEL_DIGITS;

export const STARTING_REEL_VALUE = 7;

export const FIELD_WIDTH = 130;

export const STEPS = [
    { id: "stepDown", flapId: "flapStepDown", label: `take ${SMALL_STEP}`, delta: -SMALL_STEP },
    { id: "stepUp", flapId: "flapStepUp", label: `add ${SMALL_STEP}`, delta: SMALL_STEP },
    { id: "jumpUp", flapId: "flapJumpUp", label: `add ${BIG_STEP}`, delta: BIG_STEP },
];
