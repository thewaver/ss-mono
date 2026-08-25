import { Progress } from "@thewaver/ss-components";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const RATIO = 0.75;

export const FillingContainerExample = () => (
    <Progress
        value={() => RATIO}
        ariaLabel={"Full width progress"}
        renderContent={(getState) => <PageProgressContent state={getState} />}
    />
);
