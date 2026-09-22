import { SlideButton } from "@thewaver/ss-components";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

import { SLIDE_BUTTON_THUMB_SIZE } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.css";

type Props = SlideButtonExampleProps;

export const SlideOnlyExample = (props: Props) => (
    <SlideButton
        mode={() => "slide"}
        thumbSize={() => SLIDE_BUTTON_THUMB_SIZE}
        renderContent={(getRenderProps) => (
            <PageSlideButtonContent renderProps={getRenderProps}>Slide to send</PageSlideButtonContent>
        )}
        onActivate={props.onActivate}
    />
);
