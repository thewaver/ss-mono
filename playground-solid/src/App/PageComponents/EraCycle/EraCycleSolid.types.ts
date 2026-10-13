import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseEraCycleCbs,
    BaseEraCycleValues,
} from "@thewaver/ss-playground/App/PageComponents/EraCycle/EraCycle.types";

export type EraCycleProps = AccessorValues<BaseEraCycleValues> & BaseEraCycleCbs;
