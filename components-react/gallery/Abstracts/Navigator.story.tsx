import { useRef } from "react";

import { NavigatorReactUtils } from "../../src";

export const Default = ({ dir }: { dir?: "ltr" | "rtl" }) => {
    const ref = useRef<HTMLDivElement>(null);
    const direction = NavigatorReactUtils.useDirection(ref);

    return (
        <div dir={dir} data-testid="host">
            <div ref={ref}>
                <output data-readout="direction">{direction}</output>
            </div>
        </div>
    );
};
