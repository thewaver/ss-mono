import { Button } from "@thewaver/ss-components-solid";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ButtonTooltipDocsExampleProps } from "../ButtonPageSolid.types";

type Props = ButtonTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => (
    <Button
        isDisabled={props.isDisabled}
        isReachableWhenDisabled={props.isReachableWhenDisabled}
        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Hover Me</PageButtonContent>}
        tooltipDefs={() => ({
            placement: () => ({ x: "center", y: "top_out" }),
            offset: () => ({ x: 0, y: 10 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    A tooltip on a button.
                </PageTooltipContent>
            ),
        })}
    />
);
