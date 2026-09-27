import { ColorInput } from "@thewaver/ss-components-solid";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";
import { NO_BRAND_COLOR } from "@thewaver/ss-playground-core/App/Pages/ColorInputPage/ColorInputPage.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const ErroredExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        valueSignal={props.valueSignal}
        hasError={() => props.valueSignal[0]() === NO_BRAND_COLOR}
        ariaLabel={"Validated color"}
        {...COLOR_INPUT_LABELS}
        renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
    />
);
