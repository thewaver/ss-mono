import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground-core/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonExampleProps;

export const DisabledExample = (props: Props) => (
    <SlideButton
        isDisabled={true}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        renderContent={(renderProps) => (
            <PageSlideButtonContent renderProps={renderProps}>Slide or hold to send</PageSlideButtonContent>
        )}
        onActivate={props.onActivate}
    />
);
