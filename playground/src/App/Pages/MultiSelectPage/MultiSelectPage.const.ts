export const EXAMPLE_NAMES = {
    multiSelect: "Many at once",
    multiSelectGrouped: "Grouped, with a query",
    multiSelectClearable: "Clearable",
};

export const EXAMPLES_ROOT = "/src/App/Pages/MultiSelectPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/MultiSelectPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the picks start from the right of the field, and the arrow and the clear button sit at its left end.",
    },
    groupsQuery: {
        title: "Groups and a query",
        content:
            "Options can sit in groups, and a [prop]query[/prop] turns the field into a text box that narrows them, as on Select. What counts as a match is yours to decide; here a group the query has emptied is dropped from the list.",
    },
    clearingEveryPick: {
        title: "Clearing every pick",
        content:
            "Give it [prop]renderClear[/prop] and a clear button sits at the end of the field while anything is picked; pressing it empties every pick at once and reports the change like any other. It needs [prop]clearAriaLabel[/prop] to name it.",
    },
};
