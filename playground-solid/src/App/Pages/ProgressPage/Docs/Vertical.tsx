import { Progress } from "@thewaver/ss-components-solid";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const RATIO = 0.6;

export const VerticalDocsExample = () => (
    <Progress
        value={RATIO}
        ariaLabel={"Battery charge"}
        renderContent={(getState) => <PageProgressContent state={getState} orientation={"vertical"} />}
    />
);
