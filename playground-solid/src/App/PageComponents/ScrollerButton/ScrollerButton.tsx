import { Button, type ScrollerAxis, type ScrollerStep, access } from "@thewaver/ss-components-solid";

import { PageScrollerButtonContent } from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent";
import type { ScrollerButtonProps } from "./ScrollerButton.types";

const ARIA_LABELS: Record<ScrollerAxis, Record<ScrollerStep, string>> = {
    x: { previous: "Scroll back", next: "Scroll forward" },
    y: { previous: "Scroll up", next: "Scroll down" },
};

export const PageScrollerButton = (props: ScrollerButtonProps) => {
    const getIsPrevious = () => access(props.step) === "previous";

    return (
        <Button
            isDisabled={() =>
                getIsPrevious() ? access(props.stepper).getIsAtStart() : access(props.stepper).getIsAtEnd()
            }
            ariaLabel={() => ARIA_LABELS[access(props.axis) ?? "x"][access(props.step)]}
            onClick={() =>
                void (getIsPrevious() ? access(props.stepper).stepToPrevious() : access(props.stepper).stepToNext())
            }
            renderContent={(getFlags) => (
                <PageScrollerButtonContent flags={getFlags} step={props.step} axis={props.axis} />
            )}
        />
    );
};
