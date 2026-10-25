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
