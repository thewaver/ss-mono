import type { ArcDefs } from "../../../Generators/PlacementLayouts/PlacementLayouts.types";

export type BaseFanMenuValues = {
    /** How the items sit on their arc, for the parts of the arrangement the menu does not decide itself. */
    layoutDefs?: ArcDefs;
};

export type BaseFanMenuProps = BaseFanMenuValues;
