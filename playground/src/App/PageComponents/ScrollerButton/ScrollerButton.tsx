import { Button, access } from "@thewaver/ss-components";

import { PageScrollerButtonContent } from "../../StyledComponents/ScrollerButtonContent/ScrollerButtonContent";
import type { ScrollerButtonProps } from "./ScrollerButton.types";

export const PageScrollerButton = (props: ScrollerButtonProps) => {
    const getIsPrevious = () => access(props.step) === "previous";

    return (
        <Button
            isDisabled={() =>
                getIsPrevious() ? access(props.stepper).getIsAtStart() : access(props.stepper).getIsAtEnd()
            }
            ariaLabel={() => (getIsPrevious() ? "Scroll back" : "Scroll forward")}
            onClick={() =>
                void (getIsPrevious() ? access(props.stepper).stepToPrevious() : access(props.stepper).stepToNext())
            }
            renderContent={(getFlags) => <PageScrollerButtonContent flags={getFlags} step={props.step} />}
        />
    );
};
