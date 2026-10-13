export type CollapsibleSizing = "fit-content" | "fill";

export type CollapsibleSide = "top" | "right" | "bottom" | "left";

export type CollapsibleFlags = {
    isExpanded: boolean;
};

export type BaseCollapsibleValues = {
    /** Identifies the collapsible, and is what the trigger and panel compose their own ids from. */
    id?: string;
    /** Whether the collapsible takes only the room its content needs, or fills the width it is given. */
    sizing?: CollapsibleSizing;
    /**
     * Which side of the trigger the panel opens on. Top and bottom grow the panel's height, left and right its width;
     * a sideways panel keeps its contents at their own width and uncovers them, so give them one.
     */
    side?: CollapsibleSide;
    /** How long the panel takes to open and close. */
    transitionDurationMs?: number;
    /**
     * Which heading level the trigger sits at, so the page's outline stays correct wherever the collapsible is used.
     */
    headingLevel?: number;
    /**
     * Scrolls the panel into view once it has finished opening, for a panel that would otherwise open below the fold.
     */
    isScrolledIntoViewOnExpand?: boolean;
    /**
     * Builds the panel's contents only once it is first opened, rather than up front. It trades a cheaper first render
     * for a pause on that first open.
     */
    isPanelBuiltOnExpand?: boolean;
};

export type BaseCollapsibleProps = BaseCollapsibleValues;
