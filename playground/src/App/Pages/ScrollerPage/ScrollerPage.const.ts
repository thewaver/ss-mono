export const EXAMPLE_NAMES = {
    split: "One button at each end",
    bothButtonsEnd: "Both buttons at the end",
    bothButtonsStart: "Both buttons at the start",
    tabbed: "Focus reveals what it lands on",
    focusableChildren: "Focusable children of any kind",
};

export const EXAMPLES_ROOT = "/src/App/Pages/ScrollerPage/Examples";

export const PERCENT = 100;

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
