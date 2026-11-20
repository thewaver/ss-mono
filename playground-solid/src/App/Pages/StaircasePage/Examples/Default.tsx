import { splitProps } from "solid-js";

import { Staircase, StaircaseIndents, access } from "@thewaver/ss-components-solid";

import { PageStaircaseStep } from "../../../StyledComponents/StaircaseContent/StaircaseContent";
import type { StaircaseExampleProps } from "../StaircasePageSolid.types";

type Props = StaircaseExampleProps;

export const DefaultExample = (props: Props) => {
    const [, otherProps] = splitProps(props, ["indentKey"]);

    return (
        <Staircase
            {...otherProps}
            computeStepIndent={(defs) => StaircaseIndents.SAMPLE_INDENTS[access(props.indentKey)](defs)}
            renderStep={(getStep, getState) => <PageStaircaseStep state={getState}>{getStep()}</PageStaircaseStep>}
        />
    );
};
