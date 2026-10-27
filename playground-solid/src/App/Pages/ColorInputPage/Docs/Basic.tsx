import { createSignal } from "solid-js";

import { ColorInput } from "@thewaver/ss-components-solid";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import type { ColorInputBasicDocsExampleProps } from "../ColorInputPageSolid.types";

type Props = ColorInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal("#3366ff");

    return (
        <ColorInput
            {...pageColorPickerSlots}
            name={"color"}
            value={valueSignal}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Brand color"}
            {...COLOR_INPUT_LABELS}
            renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
        />
    );
};
