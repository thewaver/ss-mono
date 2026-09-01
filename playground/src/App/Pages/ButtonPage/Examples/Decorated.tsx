import { createSignal } from "solid-js";

import { Button, Corners, type InteractionActivation } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageRipple } from "../../../StyledComponents/Ripple/Ripple";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ButtonPressedExampleProps } from "../ButtonPage.types";

type Props = ButtonPressedExampleProps;

export const DecoratedExample = (props: Props) => {
    const [getActivation, setActivation] = createSignal<InteractionActivation>();

    return (
        <Button
            isPressed={props.isPressed}
            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Toggle Me</PageButtonContent>}
            onActivation={setActivation}
            renderDecoration={(getFlags) => (
                <>
                    <Corners color={() => (getFlags().isPressed ? "yellow" : "transparent")} />
                    <PageRipple activation={getActivation} color={"yellow"} />
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
