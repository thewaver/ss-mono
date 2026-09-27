import { Toggle } from "@thewaver/ss-components-react";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ToggleExampleProps } from "../TogglePage.types";

type Props = ToggleExampleProps;

export const ReachableExample = (props: Props) => (
    <Toggle
        checkedState={props.checkedState}
        ariaLabel={"Disabled but reachable toggle"}
        isDisabled={true}
        isReachableWhenDisabled={true}
        renderContent={(flags) => <PageToggleContent flags={flags} />}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Focusable so this tooltip can be read, but clicking and pressing Space must leave it on.
                </PageTooltipContent>
            ),
        }}
    />
);
