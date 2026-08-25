import { Progress } from "@thewaver/ss-components";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

export const IndeterminateExample = () => (
    <Progress
        ariaLabel={"Reticulating splines"}
        sizing={"fit-content"}
        renderContent={(getState) => <PageProgressContent state={getState} />}
    />
);
