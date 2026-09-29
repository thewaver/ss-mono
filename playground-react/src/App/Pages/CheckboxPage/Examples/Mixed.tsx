import { Checkbox } from "@thewaver/ss-components-react";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { CheckboxMixedExampleProps } from "../CheckboxPage.types";

type Props = CheckboxMixedExampleProps;

export const MixedExample = (props: Props) => {
    return (
        <PageControlRow>
            <Checkbox
                checked={props.all}
                isMixed={props.isMixed}
                id={"selectAll"}
                ariaLabel={"Select all"}
                renderContent={(flags) => <PageCheckboxContent flags={flags} />}
                tooltipDefs={{
                    placement: { x: "center", y: "top-out" },
                    offset: { x: 0, y: 10 },
                    renderContent: (visibilityTarget, transitionDurationMs, _placement, flags) => (
                        <PageTooltipContent
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        >
                            {`Summarizes the two boxes on the right. It reads mixed whenever they disagree, and clicking it sets both. checkedState: ${String(flags.checkedState)}.`}
                        </PageTooltipContent>
                    ),
                }}
                onChange={(isChecked) => {
                    props.firstChild[1](isChecked);
                    props.secondChild[1](isChecked);
                }}
            />

            <PageControlRowLabel>controls</PageControlRowLabel>

            <Checkbox
                checked={props.firstChild}
                id={"firstChild"}
                ariaLabel={"First child"}
                renderContent={(flags) => <PageCheckboxContent flags={flags} />}
            />

            <Checkbox
                checked={props.secondChild}
                ariaLabel={"Second child"}
                renderContent={(flags) => <PageCheckboxContent flags={flags} />}
            />
        </PageControlRow>
    );
};
