import { ScrollerKnobs } from "../../Knobs/Scrollers.const";

export const EXAMPLE_NAMES = {
    split: "One button at each end",
    bothButtonsEnd: "Both buttons at the end",
    bothButtonsStart: "Both buttons at the start",
    tabbed: "Focus reveals what it lands on",
    focusableChildren: "Focusable children of any kind",
    verticalStrip: "A column scrolling down",
    bothWays: "A box scrolling both ways",
    overlaidAutoHiding: "A bar over the content that fades",
    shortTrack: "A short track between the step buttons",
    arched: "An arched bar",
};

export const EXAMPLES_ROOT = "/src/App/Pages/ScrollerPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/ScrollerPage/Docs";

export const PERCENT = 100;

export const toItemLabels = (count: number) => Array.from({ length: count }, (_, index) => `Item ${index + 1}`);

export const ITEM_LABELS = toItemLabels(ScrollerKnobs.STARTING_ITEM_COUNT);

export const GRID_SIZE = 12;

export const SHORT_TRACK_LENGTH = 120;

const FIRST_COLUMN_LETTER = 65;

export const getGridCellLabel = (row: number, column: number) =>
    `${String.fromCharCode(FIRST_COLUMN_LETTER + column)}${row + 1}`;

export const getMonthTabId = (month: string) => `scroller-tab-${month.toLocaleLowerCase()}`;

export const getMonthPanelId = (month: string) => `scroller-panel-${month.toLocaleLowerCase()}`;

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const DOCS_SECTIONS = {
    focusRevealsTarget: {
        title: "Focus reveals what it lands on",
        content:
            "The scroller never claims the arrow keys, so a tab list inside it walks its tabs with them as it would anywhere. Whatever takes focus, by keyboard or by pointer, is scrolled just far enough to show it whole: a tab already in view leaves the strip where it is, and one cut off by an edge comes into view with room left for its focus ring, which [prop]padding[/prop] sets aside.",
    },
    focusableChildrenAnyKind: {
        title: "Focusable children of any kind",
        content:
            "The strip holds whatever it is given and draws nothing around it. Here each item is a button, and tabbing through them pulls the strip along. A strip holding nothing focusable becomes a tab stop itself while it overflows, so the keyboard can still scroll it.",
    },
    drivenOutside: {
        title: "Driven from outside",
        content:
            'The position is [prop]progress[/prop], how far along each direction the box is scrolled from 0 to 1, and both sides can write it: the scroller reports it as it moves, and a value written to it scrolls the box there. That is what lets page dots, a progress bar or a "3 of 12" line outside the strip follow it and move it. Here the knob reads and writes how far across the strip is.',
    },
    shortTrackBetweenButtons: {
        title: "A short track between the step buttons",
        content:
            "The browser's own scrollbar is hidden, and wheel, touch and keyboard scrolling stay the browser's. Pass [prop]renderBar[/prop] to draw a bar of your own, a track and a thumb placed and sized however you like, and hand the library both through the refs it gives you. Its thumb then follows the scroll and can be dragged, and a press on the track pages towards the press, carrying on while held; with Alt (Option on a Mac) held, it jumps there instead.",
    },
    archedBar: {
        title: "An arched bar",
        content:
            "A track that is not a straight line needs [prop]computeProgressAtPoint[/prop], which turns where the pointer is into how far along the bar that is; here it reads the pointer's angle, so the thumb follows it round the curve. Set [prop]barSideX[/prop] to start and the bar sits above the content rather than below it.",
    },
    columnScrollingDown: {
        title: "A column scrolling down",
        content:
            "Set [prop]overflowX[/prop] to hidden and [prop]overflowY[/prop] to auto, and the box scrolls down instead: the children stack in a column, and a drawn bar keeps a strip of its own on the inline end. The buttons here are built on the controller's [prop]y[/prop] stepper, and the page puts them above and below.",
    },
    boxScrollingBothWays: {
        title: "A box scrolling both ways",
        content:
            "With both directions scrolling, each has its own stepper on the controller and its own bar, and the corner where the two bars meet is left empty. The page lays out the four buttons, here round the box. Each direction takes the values CSS gives overflow: auto shows the bar only while the content overruns, scroll always shows it, and hidden neither scrolls nor shows it.",
    },
    barThatFades: {
        title: "A bar over the content that fades",
        content:
            "Set [prop]isBarOverlaid[/prop] and a drawn bar floats over the content's edge instead of keeping a strip beside it. Set [prop]isAutoHiding[/prop] and the painter is told when the box is scrolling and when the pointer moves over it, so the bar can fade [prop]hideDelayMs[/prop] after scrolling stops and come back while the box scrolls or the pointer moves over it; a faded bar keeps its place, so nothing moves when it comes back. The two are independent.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the strip starts from the right and scrolls towards the left: a row of buttons laid out by the page puts the one stepping back on the right, the thumb starts at the right end of its track, and [prop]progress[/prop] still runs from 0 at the start to 1 at the end. The arrows drawn here are turned by the painter, which reads the direction.",
    },
};
