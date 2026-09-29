import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

export const IndeterminateExample = () => (
    <Progress
        ariaLabel={"Reticulating splines"}
        sizing={"fit-content"}
        renderContent={(state) => <PageProgressContent state={state} />}
    />
);
