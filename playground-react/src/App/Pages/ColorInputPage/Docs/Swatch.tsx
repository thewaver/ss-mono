import { useState } from "react";

import { ColorInput } from "@thewaver/ss-components-react";
import {
    COLOR_INPUT_LABELS,
    computeColorValueText,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";

export const SwatchDocsExample = () => {
    const valueState = useState("#3366ff");

    return (
        <>
            <ColorInput
                {...pageColorPickerSlots}
                value={valueState}
                ariaLabel={"Accent color"}
                {...COLOR_INPUT_LABELS}
                computeValueText={computeColorValueText}
                renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} isCompact={true} />}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueState[0]}`}
            </div>
        </>
    );
};
