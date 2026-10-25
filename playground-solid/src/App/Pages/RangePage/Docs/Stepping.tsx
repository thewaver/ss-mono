import { createSignal } from "solid-js";

import { Range } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { RangeSteppingDocsExampleProps } from "../RangePageSolid.types";

type Props = RangeSteppingDocsExampleProps;

export const SteppingDocsExample = (props: Props) => {
    const valueSignal = createSignal(3);

    return (
        <>
            <Range
                value={valueSignal}
                id={"difficulty"}
                ariaLabel={"Difficulty"}
                min={props.min}
                max={props.max}
                step={props.step}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueSignal[0]()}`}
            </div>
        </>
    );
};
