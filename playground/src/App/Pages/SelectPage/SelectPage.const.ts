export const EXAMPLE_NAMES = {
    default: "Default",
    preselected: "Preselected",
    clearable: "Clearable",
    recordValues: "Record values",
    titleDescription: "Title and description",
    optionGroups: "Option groups",
    groupBoxes: "Group boxes",
    disabledOptions: "Disabled options",
    disabledOptionsReachable: "Disabled options + reachable",
    scrollingList: "Scrolling list",
    virtualized: "Virtualized",
    virtualizedGroups: "Virtualized, in groups",
    onDemand: "Loaded on demand",
    autocomplete: "Autocomplete",
    autocompleteOnDemand: "Autocomplete, loaded on demand",
    errored: "Error",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
    label: "In a Label",
};

export const PAGE_SIZE = 40;

export const PAGED_TOTAL = 500;

export const PAGE_DELAY_MS = 600;

export const STRESS_COUNT_FIELD_WIDTH = 120;

export const EXAMPLES_ROOT = "/src/App/Pages/SelectPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/SelectPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the pick starts from the right of the field, and the arrow and the clear button sit at its left end.",
    },
    clearingPick: {
        title: "Clearing the pick",
        content:
            "Give it [prop]renderClear[/prop] and a clear button sits at the end of the field, drawn only while something is picked and reached with the Tab key after the field. It needs [prop]clearAriaLabel[/prop] to name it, and pressing it empties the value and reports the change like any other pick.",
    },
    recordsValues: {
        title: "Records as values",
        content:
            "An option's value can be any record, not only a string. Here each airport is an object, and the field and the options draw whichever of its parts you choose.",
    },
    moreThanName: {
        title: "More than a name",
        content:
            "An option draws whatever its painter gives it, here a name with a line of detail beneath it, and is still one option to the arrow keys and to typing.",
    },
    groups: {
        title: "Groups",
        content:
            "Options can sit in groups under headings: a screen reader announces the group, and the arrow keys walk past the headings. A box drawn around each group is optional, through [prop]renderGroupBox[/prop].",
    },
    disabledOptions: {
        title: "Disabled options",
        content:
            "An option can be disabled: the arrow keys and typing skip it, and it cannot be picked. Kept reachable when disabled, the arrow keys stop on it instead, so a tooltip can say why it is off.",
    },
    manyOptions: {
        title: "Many options",
        content:
            "Give it an estimated option height and only the options in view are built, so a list of a hundred thousand opens about as fast as one of fifty. The line under the field shows how long the list took to open and how smoothly it runs while open.",
    },
    loadedDemand: {
        title: "Loaded on demand",
        content:
            "While [prop]hasMoreOptions[/prop] is on, nearing the end of the list calls [prop]onReachEnd[/prop], so options can arrive from a server a batch at a time. The arrow keys stop at the last option held until the next batch lands.",
    },
    autocomplete: {
        title: "Autocomplete",
        content:
            "Give it a [prop]query[/prop] and the field becomes a text box: the reader types to narrow the list. Which options match is yours to decide, so the filtering lives in your code.",
    },
    autocompleteLoadedDemand: {
        title: "Autocomplete, loaded on demand",
        content:
            "The two combine: each change of the query asks the server for its first batch of matches, and nearing the end of the list asks for the next.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and still does not open.",
    },
    namedLabel: {
        title: "Named by a Label",
        content:
            "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text opens the list.",
    },
};
