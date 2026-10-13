import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseStepArcConnectorValues,
    BaseStepConnectorValues,
    BaseStepContentValues,
} from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.types";

export type { PageStepState } from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.types";

export type StepContentProps = AccessorValues<BaseStepContentValues>;

export type StepConnectorProps = AccessorValues<BaseStepConnectorValues>;

export type StepArcConnectorProps = AccessorValues<BaseStepArcConnectorValues>;
