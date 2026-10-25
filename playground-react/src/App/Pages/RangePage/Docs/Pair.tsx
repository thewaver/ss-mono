import { useState } from "react";

import { Range } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import type { Span } from "@thewaver/ss-utils";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangePairDocsExampleProps } from "../RangePageReact.types";

type Props = RangePairDocsExampleProps;

export const PairDocsExample = (props: Props) => {
    const rangeState = useState<Span>({ start: 20, end: 80 });

    return (
        <>
            <Range
                range={rangeState}
                id={"pair"}
                ariaLabel={"Price range"}
                thumbLabels={["Lowest price", "Highest price"]}
                isDisabled={props.isDisabled}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Start: ${rangeState[0].start} | End: ${rangeState[0].end}`}
            </div>
        </>
    );
};
