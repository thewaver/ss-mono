import { Checkbox } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

type Props = CheckboxExampleProps;

export const ReachableExample = (props: Props) => (
    <Checkbox
        checkedState={props.checkedState}
        ariaLabel={"Disabled but reachable checkbox"}
        isDisabled={true}
        isReachableWhenDisabled={true}
        renderContent={(flags) => <PageCheckboxContent flags={flags} />}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            hoverShowDelayMs: 0,
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Focusable so this tooltip can be read, but clicking and pressing Space must leave it checked.
                </PageTooltipContent>
            ),
        }}
    />
);
