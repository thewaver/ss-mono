import { Button, SlideButton, access } from "@thewaver/ss-components-solid";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageControlColumn } from "../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonHeldExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonHeldExampleProps;

export const HeldExample = (props: Props) => {
    return (
        <PageControlColumn>
            <SlideButton
                isPressed={props.isArmed}
                thumbSize={() => SLIDE_BUTTON_THUMB_SIZE}
                renderContent={(getRenderProps) => (
                    <PageSlideButtonContent renderProps={getRenderProps}>Slide or hold to arm</PageSlideButtonContent>
                )}
                onActivate={props.onActivate}
            />

            <Button
                isDisabled={() => !access(props.isArmed)}
                renderContent={(getRenderProps) => <PageButtonContent flags={getRenderProps}>Reset</PageButtonContent>}
                onClick={props.onReset}
            />
        </PageControlColumn>
    );
};
