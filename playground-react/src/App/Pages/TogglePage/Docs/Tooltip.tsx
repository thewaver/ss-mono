import { useState } from "react";

import { Toggle } from "@thewaver/ss-components-react";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ToggleTooltipDocsExampleProps } from "../TogglePageReact.types";

type Props = ToggleTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const checkedState = useState(true);

    return (
        <Toggle
            checked={checkedState}
            ariaLabel={"Toggle with a tooltip"}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            renderContent={(flags) => <PageToggleContent flags={flags}>Toggle with a tooltip</PageToggleContent>}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A tooltip on a toggle.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
