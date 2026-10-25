import { useState } from "react";

import { Range } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangeBasicDocsExampleProps } from "../RangePageReact.types";

type Props = RangeBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState(40);

    return (
        <>
            <Range
                value={valueState}
                id={"volume"}
                ariaLabel={"Volume"}
                orientation={props.orientation}
                hasError={props.hasError}
                isDisabled={props.isDisabled}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueState[0]}`}
            </div>
        </>
    );
};
