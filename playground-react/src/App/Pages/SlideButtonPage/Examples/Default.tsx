import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground-core/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonExampleProps & { progressState?: readonly [number, (ratio: number) => void] };

export const DefaultExample = (props: Props) => (
    <SlideButton
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        progressState={props.progressState}
        renderContent={(renderProps) => (
            <PageSlideButtonContent renderProps={renderProps}>Slide or hold to send</PageSlideButtonContent>
        )}
        onActivate={props.onActivate}
    />
);
