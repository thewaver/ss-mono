import { Button, access } from "@thewaver/ss-components";

import {
    PageNumberInputStepperContent,
    PageNumberInputStepperFrame,
} from "../../StyledComponents/NumberInputStepperContent/NumberInputStepperContent";
import type { NumberInputStepperProps } from "./NumberInputStepper.types";

export const PageNumberInputStepper = (props: NumberInputStepperProps) => {
    return (
        <PageNumberInputStepperFrame>
            <Button
                isDisabled={() =>
                    access(props.flags).isDisabled ||
                    access(props.flags).isReadOnly ||
                    access(props.stepper).getIsAtMax()
                }
                onPointerDown={access(props.stepper).startSteppingUp}
                onPointerUp={access(props.stepper).stopStepping}
                onMouseLeave={access(props.stepper).stopStepping}
                renderContent={(getFlags) => (
                    <PageNumberInputStepperContent flags={getFlags} direction={"up"}>
                        Increase
                    </PageNumberInputStepperContent>
                )}
            />

            <Button
                isDisabled={() =>
                    access(props.flags).isDisabled ||
                    access(props.flags).isReadOnly ||
                    access(props.stepper).getIsAtMin()
                }
                onPointerDown={access(props.stepper).startSteppingDown}
                onPointerUp={access(props.stepper).stopStepping}
                onMouseLeave={access(props.stepper).stopStepping}
                renderContent={(getFlags) => (
                    <PageNumberInputStepperContent flags={getFlags} direction={"down"}>
                        Decrease
                    </PageNumberInputStepperContent>
                )}
            />
        </PageNumberInputStepperFrame>
    );
};
