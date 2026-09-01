import { Range } from "@thewaver/ss-components";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangePairExampleProps } from "../RangePage.types";

import { RANGE_THUMB_SIZE } from "../../../StyledComponents/RangeContent/RangeContent.css";

type Props = RangePairExampleProps;

export const DisabledPairExample = (props: Props) => (
    <Range
        rangeSignal={props.rangeSignal}
        ariaLabel={"Locked band"}
        thumbLabels={() => ["Locked floor", "Locked ceiling"]}
        isDisabled={true}
        thumbSize={() => RANGE_THUMB_SIZE}
        renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
    />
);
