import { ColorInput } from "@thewaver/ss-components";

import { COLOR_INPUT_LABELS } from "../../../PageComponents/Announcements/Announcements.const";
import { pageColorPickerSlots } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const DefaultExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        valueSignal={props.valueSignal}
        ariaLabel={"Brand color"}
        {...COLOR_INPUT_LABELS}
        renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
    />
);
