import type { PlaygroundLook } from "../../PageComponents/NavSettings/NavSettings.types";

export const LOOK_ROW_GAP = 20;

export const LOOK_COLUMN_MIN_WIDTH = 280;

export const LOOK_SAMPLE_TABS = [{ value: "Selected" }, { value: "Plain" }, { value: "Disabled", isDisabled: true }];

export const LOOK_SAMPLE_SELECTED_TAB = "Selected";

export const LOOK_SAMPLE_TAB_PANEL = "The panel of the selected tab.";

export const LOOK_SAMPLE_SECTIONS = [{ value: "Open" }, { value: "Closed" }, { value: "Disabled", isDisabled: true }];

export const LOOK_SAMPLE_EXPANDED_SECTIONS = ["Open"];

export const LOOK_SAMPLE_SECTION_BODY = "The body of the open section.";

export const LOOK_SAMPLE_SLIDE_DESCRIPTION = "Hold Enter or Space to confirm.";

export const LOOK_SAMPLE_TAGS = ["solid", "vite"];

export const LOOK_SAMPLE_PROGRESS = 0.6;

export const LOOK_SAMPLE_RANGE = 40;

export const computeLookRowId = (look: PlaygroundLook) => `look-row-${look}`;
