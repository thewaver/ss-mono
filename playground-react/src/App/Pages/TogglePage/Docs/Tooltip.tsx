import { useState } from "react";

import { Toggle } from "@thewaver/ss-components-react";
import { TOGGLE_TOOLTIP_LABEL } from "@thewaver/ss-playground/App/Pages/TogglePage/TogglePage.const";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ToggleTooltipDocsExampleProps } from "../TogglePageReact.types";

type Props = ToggleTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const checkedState = useState(true);

    return (
        <Toggle
            checked={checkedState}
            ariaLabel={TOGGLE_TOOLTIP_LABEL}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            renderContent={(flags) => <PageToggleContent flags={flags}>{TOGGLE_TOOLTIP_LABEL}</PageToggleContent>}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs, _placement, _flags, arrowAim) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A tooltip on a toggle.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
