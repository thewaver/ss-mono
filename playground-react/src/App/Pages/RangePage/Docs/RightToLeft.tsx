import { useState } from "react";

import { Range } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import type { Span } from "@thewaver/ss-utils";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";

export const RightToLeftDocsExample = () => {
    const rangeState = useState<Span>({ start: 20, end: 80 });

    return (
        <>
            <div dir={"rtl"}>
                <Range
                    range={rangeState}
                    id={"rightToLeft"}
                    ariaLabel={"Price range"}
                    thumbLabels={["Lowest price", "Highest price"]}
                    thumbSize={RANGE_THUMB_SIZE}
                    renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Start: ${rangeState[0].start} | End: ${rangeState[0].end}`}
            </div>
        </>
    );
};
