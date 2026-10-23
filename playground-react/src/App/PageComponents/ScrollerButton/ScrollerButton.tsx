import { Button, type ScrollerAxis, type ScrollerStep } from "@thewaver/ss-components-react";

import { PageScrollerButtonContent } from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent";
import type { ScrollerButtonProps } from "./ScrollerButton.types";

const ARIA_LABELS: Record<ScrollerAxis, Record<ScrollerStep, string>> = {
    x: { previous: "Scroll back", next: "Scroll forward" },
    y: { previous: "Scroll up", next: "Scroll down" },
};

export const PageScrollerButton = (props: ScrollerButtonProps) => {
    const isPrevious = props.step === "previous";

    return (
        <Button
            isDisabled={isPrevious ? props.stepper.getIsAtStart() : props.stepper.getIsAtEnd()}
            ariaLabel={ARIA_LABELS[props.axis ?? "x"][props.step]}
            onClick={() => void (isPrevious ? props.stepper.stepToPrevious() : props.stepper.stepToNext())}
            renderContent={(flags) => <PageScrollerButtonContent flags={flags} step={props.step} axis={props.axis} />}
        />
    );
};
