import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPageReact.types";

type Props = SlideButtonExampleProps;

export const RightToLeftExample = (props: Props) => (
    <div dir={"rtl"}>
        <SlideButton
            thumbSize={SLIDE_BUTTON_THUMB_SIZE}
            renderContent={(renderProps) => (
                <PageSlideButtonContent renderProps={renderProps}>Slide or hold to send</PageSlideButtonContent>
            )}
            onActivate={props.onActivate}
        />
    </div>
);
