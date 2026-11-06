import type { PlaygroundSkin } from "../../PageComponents/NavSettings/NavSettings.types";

export const SKIN_ROW_GAP = 20;

export const SKIN_COLUMN_MIN_WIDTH = 280;

export const SKIN_SAMPLE_TABS = [{ value: "Selected" }, { value: "Plain" }, { value: "Disabled", isDisabled: true }];

export const SKIN_SAMPLE_SELECTED_TAB = "Selected";

export const SKIN_SAMPLE_TAB_PANEL = "The panel of the selected tab.";

export const SKIN_SAMPLE_OPTIONS = [{ value: "Selected" }, { value: "Plain" }, { value: "Disabled", isDisabled: true }];

export const SKIN_SAMPLE_SELECTED_OPTION = "Selected";

export const SKIN_SAMPLE_SECTIONS = [{ value: "Open" }, { value: "Closed" }, { value: "Disabled", isDisabled: true }];

export const SKIN_SAMPLE_EXPANDED_SECTIONS = ["Open"];

export const SKIN_SAMPLE_SECTION_BODY = "The body of the open section.";

export const SKIN_SAMPLE_SLIDE_DESCRIPTION = "Hold Enter or Space to confirm.";

export const SKIN_SAMPLE_TAGS = ["solid", "vite"];

export const SKIN_SAMPLE_PROGRESS = 0.6;

export const SKIN_SAMPLE_RANGE = 40;

export const computeSkinRowId = (skin: PlaygroundSkin) => `skin-row-${skin}`;
