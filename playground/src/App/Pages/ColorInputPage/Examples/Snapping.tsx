import { ColorInput } from "@thewaver/ss-components";

import { pageColorPickerSlots } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { toNearestPaletteColor } from "../ColorInputPage.const";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const SnappingExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        valueSignal={props.valueSignal}
        ariaLabel={"Palette colour"}
        renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
        onInput={(value) => {
            props.valueSignal[1](toNearestPaletteColor(value));
        }}
    />
);
