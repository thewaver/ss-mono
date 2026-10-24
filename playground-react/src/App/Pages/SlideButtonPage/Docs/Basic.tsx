import { useState } from "react";

import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonDocsExampleProps } from "../SlideButtonPageReact.types";

type Props = SlideButtonDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [sends, setSends] = useState(0);

    return (
        <SlideButton
            ariaDescription={"Hold Enter or Space to send."}
            thumbSize={SLIDE_BUTTON_THUMB_SIZE}
            mode={props.mode}
            completionRatio={props.completionRatio}
            holdDurationMs={props.holdDurationMs}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            renderContent={(renderProps) => (
                <PageSlideButtonContent renderProps={renderProps}>{`Slide or hold (${sends})`}</PageSlideButtonContent>
            )}
            onActivate={() => {
                setSends((prev) => prev + 1);
            }}
        />
    );
};
