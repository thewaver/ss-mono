import { createSignal } from "solid-js";

import { Range } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import type { Span } from "@thewaver/ss-utils";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangePairDocsExampleProps } from "../RangePageSolid.types";

type Props = RangePairDocsExampleProps;

export const PairDocsExample = (props: Props) => {
    const rangeSignal = createSignal<Span>({ start: 20, end: 80 });

    return (
        <>
            <Range
                range={rangeSignal}
                id={"pair"}
                ariaLabel={"Price range"}
                thumbLabels={() => ["Lowest price", "Highest price"]}
                isDisabled={props.isDisabled}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Start: ${rangeSignal[0]().start} | End: ${rangeSignal[0]().end}`}
            </div>
        </>
    );
};
