export const DOCS_ROOT = "/src/App/Pages/Accordions/CollapsiblePage/Docs";

export const FIELD_WIDTH = 110;

export const DOCS_SECTIONS = {
    openingClosingOutside: {
        title: "Opening and closing from outside",
        content:
            "The collapsible keeps track of whether it is open by itself. To open or close it from elsewhere on the page, hold the boolean and pass it in as [prop]expanded[/prop]: both sides write it, so pressing the trigger updates yours and writing yours opens or closes the panel.",
    },
    builtFirstOpen: {
        title: "Built on first open",
        content:
            "Set [prop]isPanelBuiltOnExpand[/prop] and the panel's contents are not built until it is first opened, and they are kept once they are. It trades a cheaper first render for a pause on that first open.",
    },
    openingSide: {
        title: "Opening to a side",
        content:
            "Set [prop]side[/prop] to choose which side of the trigger the panel opens on. Top and bottom grow the panel's height, left and right its width; a sideways panel keeps its contents at their own width and uncovers them, so give them one.",
    },
};

export const HIDE_DELIVERY_NOTES_TEXT = "Hide the delivery notes";

export const SHOW_DELIVERY_NOTES_TEXT = "Show the delivery notes";

export const DELIVERY_NOTES = ["Signed for on arrival", "Left with a neighbor", "Returned to the depot"];
