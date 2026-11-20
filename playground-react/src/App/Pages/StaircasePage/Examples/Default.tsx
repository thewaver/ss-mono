import { Staircase, StaircaseIndents } from "@thewaver/ss-components-react";

import { PageStaircaseStep } from "../../../StyledComponents/StaircaseContent/StaircaseContent";
import type { StaircaseExampleProps } from "../StaircasePageReact.types";

type Props = StaircaseExampleProps;

export const DefaultExample = (props: Props) => {
    const { indentKey, ...otherProps } = props;

    return (
        <Staircase
            {...otherProps}
            computeStepIndent={(defs) => StaircaseIndents.SAMPLE_INDENTS[props.indentKey](defs)}
            renderStep={(step, state) => <PageStaircaseStep state={state}>{step}</PageStaircaseStep>}
        />
    );
};
