import { Button } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ButtonTooltipDocsExampleProps } from "../ButtonPageReact.types";

type Props = ButtonTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => (
    <Button
        isDisabled={props.isDisabled}
        isReachableWhenDisabled={props.isReachableWhenDisabled}
        renderContent={(flags) => <PageButtonContent flags={flags}>Hover Me</PageButtonContent>}
        tooltipDefs={{
            placement: { x: "center", y: "top_out" },
            offset: { x: 0, y: 10 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    A tooltip on a button.
                </PageTooltipContent>
            ),
        }}
    />
);
