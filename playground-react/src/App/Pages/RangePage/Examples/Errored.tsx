import { Range } from "@thewaver/ss-components-react";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangeExampleProps } from "../RangePage.types";

const ERROR_ABOVE = 80;

type Props = RangeExampleProps;

export const ErroredExample = (props: Props) => (
    <Range
        value={props.value}
        ariaLabel={"Errored range"}
        hasError={props.value[0] > ERROR_ABOVE}
        thumbSize={RANGE_THUMB_SIZE}
        renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
    />
);
