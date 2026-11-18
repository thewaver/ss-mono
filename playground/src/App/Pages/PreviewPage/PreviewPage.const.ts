export const EXAMPLE_NAMES = {
    long: "More than fits",
    unheld: "Nobody holding the state",
    short: "Less than fits",
    scrolled: "Inside a box that scrolls",
};

export const EXAMPLES_ROOT = "/src/App/Pages/PreviewPage/Examples";

export const COLLAPSED_HEIGHT = 120;

export const LONG_PARAGRAPHS = [
    "The keep was built in the spring of 1412 by masons who had never seen the sea, which is why every window on the seaward wall is a hand too narrow.",
    "Its great hall held four hundred at the harvest feast and was heated by a single fire, on the reasoning that four hundred people are themselves a fire of sorts.",
    "The east tower was added a century later, and leans, and has leaned for so long that the town would find it strange upright.",
];

export const SHORT_PARAGRAPHS = ["The east tower leans, and has done for four hundred years."];

export const DOCS_ROOT = "/src/App/Pages/PreviewPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the content and the button that opens it sit against the right edge.",
    },
    whenEverythingFits: {
        title: "When everything fits",
        content:
            "Content no taller than [prop]collapsedHeight[/prop] is shown whole, with no button and no fade, since there is nothing behind them.",
    },
    openingClosingOutside: {
        title: "Opening and closing from outside",
        content:
            "The preview keeps track of whether it is open by itself. To open or close it from elsewhere on the page, hold the boolean and pass it in as [prop]expanded[/prop]: both sides write it, so pressing Read more updates yours and writing yours opens or closes the preview.",
    },
    insideBoxThatScrolls: {
        title: "Inside a box that scrolls",
        content:
            "Closing a long preview takes its height out from under the reader, and everything below it jumps up, the button with it. Set [prop]isScrolledIntoViewOnCollapse[/prop] and closing scrolls the preview back into view, so the reader is left where they started.",
    },
};

export const AFTERWARDS = [
    "The rest of the page carries on below, which is the whole of the problem.",
    "Open the preview, read to the end of it, and close it again: everything under it jumps up by the height that just disappeared, and the control you pressed goes with it.",
    "With the scroll asked for, the box comes back to where you were standing.",
];
