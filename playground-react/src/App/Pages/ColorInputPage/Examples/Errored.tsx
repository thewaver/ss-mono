import { ColorInput } from "@thewaver/ss-components-react";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";
import { NO_BRAND_COLOR } from "@thewaver/ss-playground-core/App/Pages/ColorInputPage/ColorInputPage.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const ErroredExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        valueState={props.valueState}
        hasError={props.valueState[0] === NO_BRAND_COLOR}
        ariaLabel={"Validated color"}
        {...COLOR_INPUT_LABELS}
        renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} />}
    />
);
