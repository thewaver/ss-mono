import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const RATIO = 0.6;

export const VerticalDocsExample = () => (
    <Progress
        value={RATIO}
        ariaLabel={"Battery charge"}
        renderContent={(state) => <PageProgressContent state={state} orientation={"vertical"} />}
    />
);
