import { createSignal } from "solid-js";

import { ColorInput } from "@thewaver/ss-components-solid";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { BRAND_COLOR_RIGHT_LEFT_LABEL } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal("rgb(51 102 255)");

    return (
        <div dir={"rtl"}>
            <ColorInput
                {...pageColorPickerSlots}
                value={valueSignal}
                ariaLabel={BRAND_COLOR_RIGHT_LEFT_LABEL}
                {...COLOR_INPUT_LABELS}
                renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
            />
        </div>
    );
};
