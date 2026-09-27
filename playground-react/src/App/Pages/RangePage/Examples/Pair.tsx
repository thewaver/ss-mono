import { Range } from "@thewaver/ss-components-react";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground-core/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangePairExampleProps } from "../RangePage.types";

type Props = RangePairExampleProps;

export const PairExample = (props: Props) => (
    <Range
        rangeState={props.rangeState}
        ariaLabel={"Price range"}
        thumbLabels={["Lowest price", "Highest price"]}
        thumbSize={RANGE_THUMB_SIZE}
        renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
    />
);
