import { createSignal } from "solid-js";

import { ColorInput } from "@thewaver/ss-components-solid";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { PALETTE, toNearestPaletteColor } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";

export const SnappingDocsExample = () => {
    const valueSignal = createSignal(PALETTE[0]);

    return (
        <ColorInput
            {...pageColorPickerSlots}
            value={valueSignal}
            ariaLabel={"Palette color"}
            {...COLOR_INPUT_LABELS}
            renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
            onInput={(value) => {
                valueSignal[1](toNearestPaletteColor(value));
            }}
        />
    );
};
