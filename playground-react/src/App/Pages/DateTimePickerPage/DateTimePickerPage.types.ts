import type { DateTimeValue } from "@thewaver/ss-components-react";

export type DateTimeExampleProps = {
    value: readonly [DateTimeValue | undefined, (value: DateTimeValue | undefined) => void];
};
