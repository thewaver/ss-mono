import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground-core/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonExampleProps;

const HOLD_DURATION_MS = 2000;

export const HoldOnlyExample = (props: Props) => (
    <SlideButton
        mode={"hold"}
        holdDurationMs={HOLD_DURATION_MS}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        renderContent={(renderProps) => (
            <PageSlideButtonContent renderProps={renderProps}>Hold to send</PageSlideButtonContent>
        )}
        onActivate={props.onActivate}
    />
);
