import { Range } from "@thewaver/ss-components-react";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangePairExampleProps } from "../RangePage.types";

type Props = RangePairExampleProps;

export const RightToLeftExample = (props: Props) => (
    <div dir={"rtl"}>
        <Range
            range={props.range}
            ariaLabel={"Price range in a right-to-left box"}
            thumbLabels={["Lowest price", "Highest price"]}
            thumbSize={RANGE_THUMB_SIZE}
            renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
        />
    </div>
);
