import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground-core/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonErroredExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonErroredExampleProps;

export const ErroredExample = (props: Props) => {
    return (
        <SlideButton
            hasError={props.hasError}
            thumbSize={SLIDE_BUTTON_THUMB_SIZE}
            renderContent={(renderProps) => (
                <PageSlideButtonContent renderProps={renderProps}>Slide or hold to retry</PageSlideButtonContent>
            )}
            onActivate={props.onActivate}
        />
    );
};
