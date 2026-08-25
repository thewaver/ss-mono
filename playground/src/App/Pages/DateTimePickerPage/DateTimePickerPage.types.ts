import type { Signal } from "solid-js";

import type { DateTimeValue } from "@thewaver/ss-components";

export type DateTimeExampleProps = {
    valueSignal: Signal<DateTimeValue | undefined>;
};
