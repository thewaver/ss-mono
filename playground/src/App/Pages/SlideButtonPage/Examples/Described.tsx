import { FormField, SlideButton } from "@thewaver/ss-components";

import {
    PageFormFieldCaption,
    PageFormFieldMessage,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

import { SLIDE_BUTTON_THUMB_SIZE } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.css";

const HINT = "Hold the button, or slide it all the way, to send.";

type Props = SlideButtonExampleProps;

export const DescribedExample = (props: Props) => (
    <FormField
        message={() => HINT}
        renderCaption={() => <PageFormFieldCaption>Send the report</PageFormFieldCaption>}
        renderMessage={(getFieldState) => <PageFormFieldMessage state={getFieldState}>{HINT}</PageFormFieldMessage>}
        renderControl={() => (
            <SlideButton
                ariaLabel={"Send the report"}
                thumbSize={() => SLIDE_BUTTON_THUMB_SIZE}
                renderContent={(getRenderProps) => (
                    <PageSlideButtonContent renderProps={getRenderProps}>Slide or hold to send</PageSlideButtonContent>
                )}
                onActivate={props.onActivate}
            />
        )}
    />
);
