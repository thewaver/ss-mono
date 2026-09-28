import { Range } from "@thewaver/ss-components-solid";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangeExampleProps } from "../RangePage.types";

type Props = RangeExampleProps;

export const DefaultExample = (props: Props) => (
    <Range
        valueSignal={props.valueSignal}
        ariaLabel={"Volume"}
        thumbSize={() => RANGE_THUMB_SIZE}
        renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
    />
);
