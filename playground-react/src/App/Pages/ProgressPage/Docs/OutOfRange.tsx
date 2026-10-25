import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const OVERSHOOTING_VALUE = 5;

export const OutOfRangeDocsExample = () => (
    <Progress
        value={OVERSHOOTING_VALUE}
        ariaLabel={"Clamped progress"}
        renderContent={(state) => <PageProgressContent state={state} />}
    />
);
