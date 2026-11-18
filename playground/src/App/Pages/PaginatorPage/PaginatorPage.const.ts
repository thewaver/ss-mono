import { type BandDefs, PlacementLayoutUtils } from "@thewaver/ss-components";

import { PaginatorKnobs } from "../../Knobs/Paginators.const";

export const EXAMPLE_NAMES = {
    steps: "Previous and next",
    ends: "Jumps to either end",
    links: "Pages that are links",
    linkComponent: "Links through a component",
    count: "Arrows with a count between",
    jump: "A row with a go-to-page field",
    dial: "The same row, round half a dial",
};

export const STARTING_PAGE = 1;

export const FIRST_PAGE = 1;

export const COUNT_FIELD_WIDTH = 90;

export const EXAMPLES_ROOT = "/src/App/Pages/PaginatorPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/PaginatorPage/Docs";

export const ITEM_COUNT = PaginatorKnobs.STARTING_ITEM_COUNT;

export const PAGE_SIZE = PaginatorKnobs.STARTING_PAGE_SIZE;

export const PAGINATOR_GAP = 5;

export const DIAL_DEFS: BandDefs = { spreadDegrees: 180, facingDegrees: 0, holeRatio: 0.5, wedgeGapDegrees: 2 };

export const DIAL_LAYOUT = PlacementLayoutUtils.createRing(DIAL_DEFS);

export const DOCS_SECTIONS = {
    jumpsEitherEnd: {
        title: "Jumps to either end",
        content:
            "The row draws previous and next unless told otherwise. Pass [prop]steps[/prop] to choose which steps it draws and in what order; here first and last join them. A step with nowhere to go is disabled, so on the first page first and previous go quiet together, and next and last on the final page.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the row starts from the right: the first page and the steps leading back to it sit rightmost. The arrows here are characters the browser draws mirrored in right-to-left text, so each still points the way it steps; an arrow drawn as a picture has to be turned by the painter.",
    },
    pagesThatAreLinks: {
        title: "Pages that are links",
        content:
            "Pass [prop]computeHref[/prop] and every page and step is drawn as a native HTML anchor element, with an address worked out from the page it leads to; a step with nowhere to go carries no address. In a routed app, pass [prop]linkComponent[/prop], a custom link component such as your router's, and the controls are drawn with it instead.",
    },
    arrowsCountBetween: {
        title: "Arrows with a count between",
        content:
            'Paginator is built from pieces you can arrange yourself. PaginatorRoot holds the numbers and the navigation landmark, PaginatorSteps draws the steps with whatever you put between them, and PaginatorPages draws the number row. Here the steps hold the page\'s own "3 of 20" text, with the page count from PaginatorUtils.computePageCount, and there is no number row at all.',
    },
    goPageField: {
        title: "A go-to-page field",
        content:
            "A field for jumping to a page is yours to add: it writes the same page the row reads, and the row follows. Here it sits inside the root beside the steps and the number row, named by its visible caption.",
    },
    roundHalfDial: {
        title: "Round half a dial",
        content:
            "Pass [prop]computeLayout[/prop] and each step, page and gap is placed in a box the layout works out, in the order the controls already have, which is the order Tab walks them. Here a ring lays the row round half a dial.",
    },
};

export const RESULTS_ROUND_DIAL_LABEL = "Results round a dial";

export const RESULTS_END_JUMPS_LABEL = "Results with end jumps";

export const RESULTS_PAGE_FIELD_LABEL = "Results with a page field";
