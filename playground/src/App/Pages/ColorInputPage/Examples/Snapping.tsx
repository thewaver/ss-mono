import { ColorInput } from "@thewaver/ss-components";

import { COLOR_INPUT_LABELS } from "../../../PageComponents/Announcements/Announcements.const";
import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { toNearestPaletteColor } from "../ColorInputPage.const";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const SnappingExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        valueSignal={props.valueSignal}
        ariaLabel={"Palette color"}
        {...COLOR_INPUT_LABELS}
        renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
        onInput={(value) => {
            props.valueSignal[1](toNearestPaletteColor(value));
        }}
    />
);
