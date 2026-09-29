import { Button } from "@thewaver/ss-components-react";

import {
    PageNumberInputStepperContent,
    PageNumberInputStepperFrame,
} from "../../StyledComponents/NumberInputStepperContent/NumberInputStepperContent";
import type { NumberInputStepperProps } from "./NumberInputStepper.types";

export const PageNumberInputStepper = (props: NumberInputStepperProps) => {
    return (
        <PageNumberInputStepperFrame>
            <Button
                isDisabled={props.flags.isDisabled || props.flags.isReadOnly || props.stepper.getIsAtMax()}
                onPointerDown={props.stepper.startSteppingUp}
                onPointerUp={props.stepper.stopStepping}
                onMouseLeave={props.stepper.stopStepping}
                renderContent={(flags) => (
                    <PageNumberInputStepperContent flags={flags} direction={"up"}>
                        Increase
                    </PageNumberInputStepperContent>
                )}
            />

            <Button
                isDisabled={props.flags.isDisabled || props.flags.isReadOnly || props.stepper.getIsAtMin()}
                onPointerDown={props.stepper.startSteppingDown}
                onPointerUp={props.stepper.stopStepping}
                onMouseLeave={props.stepper.stopStepping}
                renderContent={(flags) => (
                    <PageNumberInputStepperContent flags={flags} direction={"down"}>
                        Decrease
                    </PageNumberInputStepperContent>
                )}
            />
        </PageNumberInputStepperFrame>
    );
};
