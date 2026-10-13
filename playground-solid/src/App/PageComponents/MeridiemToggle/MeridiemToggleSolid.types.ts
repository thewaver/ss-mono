import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseMeridiemToggleCbs,
    BaseMeridiemToggleValues,
} from "@thewaver/ss-playground/App/PageComponents/MeridiemToggle/MeridiemToggle.types";

export type MeridiemToggleProps = AccessorValues<BaseMeridiemToggleValues> & BaseMeridiemToggleCbs;
