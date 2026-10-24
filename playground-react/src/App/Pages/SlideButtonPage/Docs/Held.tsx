import { useState } from "react";

import { Button, SlideButton } from "@thewaver/ss-components-react";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import { PageControlRow } from "../../../PageComponents/ControlRow/ControlRow";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";

export const HeldDocsExample = () => {
    const [isArmed, setIsArmed] = useState(false);

    return (
        <PageControlRow>
            <SlideButton
                ariaDescription={"Hold Enter or Space to arm."}
                isPressed={isArmed}
                thumbSize={SLIDE_BUTTON_THUMB_SIZE}
                renderContent={(renderProps) => (
                    <PageSlideButtonContent renderProps={renderProps}>Slide or hold to arm</PageSlideButtonContent>
                )}
                onActivate={() => {
                    setIsArmed(true);
                }}
            />

            <Button
                isDisabled={!isArmed}
                ariaLabel={"Reset"}
                renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={CONTROL_GLYPHS.replay} />}
                onClick={() => {
                    setIsArmed(false);
                }}
            />
        </PageControlRow>
    );
};
