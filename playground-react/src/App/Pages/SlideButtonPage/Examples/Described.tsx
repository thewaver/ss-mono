import { FormField, SlideButton } from "@thewaver/ss-components-react";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground-core/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import {
    PageFormFieldCaption,
    PageFormFieldMessage,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

const HINT = "Hold the button, or slide it all the way, to send.";

type Props = SlideButtonExampleProps;

export const DescribedExample = (props: Props) => (
    <FormField
        message={HINT}
        renderCaption={() => <PageFormFieldCaption>Send the report</PageFormFieldCaption>}
        renderMessage={(fieldState) => <PageFormFieldMessage state={fieldState}>{HINT}</PageFormFieldMessage>}
        renderControl={() => (
            <SlideButton
                ariaLabel={"Send the report"}
                thumbSize={SLIDE_BUTTON_THUMB_SIZE}
                renderContent={(renderProps) => (
                    <PageSlideButtonContent renderProps={renderProps}>Slide or hold to send</PageSlideButtonContent>
                )}
                onActivate={props.onActivate}
            />
        )}
    />
);
