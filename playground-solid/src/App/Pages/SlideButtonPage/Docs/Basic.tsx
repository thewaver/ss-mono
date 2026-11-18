import { createSignal } from "solid-js";

import { SlideButton } from "@thewaver/ss-components-solid";
import { HOLD_ENTER_SPACE_SEND_DESCRIPTION } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonDocsExampleProps } from "../SlideButtonPageSolid.types";

type Props = SlideButtonDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getSends, setSends] = createSignal(0);

    return (
        <SlideButton
            ariaDescription={HOLD_ENTER_SPACE_SEND_DESCRIPTION}
            thumbSize={SLIDE_BUTTON_THUMB_SIZE}
            mode={props.mode}
            completionRatio={props.completionRatio}
            holdDurationMs={props.holdDurationMs}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            renderContent={(getRenderProps) => (
                <PageSlideButtonContent renderProps={getRenderProps}>
                    {`Slide or hold (${getSends()})`}
                </PageSlideButtonContent>
            )}
            onActivate={() => {
                setSends((sends) => sends + 1);
            }}
        />
    );
};
