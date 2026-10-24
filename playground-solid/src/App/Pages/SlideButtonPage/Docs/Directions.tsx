import { createSignal } from "solid-js";

import { SlideButton, access } from "@thewaver/ss-components-solid";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonDirectionsDocsExampleProps } from "../SlideButtonPageSolid.types";

type Props = SlideButtonDirectionsDocsExampleProps;

export const DirectionsDocsExample = (props: Props) => {
    const [getSends, setSends] = createSignal(0);

    return (
        <div dir={access(props.direction)}>
            <SlideButton
                ariaDescription={"Hold Enter or Space to send."}
                orientation={props.orientation}
                thumbSize={SLIDE_BUTTON_THUMB_SIZE}
                renderContent={(getRenderProps) => (
                    <PageSlideButtonContent renderProps={getRenderProps}>
                        {`Slide or hold (${getSends()})`}
                    </PageSlideButtonContent>
                )}
                onActivate={() => {
                    setSends((sends) => sends + 1);
                }}
            />
        </div>
    );
};
