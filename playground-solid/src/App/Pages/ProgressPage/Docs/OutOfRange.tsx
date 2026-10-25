import { Progress } from "@thewaver/ss-components-solid";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const OVERSHOOTING_VALUE = 5;

export const OutOfRangeDocsExample = () => (
    <Progress
        value={OVERSHOOTING_VALUE}
        ariaLabel={"Clamped progress"}
        renderContent={(getState) => <PageProgressContent state={getState} />}
    />
);
