import { createSignal } from "solid-js";

import { ColorInput } from "@thewaver/ss-components-solid";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ColorInputTooltipDocsExampleProps } from "../ColorInputPageSolid.types";

type Props = ColorInputTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueSignal = createSignal("#888888");

    return (
        <ColorInput
            {...pageColorPickerSlots}
            value={valueSignal}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Disabled but reachable color"}
            {...COLOR_INPUT_LABELS}
            renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        Focusable so this tooltip can be read, but the picker must not open.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
