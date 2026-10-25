import { useSyncExternalStore } from "react";

import { Button, type ScrollerAxis, type ScrollerStep } from "@thewaver/ss-components-react";

import { PageScrollerButtonContent } from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent";
import type { ScrollerButtonProps } from "./ScrollerButton.types";

const NO_SUBSCRIPTION = () => () => {};

const ARIA_LABELS: Record<ScrollerAxis, Record<ScrollerStep, string>> = {
    x: { previous: "Scroll back", next: "Scroll forward" },
    y: { previous: "Scroll up", next: "Scroll down" },
};

export const PageScrollerButton = (props: ScrollerButtonProps) => {
    const controller = props.controller;
    const axis = props.axis ?? "x";
    const isPrevious = props.step === "previous";

    const subscribe = controller?.subscribe ?? NO_SUBSCRIPTION;

    const isDisabled = useSyncExternalStore(subscribe, () => {
        const stepper = controller?.[axis];

        return stepper !== undefined && (isPrevious ? stepper.getIsAtStart() : stepper.getIsAtEnd());
    });
    const boxId = useSyncExternalStore(subscribe, () => controller?.getBoxId());

    if (!controller) return null;

    const stepper = controller[axis];

    return (
        <Button
            id={props.id}
            isDisabled={isDisabled}
            ariaLabel={ARIA_LABELS[axis][props.step]}
            ariaControls={boxId}
            onClick={() => void (isPrevious ? stepper.stepToPrevious() : stepper.stepToNext())}
            renderContent={(flags) => <PageScrollerButtonContent flags={flags} step={props.step} axis={axis} />}
        />
    );
};
