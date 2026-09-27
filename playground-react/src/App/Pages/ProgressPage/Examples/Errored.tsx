import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const STALLED_RATIO = 0.62;

export const ErroredExample = () => (
    <Progress
        value={STALLED_RATIO}
        hasError={true}
        ariaLabel={"Failed upload"}
        sizing={"fit-content"}
        renderContent={(state) => <PageProgressContent state={state} />}
    />
);
