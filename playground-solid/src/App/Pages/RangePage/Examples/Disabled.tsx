import { Range } from "@thewaver/ss-components-solid";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground-core/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangeExampleProps } from "../RangePage.types";

type Props = RangeExampleProps;

export const DisabledExample = (props: Props) => (
    <Range
        valueSignal={props.valueSignal}
        ariaLabel={"Disabled range"}
        isDisabled={true}
        thumbSize={() => RANGE_THUMB_SIZE}
        renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
    />
);
