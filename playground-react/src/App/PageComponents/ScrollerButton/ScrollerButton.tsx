import { Button } from "@thewaver/ss-components-react";

import { PageScrollerButtonContent } from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent";
import type { ScrollerButtonProps } from "./ScrollerButton.types";

export const PageScrollerButton = (props: ScrollerButtonProps) => {
    const isPrevious = props.step === "previous";

    return (
        <Button
            isDisabled={isPrevious ? props.stepper.getIsAtStart() : props.stepper.getIsAtEnd()}
            ariaLabel={isPrevious ? "Scroll back" : "Scroll forward"}
            onClick={() => void (isPrevious ? props.stepper.stepToPrevious() : props.stepper.stepToNext())}
            renderContent={(flags) => <PageScrollerButtonContent flags={flags} step={props.step} />}
        />
    );
};
