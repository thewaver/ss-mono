import { Progress } from "@thewaver/ss-components-solid";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

export const IndeterminateDocsExample = () => (
    <Progress
        ariaLabel={"Reticulating splines"}
        renderContent={(getState) => <PageProgressContent state={getState} />}
    />
);
