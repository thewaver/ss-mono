import { SlideButton } from "@thewaver/ss-components";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

import { SLIDE_BUTTON_THUMB_SIZE } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.css";

type Props = SlideButtonExampleProps;

const HOLD_DURATION_MS = 2000;

export const HoldOnlyExample = (props: Props) => (
    <SlideButton
        mode={() => "hold"}
        holdDurationMs={() => HOLD_DURATION_MS}
        thumbSize={() => SLIDE_BUTTON_THUMB_SIZE}
        renderContent={(getRenderProps) => (
            <PageSlideButtonContent renderProps={getRenderProps}>Hold to send</PageSlideButtonContent>
        )}
        onActivate={props.onActivate}
    />
);
