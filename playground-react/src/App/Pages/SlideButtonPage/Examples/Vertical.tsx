import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPageReact.types";

type Props = SlideButtonExampleProps;

export const VerticalExample = (props: Props) => (
    <SlideButton
        orientation={"vertical"}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        renderContent={(renderProps) => (
            <PageSlideButtonContent renderProps={renderProps}>Slide up or hold</PageSlideButtonContent>
        )}
        onActivate={props.onActivate}
    />
);
