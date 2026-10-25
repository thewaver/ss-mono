import { Show } from "solid-js";

import { Button, type ScrollerAxis, type ScrollerStep, access } from "@thewaver/ss-components-solid";

import { PageScrollerButtonContent } from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent";
import type { ScrollerButtonProps } from "./ScrollerButton.types";

const ARIA_LABELS: Record<ScrollerAxis, Record<ScrollerStep, string>> = {
    x: { previous: "Scroll back", next: "Scroll forward" },
    y: { previous: "Scroll up", next: "Scroll down" },
};

export const PageScrollerButton = (props: ScrollerButtonProps) => {
    const getAxis = () => access(props.axis) ?? "x";

    const getIsPrevious = () => access(props.step) === "previous";

    return (
        <Show when={access(props.controller)}>
            {(getController) => (
                <Button
                    id={props.id}
                    isDisabled={() =>
                        getIsPrevious()
                            ? getController()[getAxis()].getIsAtStart()
                            : getController()[getAxis()].getIsAtEnd()
                    }
                    ariaLabel={() => ARIA_LABELS[getAxis()][access(props.step)]}
                    ariaControls={() => getController().getBoxId()}
                    onClick={() =>
                        void (getIsPrevious()
                            ? getController()[getAxis()].stepToPrevious()
                            : getController()[getAxis()].stepToNext())
                    }
                    renderContent={(getFlags) => (
                        <PageScrollerButtonContent flags={getFlags} step={props.step} axis={getAxis} />
                    )}
                />
            )}
        </Show>
    );
};
