import { Toggle } from "@thewaver/ss-components-react";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ToggleMixedExampleProps } from "../TogglePage.types";

type Props = ToggleMixedExampleProps;

export const MixedExample = (props: Props) => {
    return (
        <PageControlRow>
            <Toggle
                checked={props.all}
                isMixed={props.isMixed}
                id={"allSettings"}
                ariaLabel={"All settings"}
                renderContent={(flags) => <PageToggleContent flags={flags} />}
                tooltipDefs={{
                    placement: { x: "center", y: "top-out" },
                    offset: { x: 0, y: 10 },
                    renderContent: (visibilityTarget, transitionDurationMs, _placement, flags) => (
                        <PageTooltipContent
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        >
                            {`Mixed while the two toggles on the right disagree, and clicking it sets both. A switch cannot announce "mixed", so this control drops role="switch" and reads as a mixed checkbox exactly while mixed. checkedState: ${String(flags.checkedState)}.`}
                        </PageTooltipContent>
                    ),
                }}
                onChange={(isChecked) => {
                    props.firstChild[1](isChecked);
                    props.secondChild[1](isChecked);
                }}
            />

            <PageControlRowLabel>controls</PageControlRowLabel>

            <Toggle
                checked={props.firstChild}
                id={"firstSetting"}
                ariaLabel={"First setting"}
                renderContent={(flags) => <PageToggleContent flags={flags} />}
            />

            <Toggle
                checked={props.secondChild}
                ariaLabel={"Second setting"}
                renderContent={(flags) => <PageToggleContent flags={flags} />}
            />
        </PageControlRow>
    );
};
