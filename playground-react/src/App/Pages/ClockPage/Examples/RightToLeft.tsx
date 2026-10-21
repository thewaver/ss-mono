import type { TimeValue } from "@thewaver/ss-utils";

import { DefaultExample } from "./Default";

type Props = {
    value: readonly [TimeValue | undefined, (value: TimeValue | undefined) => void];
};

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <DefaultExample value={props.value} ariaLabel={"Time in a right-to-left box"} />
        </div>
    );
};
