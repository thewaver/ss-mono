import { useState } from "react";

import { ColorInput } from "@thewaver/ss-components-react";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import type { ColorInputBasicDocsExampleProps } from "../ColorInputPageReact.types";

type Props = ColorInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState("#3366ff");

    return (
        <ColorInput
            {...pageColorPickerSlots}
            value={valueState}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Brand color"}
            {...COLOR_INPUT_LABELS}
            renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} />}
        />
    );
};
