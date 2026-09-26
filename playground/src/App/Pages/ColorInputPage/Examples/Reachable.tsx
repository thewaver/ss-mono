import { ColorInput } from "@thewaver/ss-components";

import { COLOR_INPUT_LABELS } from "../../../PageComponents/Announcements/Announcements.const";
import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

type Props = ColorInputExampleProps;

export const ReachableExample = (props: Props) => (
    <ColorInput
        {...pageColorPickerSlots}
        valueSignal={props.valueSignal}
        isDisabled={true}
        isReachableWhenDisabled={true}
        ariaLabel={"Disabled but reachable color"}
        {...COLOR_INPUT_LABELS}
        renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
        tooltipDefs={() => ({
            placement: () => ({ x: "center", y: "top-out" }),
            offset: () => ({ x: 0, y: 10 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    Focusable so this tooltip can be read, but the OS picker must not open.
                </PageTooltipContent>
            ),
        })}
    />
);
