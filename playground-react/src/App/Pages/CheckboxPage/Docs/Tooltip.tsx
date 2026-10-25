import { useState } from "react";

import { Checkbox } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { CheckboxTooltipDocsExampleProps } from "../CheckboxPageReact.types";

type Props = CheckboxTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const checkedState = useState(true);

    return (
        <Checkbox
            checked={checkedState}
            ariaLabel={"Checkbox with a tooltip"}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            renderContent={(flags) => <PageCheckboxContent flags={flags}>Checkbox with a tooltip</PageCheckboxContent>}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                hoverShowDelayMs: 0,
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A tooltip on a checkbox.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
