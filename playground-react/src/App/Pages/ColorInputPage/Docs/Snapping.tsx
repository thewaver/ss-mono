import { useState } from "react";

import { ColorInput } from "@thewaver/ss-components-react";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { PALETTE, toNearestPaletteColor } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";

export const SnappingDocsExample = () => {
    const valueState = useState(PALETTE[0]);

    return (
        <ColorInput
            {...pageColorPickerSlots}
            value={valueState}
            ariaLabel={"Palette color"}
            {...COLOR_INPUT_LABELS}
            renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} />}
            onInput={(value) => {
                valueState[1](toNearestPaletteColor(value));
            }}
        />
    );
};
