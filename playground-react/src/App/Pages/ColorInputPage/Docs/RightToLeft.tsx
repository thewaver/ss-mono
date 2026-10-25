import { useState } from "react";

import { ColorInput } from "@thewaver/ss-components-react";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";

export const RightToLeftDocsExample = () => {
    const valueState = useState("rgb(51 102 255)");

    return (
        <div dir={"rtl"}>
            <ColorInput
                {...pageColorPickerSlots}
                value={valueState}
                ariaLabel={"Brand color in a right-to-left box"}
                {...COLOR_INPUT_LABELS}
                renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} />}
            />
        </div>
    );
};
