import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground-core/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonExampleProps;

export const ReachableExample = (props: Props) => (
    <SlideButton
        isDisabled={true}
        isReachableWhenDisabled={true}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        renderContent={(renderProps) => (
            <PageSlideButtonContent renderProps={renderProps}>Slide or hold to send</PageSlideButtonContent>
        )}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Focusable so this tooltip can be read, but neither a drag nor a held Enter may leave the count above
                    zero.
                </PageTooltipContent>
            ),
        }}
        onActivate={props.onActivate}
    />
);
