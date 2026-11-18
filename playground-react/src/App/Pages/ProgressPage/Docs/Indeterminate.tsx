import { Progress } from "@thewaver/ss-components-react";
import { RETICULATING_SPLINES_LABEL } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

export const IndeterminateDocsExample = () => (
    <Progress ariaLabel={RETICULATING_SPLINES_LABEL} renderContent={(state) => <PageProgressContent state={state} />} />
);
