import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const OVERSHOOTING_VALUE = 5;

export const OutOfRangeExample = () => (
    <Progress
        value={OVERSHOOTING_VALUE}
        ariaLabel={"Clamped progress"}
        sizing={"fit-content"}
        renderContent={(state) => <PageProgressContent state={state} />}
    />
);
