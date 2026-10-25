import { createSignal } from "solid-js";

import { ColorInput } from "@thewaver/ss-components-solid";
import {
    COLOR_INPUT_LABELS,
    computeColorValueText,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";

export const SwatchDocsExample = () => {
    const valueSignal = createSignal("#3366ff");

    return (
        <>
            <ColorInput
                {...pageColorPickerSlots}
                value={valueSignal}
                ariaLabel={"Accent color"}
                {...COLOR_INPUT_LABELS}
                computeValueText={computeColorValueText}
                renderContent={(getRenderProps) => (
                    <PageColorInputContent renderProps={getRenderProps} isCompact={true} />
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueSignal[0]()}`}
            </div>
        </>
    );
};
