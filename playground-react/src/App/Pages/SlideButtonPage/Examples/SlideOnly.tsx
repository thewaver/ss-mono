import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonExampleProps;

export const SlideOnlyExample = (props: Props) => (
    <SlideButton
        mode={"slide"}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        renderContent={(renderProps) => (
            <PageSlideButtonContent renderProps={renderProps}>Slide to send</PageSlideButtonContent>
        )}
        onActivate={props.onActivate}
    />
);
