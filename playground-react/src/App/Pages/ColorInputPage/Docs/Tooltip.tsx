import { useState } from "react";

import { ColorInput } from "@thewaver/ss-components-react";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ColorInputTooltipDocsExampleProps } from "../ColorInputPageReact.types";

type Props = ColorInputTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueState = useState("#888888");

    return (
        <ColorInput
            {...pageColorPickerSlots}
            value={valueState}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Disabled but reachable color"}
            {...COLOR_INPUT_LABELS}
            renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} />}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        Focusable so this tooltip can be read, but the picker must not open.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
