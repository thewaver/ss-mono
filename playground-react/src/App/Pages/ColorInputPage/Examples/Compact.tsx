import { ColorInput } from "@thewaver/ss-components-react";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const CompactExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        valueState={props.valueState}
        ariaLabel={"Compact color"}
        {...COLOR_INPUT_LABELS}
        renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} isCompact={true} />}
    />
);
