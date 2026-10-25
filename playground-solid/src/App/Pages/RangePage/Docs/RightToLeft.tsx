import { createSignal } from "solid-js";

import { Range } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import type { Span } from "@thewaver/ss-utils";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";

export const RightToLeftDocsExample = () => {
    const rangeSignal = createSignal<Span>({ start: 20, end: 80 });

    return (
        <>
            <div dir={"rtl"}>
                <Range
                    range={rangeSignal}
                    id={"rightToLeft"}
                    ariaLabel={"Price range"}
                    thumbLabels={() => ["Lowest price", "Highest price"]}
                    thumbSize={RANGE_THUMB_SIZE}
                    renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
                />
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Start: ${rangeSignal[0]().start} | End: ${rangeSignal[0]().end}`}
            </div>
        </>
    );
};
