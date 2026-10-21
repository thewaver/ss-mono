import type { Signal } from "solid-js";

import type { TimeValue } from "@thewaver/ss-utils";

import { DefaultExample } from "./Default";

type Props = {
    value: Signal<TimeValue | undefined>;
};

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <DefaultExample value={props.value} ariaLabel={"Time in a right-to-left box"} />
        </div>
    );
};
