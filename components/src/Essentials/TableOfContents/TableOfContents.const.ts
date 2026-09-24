import { CURRENT_INDEX_OBSERVER_DEFAULTS } from "../../Abstracts/ElementObserver/ElementObserver.const";
import type { TableOfContentsOrientation } from "./TableOfContents.types";

export const TABLE_OF_CONTENTS_DEFAULTS = {
    orientation: "vertical" as TableOfContentsOrientation,
    gap: 0,
    offsetRatio: CURRENT_INDEX_OBSERVER_DEFAULTS.offsetRatio,
};
