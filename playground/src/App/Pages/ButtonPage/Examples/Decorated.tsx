import { Button, Corners } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageRipple } from "../../../StyledComponents/Ripple/Ripple";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ButtonPressedExampleProps } from "../ButtonPage.types";

type Props = ButtonPressedExampleProps;

export const DecoratedExample = (props: Props) => {
    return (
        <Button
            isPressed={props.isPressed}
            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Toggle Me</PageButtonContent>}
            isActivationTracked={true}
            renderDecoration={(getFlags) => (
                <>
                    <Corners color={() => (getFlags().isPressed ? "yellow" : "transparent")} />
                    <PageRipple flags={getFlags} color={"yellow"} />
                </>
            )}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top-out" }),
                offset: () => ({ x: 0, y: 5 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        Click me to toggle me.
                    </PageTooltipContent>
                ),
            })}
            onClick={props.onClick}
        />
    );
};
