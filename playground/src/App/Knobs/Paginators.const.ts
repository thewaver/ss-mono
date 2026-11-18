export namespace PaginatorKnobs {
    export const MIN_ITEM_COUNT = 0;
    export const MAX_ITEM_COUNT = 600;
    export const MIN_PAGE_SIZE = 1;
    export const MAX_PAGE_SIZE = 10;
    export const MIN_COUNT = 0;
    export const MAX_COUNT = 5;
    export const COUNT_STEP = 1;
    export const STARTING_ITEM_COUNT = 60;
    export const STARTING_PAGE_SIZE = 3;
    export const STARTING_IS_DISABLED = false;

    export const ITEM_COUNT_TEXT = {
        label: "Item count",
        hint: "How many items there are to page through. The page count is worked out from this and the page size.",
        controls: "Sets PaginatorProps.itemCount",
    };

    export const PAGE_SIZE_TEXT = {
        label: "Page size",
        hint: "How many items one page holds. The last page holds whatever is left over.",
        controls: "Sets PaginatorProps.pageSize",
    };

    export const SIBLING_COUNT_TEXT = {
        label: "Sibling count",
        hint: "How many pages are shown on each side of the current one before the run is broken by a gap.",
        controls: "Sets PaginatorProps.siblingCount",
    };

    export const BOUNDARY_COUNT_TEXT = {
        label: "Boundary count",
        hint: "How many pages are always shown at each end, however far away the current page is.",
        controls: "Sets PaginatorProps.boundaryCount",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the paginator off, so none of its pages or steps respond.",
        controls: "Sets PaginatorProps.isDisabled",
    };

    export const HAS_LINK_COMPONENT_TEXT = {
        label: "Custom link component",
        hint: "Draws the pages and steps with a custom link component, as a router's link would be. Off, they use the native HTML anchor element.",
        controls: "Sets PaginatorProps.linkComponent",
    };
}
