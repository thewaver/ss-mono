export namespace CardStackKnobs {
    export const MIN_COMMIT_RATIO = 0.05;
    export const MAX_COMMIT_RATIO = 0.9;
    export const COMMIT_RATIO_STEP = 0.05;

    export const MIN_DURATION_MS = 0;
    export const MAX_DURATION_MS = 2000;
    export const DURATION_STEP_MS = 50;

    export const MIN_MOUNTED_COUNT = 1;
    export const MAX_MOUNTED_COUNT = 13;
    export const MOUNTED_COUNT_STEP = 1;

    export const MIN_CARD_GAP = 0;
    export const MAX_CARD_GAP = 12;
    export const CARD_GAP_STEP = 2;

    export const MIN_FUNNEL_RATIO = 0;
    export const MAX_FUNNEL_RATIO = 0.25;
    export const FUNNEL_RATIO_STEP = 0.01;

    export const STARTING_IS_DISABLED = false;

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the stack off, so no card moves by gesture, button or key.",
        controls: "Sets CardStackProps.isDisabled",
    };

    export const COMMIT_RATIO_TEXT = {
        label: "Commit ratio",
        hint: "How far across the stack a card has to be pushed before it leaves. Let go short of it and it springs back.",
        controls: "Sets CardStackProps.commitRatio",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Duration (ms)",
        hint: "How long a card takes to fly out, and how long one that fell short takes to settle back.",
        controls: "Sets CardStackProps.transitionDurationMs",
    };

    export const MOUNTED_COUNT_TEXT = {
        label: "Mounted cards",
        hint: "How many cards are in the document at once, counting the top one.",
        controls: "Sets CardStackProps.mountedCount",
    };

    export const CARD_GAP_TEXT = {
        label: "Card gap (px)",
        hint: "How far apart the cards in the pile sit. The bottom one fills the stack's box, and each card above it is lifted by one more of these.",
        controls: "Sets CardStackProps.cardGap",
    };

    export const FUNNEL_RATIO_TEXT = {
        label: "Funnel",
        hint: "How much narrower each card is than the one in front of it. The top card is the widest and fills the stack; 0 stacks cards of equal width.",
        controls: "Sets CardStackProps.funnelRatio",
    };

    export const PILE_SIDE_TEXT = {
        label: "Pile side",
        hint: "The edge the cards behind the top one peek out of: below the top card, or above it.",
        controls: "Sets CardStackProps.pileSide",
    };
}
