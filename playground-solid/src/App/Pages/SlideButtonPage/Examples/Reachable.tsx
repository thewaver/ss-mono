import { SlideButton } from "@thewaver/ss-components-solid";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonExampleProps;

export const ReachableExample = (props: Props) => (
    <SlideButton
        isDisabled={true}
        isReachableWhenDisabled={true}
        thumbSize={() => SLIDE_BUTTON_THUMB_SIZE}
        renderContent={(getRenderProps) => (
            <PageSlideButtonContent renderProps={getRenderProps}>Slide or hold to send</PageSlideButtonContent>
        )}
        tooltipDefs={() => ({
            placement: () => ({ x: "center", y: "top-out" }),
            offset: () => ({ x: 0, y: 10 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    Focusable so this tooltip can be read, but neither a drag nor a held Enter may leave the count above
                    zero.
                </PageTooltipContent>
            ),
        })}
        onActivate={props.onActivate}
    />
);
