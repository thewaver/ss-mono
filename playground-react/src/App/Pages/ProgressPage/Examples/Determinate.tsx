import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const RATIO = 0.4;

export const DeterminateExample = () => (
    <Progress
        value={RATIO}
        ariaLabel={"Setup progress"}
        sizing={"fit-content"}
        renderContent={(state) => <PageProgressContent state={state} />}
    />
);
