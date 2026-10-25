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
