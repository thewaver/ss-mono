import { ColorInput } from "@thewaver/ss-components";

import { pageColorPickerSlots } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const DisabledExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        valueSignal={props.valueSignal}
        isDisabled={true}
        ariaLabel={"Disabled color"}
        renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
    />
);
