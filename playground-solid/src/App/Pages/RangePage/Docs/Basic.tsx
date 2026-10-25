import { createSignal } from "solid-js";

import { Range } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangeBasicDocsExampleProps } from "../RangePageSolid.types";

type Props = RangeBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal(40);

    return (
        <>
            <Range
                value={valueSignal}
                id={"volume"}
                ariaLabel={"Volume"}
                orientation={props.orientation}
                hasError={props.hasError}
                isDisabled={props.isDisabled}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueSignal[0]()}`}
            </div>
        </>
    );
};
