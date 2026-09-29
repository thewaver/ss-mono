import { ColorInput } from "@thewaver/ss-components-react";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { toNearestPaletteColor } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const SnappingExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        value={props.value}
        ariaLabel={"Palette color"}
        {...COLOR_INPUT_LABELS}
        renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} />}
        onInput={(value) => {
            props.value[1](toNearestPaletteColor(value));
        }}
    />
);
