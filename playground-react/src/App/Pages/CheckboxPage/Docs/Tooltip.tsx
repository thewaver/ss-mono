import { useState } from "react";

import { Checkbox } from "@thewaver/ss-components-react";
import { CHECKBOX_TOOLTIP_LABEL } from "@thewaver/ss-playground/App/Pages/CheckboxPage/CheckboxPage.const";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { CheckboxTooltipDocsExampleProps } from "../CheckboxPageReact.types";

type Props = CheckboxTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const checkedState = useState(true);

    return (
        <Checkbox
            checked={checkedState}
            ariaLabel={CHECKBOX_TOOLTIP_LABEL}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            renderContent={(flags) => <PageCheckboxContent flags={flags}>{CHECKBOX_TOOLTIP_LABEL}</PageCheckboxContent>}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                hoverShowDelayMs: 0,
                renderContent: (visibilityTarget, transitionDurationMs, _placement, _flags, arrowAim) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A tooltip on a checkbox.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
