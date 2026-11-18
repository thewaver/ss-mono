export const EXAMPLE_NAMES = {
    default: "Default",
    collapsed: "Everything collapsed",
    rightToLeft: "In a right-to-left box",
    unheld: "Nobody holding the state",
    disabled: "Disabled nodes",
    reachable: "Disabled nodes + reachable",
    outside: "Collapsed from outside",
    links: "Nodes that are links",
    linkComponent: "Links through a component",
    lazy: "Branches that arrive later",
    virtualized: "Virtualized",
    leaning: "Leaning toward the pointer",
    radial: "A tree drawn outward",
    recordValues: "Record values",
    checkboxes: "Ticking several",
};

export const EXAMPLES_ROOT = "/src/App/Pages/TreePage/Examples";

export const DOCS_ROOT = "/src/App/Pages/TreePage/Docs";

export const STRESS_COUNT_FIELD_WIDTH = 120;

export const RADIAL_DEFS = { innerRadius: 88, ringGap: 96, itemWidth: 88, itemHeight: 88, spreadDegrees: 360 };

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the rows are indented from the right and the arrows swap: the left arrow opens a branch and then steps into it, and the right arrow closes it or climbs to the parent.",
    },
    openingClosingOutside: {
        title: "Opening and closing from outside",
        content:
            "The tree keeps track of which branches are open by itself. To open or close them from elsewhere on the page, hold the list of open values and pass it in as [prop]expanded[/prop]: both sides write it, so opening a branch updates your list and writing your list opens or closes branches. The selected node can be held the same way, through [prop]value[/prop]. If a branch closes from outside while focus is on a row inside it, focus moves to the branch rather than being lost: press the delayed button, then focus a row inside Lib before it closes.",
    },
    disabledNodes: {
        title: "Disabled nodes",
        content:
            "A node can be disabled: the arrow keys skip it, and nothing selects or opens it. What is inside an open disabled branch is not disabled with it, so those rows stay reachable. Kept reachable when disabled, the arrow keys stop on the node instead, so a tooltip can say why it is off.",
    },
    links: {
        title: "Links",
        content:
            "Give a node an [prop]href[/prop] and it is drawn as a native HTML anchor element, so it can be opened in a new tab or copied as a link, and both Enter and Space follow it. In a routed app, pass [prop]linkComponent[/prop], a custom link component such as your router's, and the linking nodes are drawn with it instead.",
    },
    recordsValues: {
        title: "Records as values",
        content:
            "A node's value can be any record, not only a string. Here each asset is an object, the painter draws whichever of its parts you choose, and the line under the tree shows the record that is selected.",
    },
    tickingSeveral: {
        title: "Ticking several",
        content:
            "MultiTree ticks nodes rather than selecting one. Ticking a folder ticks everything inside it, and a folder with only some of its contents ticked shows as partly ticked. Here the painter puts the expander ref that [prop]renderNode[/prop] hands it on each folder's arrow, so pressing the arrow opens the folder and pressing its name ticks it; without that ref, one press does both. Space ticks the focused node, Shift with an arrow moves and ticks, Shift with Space ticks a run from the last node ticked, and Control with A ticks everything, or clears it all when everything already is.",
    },
    branchesThatArriveLater: {
        title: "Branches that arrive later",
        content:
            "Set [prop]hasMoreChildren[/prop] on a node whose children are still to come, and it is drawn as a branch before it has any. Opening it writes it into [prop]expanded[/prop], which is your cue to fetch them. Until they arrive the branch tells screen readers it is busy, and [prop]renderPendingChildren[/prop] draws what stands in for them.",
    },
    manyNodes: {
        title: "Many nodes",
        content:
            "Give it an estimated node height through [prop]computeEstimatedNodeHeight[/prop] and only the rows in view are built, however many nodes the tree holds. Here the tree sits in a box that scrolls, and an asterisk opens every branch beside the focused one.",
    },
    leaningTowardPointer: {
        title: "Leaning toward the pointer",
        content:
            "Give it a layout through [prop]computeLayout[/prop] and an effect through [prop]computeEffect[/prop], and each node can answer how near the pointer is. Here the nodes sit in a column, and each shifts and brightens as the pointer nears it. The effect is not told which node is selected, so the painter keeps that one lit.",
    },
    treeDrawnOutward: {
        title: "A tree drawn outward",
        content:
            "A layout can put the nodes anywhere. This one is told which node each hangs from, so children share the slice their parent was given, and every rank sits a ring further out whichever node it hangs from. The line from each node to its parent is drawn by [prop]renderConnector[/prop]; the rings are the page's own, drawn behind the tree.",
    },
};

export const GENERATED_REPOSITORY_LABEL = "Generated repository";
