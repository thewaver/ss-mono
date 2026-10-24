import { useState } from "react";

import { SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonDirectionsDocsExampleProps } from "../SlideButtonPageReact.types";

type Props = SlideButtonDirectionsDocsExampleProps;

export const DirectionsDocsExample = (props: Props) => {
    const [sends, setSends] = useState(0);

    return (
        <div dir={props.direction}>
            <SlideButton
                ariaDescription={"Hold Enter or Space to send."}
                orientation={props.orientation}
                thumbSize={SLIDE_BUTTON_THUMB_SIZE}
                renderContent={(renderProps) => (
                    <PageSlideButtonContent renderProps={renderProps}>
                        {`Slide or hold (${sends})`}
                    </PageSlideButtonContent>
                )}
                onActivate={() => {
                    setSends((prev) => prev + 1);
                }}
            />
        </div>
    );
};
