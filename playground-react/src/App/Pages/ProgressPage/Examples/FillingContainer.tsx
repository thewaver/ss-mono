import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const RATIO = 0.75;

export const FillingContainerExample = () => (
    <Progress
        value={RATIO}
        ariaLabel={"Full width progress"}
        renderContent={(state) => <PageProgressContent state={state} />}
    />
);
