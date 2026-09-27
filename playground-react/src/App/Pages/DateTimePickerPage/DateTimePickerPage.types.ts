import type { DateTimeValue } from "@thewaver/ss-components-react";

export type DateTimeExampleProps = {
    valueState: readonly [DateTimeValue | undefined, (value: DateTimeValue | undefined) => void];
};
