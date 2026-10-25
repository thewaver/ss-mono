import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

export const IndeterminateDocsExample = () => (
    <Progress ariaLabel={"Reticulating splines"} renderContent={(state) => <PageProgressContent state={state} />} />
);
