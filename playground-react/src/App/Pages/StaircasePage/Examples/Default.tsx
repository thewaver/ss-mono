import { Staircase, StaircaseIndents } from "@thewaver/ss-components-react";

import { PageStaircaseStep } from "../../../StyledComponents/StaircaseContent/StaircaseContent";
import type { StaircaseExampleProps } from "../StaircasePage.types";

type Props = StaircaseExampleProps;

export const DefaultExample = ({ indentKey, ...otherProps }: Props) => {
    return (
        <Staircase
            {...otherProps}
            computeStepIndent={(defs) => StaircaseIndents.SAMPLE_INDENTS[indentKey](defs)}
            renderStep={(step, state) => <PageStaircaseStep state={state}>{step}</PageStaircaseStep>}
        />
    );
};
