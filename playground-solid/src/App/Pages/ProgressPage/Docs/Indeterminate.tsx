import { Progress } from "@thewaver/ss-components-solid";
import { RETICULATING_SPLINES_LABEL } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

export const IndeterminateDocsExample = () => (
    <Progress
        ariaLabel={RETICULATING_SPLINES_LABEL}
        renderContent={(getState) => <PageProgressContent state={getState} />}
    />
);
