import { createSignal } from "solid-js";

import { Checkbox } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { CheckboxTooltipDocsExampleProps } from "../CheckboxPageSolid.types";

type Props = CheckboxTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const checkedSignal = createSignal(true);

    return (
        <Checkbox
            checked={checkedSignal}
            ariaLabel={"Checkbox with a tooltip"}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            renderContent={(getFlags) => (
                <PageCheckboxContent flags={getFlags}>Checkbox with a tooltip</PageCheckboxContent>
            )}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                hoverShowDelayMs: 0,
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        A tooltip on a checkbox.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
