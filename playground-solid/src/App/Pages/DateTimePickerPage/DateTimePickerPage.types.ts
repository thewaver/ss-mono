import type { Signal } from "solid-js";

import type { DateTimeValue } from "@thewaver/ss-components-solid";

export type DateTimeExampleProps = {
    valueSignal: Signal<DateTimeValue | undefined>;
};
