export const EXAMPLE_NAMES = {
    default: "Default",
    singleSelection: "One row at a time",
    resizable: "Resizable columns",
    reorderable: "Reorderable columns",
    consumerSorted: "Sorted by the page",
    virtualized: "Virtualized",
    pinned: "Pinned columns",
    expandable: "Expandable rows",
    rightToLeft: "In a right-to-left box",
    disabled: "Disabled",
};

export const EXAMPLES_ROOT = "/src/App/Pages/TablePage/Examples";

export const DOCS_ROOT = "/src/App/Pages/TablePage/Docs";

export const STRESS_COUNT_FIELD_WIDTH = 120;

export const DOCS_SECTIONS = {
    resizableColumns: {
        title: "Resizable columns",
        content:
            "Hand the table [prop]widths[/prop], mark a column [prop]isResizable[/prop] and draw its grab handle through [prop]renderResizer[/prop], and the column can be resized. Drag the handle on its trailing edge, press the handle without dragging to step the width by [prop]resizeStepPx[/prop] toward the side pressed, or focus the header and hold Control with the left or right arrow. Each column stays between its [prop]minWidthPx[/prop] and [prop]maxWidthPx[/prop].",
    },
    reorderableColumns: {
        title: "Reorderable columns",
        content:
            "Hand the table [prop]order[/prop], the column ids in the order shown, and mark a column [prop]isReorderable[/prop], and its header can be moved: drag it sideways, tap its grip and then the header where it should go, or focus it and hold Shift with the left or right arrow to move it one place straight away. Escape puts a picked-up column back. Every move is spoken in the words of [prop]announcements[/prop], and [prop]renderMarker[/prop] draws where a carried column would land.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the columns run from the right, each column's grab handle sits on its left edge, and the left and right arrows swap, so Control with the left arrow widens the focused column.",
    },
    sortedPage: {
        title: "Sorted by the page",
        content:
            "A sortable column with no [prop]compare[/prop] only reports the sort: the table writes [prop]sort[/prop] and calls [prop]onSortChange[/prop], and leaves the rows as they are. That is the case for rows sorted on a server, or by rules only your code knows. Here the page sorts them itself and hands the table the new order, and the Category column cannot be sorted at all.",
    },
    manyRows: {
        title: "Many rows",
        content:
            "Give it an estimated row height through [prop]computeEstimatedRowHeight[/prop] and only the rows in view are built, however many the table holds. The box you put the table in is the one that scrolls, and the header stays at its top. Every row still says which row it is and how many there are, so a screen reader counts the whole table although most of it is not on the page.",
    },
    pinnedColumns: {
        title: "Pinned columns",
        content:
            "A column with [prop]pin[/prop] set to start or end stays at that edge while the others scroll sideways under it. It needs [prop]widthPx[/prop], since where it is held is the sum of the widths of the pinned columns before it. Pinned columns gather at their edge whatever the order says, and can only be moved among themselves. Here SKU is held at the start and Price at the end: scroll sideways, or widen SKU and watch the other columns slide under it.",
    },
    expandableRows: {
        title: "Expandable rows",
        content:
            "Give it [prop]renderDetail[/prop] and a row can open a detail beneath it, as wide as the row. Put a TableRowExpander in one of the row's cells for the pointer; from the keyboard, Enter on a row's first cell opens and closes it, and the down arrow walks into an open detail. Which rows can open is up to [prop]computeIsExpandable[/prop]: here a part out of stock has nothing to show. A screen reader then hears the table as a tree grid, whose rows say whether they are open.",
    },
};

export const PARTS_SORTED_PAGE_LABEL = "Parts sorted by the page";

export const PARTS_PINNED_COLUMNS_LABEL = "Parts with pinned columns";

export const PARTS_REORDERABLE_COLUMNS_LABEL = "Parts with reorderable columns";

export const PARTS_RESIZABLE_COLUMNS_LABEL = "Parts with resizable columns";

export const PARTS_RIGHT_LEFT_BOX_LABEL = "Parts in a right-to-left box";
