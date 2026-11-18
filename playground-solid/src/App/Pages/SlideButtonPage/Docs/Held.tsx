import { createSignal } from "solid-js";

import { Button, SlideButton } from "@thewaver/ss-components-solid";
import { HOLD_ENTER_SPACE_ARM_DESCRIPTION } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageControlRow } from "../../../PageComponents/ControlRow/ControlRow";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";

export const HeldDocsExample = () => {
    const [getIsArmed, setIsArmed] = createSignal(false);

    return (
        <PageControlRow>
            <SlideButton
                ariaDescription={HOLD_ENTER_SPACE_ARM_DESCRIPTION}
                isPressed={getIsArmed}
                thumbSize={SLIDE_BUTTON_THUMB_SIZE}
                renderContent={(getRenderProps) => (
                    <PageSlideButtonContent renderProps={getRenderProps}>Slide or hold</PageSlideButtonContent>
                )}
                onActivate={() => {
                    setIsArmed(true);
                }}
            />

            <Button
                isDisabled={() => !getIsArmed()}
                ariaLabel={"Reset"}
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.replay} />
                )}
                onClick={() => {
                    setIsArmed(false);
                }}
            />
        </PageControlRow>
    );
};
