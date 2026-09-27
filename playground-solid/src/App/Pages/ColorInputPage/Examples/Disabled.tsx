import { ColorInput } from "@thewaver/ss-components-solid";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const DisabledExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        valueSignal={props.valueSignal}
        isDisabled={true}
        ariaLabel={"Disabled color"}
        {...COLOR_INPUT_LABELS}
        renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
    />
);
