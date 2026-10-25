import { useState } from "react";

import { Range } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangeSteppingDocsExampleProps } from "../RangePageReact.types";

type Props = RangeSteppingDocsExampleProps;

export const SteppingDocsExample = (props: Props) => {
    const valueState = useState(3);

    return (
        <>
            <Range
                value={valueState}
                id={"difficulty"}
                ariaLabel={"Difficulty"}
                min={props.min}
                max={props.max}
                step={props.step}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueState[0]}`}
            </div>
        </>
    );
};
