import { Button } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ButtonExampleProps } from "../ButtonPage.types";

type Props = ButtonExampleProps;

export const ReachableExample = (props: Props) => (
    <Button
        isDisabled={true}
        isReachableWhenDisabled={true}
        renderContent={(flags) => <PageButtonContent flags={flags}>Click Me</PageButtonContent>}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            hoverShowDelayMs: 0,
            renderContent: (visibilityTarget, transitionDurationMs, _placement, flags) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    {`Focusable so this tooltip can be read, but clicking and pressing Enter must leave the count at zero. The shell reports isDisabled: ${flags.isDisabled}.`}
                </PageTooltipContent>
            ),
        }}
        onClick={props.onClick}
    />
);
