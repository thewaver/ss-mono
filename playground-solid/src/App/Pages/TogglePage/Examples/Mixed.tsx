import { Toggle } from "@thewaver/ss-components-solid";

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
                renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
                tooltipDefs={() => ({
                    placement: () => ({ x: "center", y: "top-out" }),
                    offset: () => ({ x: 0, y: 10 }),
                    renderContent: (getVisibilityTarget, getTransitionDurationMs, _getPlacement, getFlags) => (
                        <PageTooltipContent
                            visibilityTarget={getVisibilityTarget}
                            transitionDurationMs={getTransitionDurationMs}
                        >
                            {`Mixed while the two toggles on the right disagree, and clicking it sets both. A switch cannot announce "mixed", so this control drops role="switch" and reads as a mixed checkbox exactly while mixed. checkedState: ${String(getFlags().checkedState)}.`}
                        </PageTooltipContent>
                    ),
                })}
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
                renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
            />

            <Toggle
                checked={props.secondChild}
                ariaLabel={"Second setting"}
                renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
            />
        </PageControlRow>
    );
};
