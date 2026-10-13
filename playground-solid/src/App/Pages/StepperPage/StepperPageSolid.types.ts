import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseStepperExampleCbs,
    BaseStepperExampleValues,
} from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.types";

export type StepperExampleProps = AccessorValues<BaseStepperExampleValues> & BaseStepperExampleCbs;
