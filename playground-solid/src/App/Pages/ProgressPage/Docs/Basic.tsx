import { Progress } from "@thewaver/ss-components-solid";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";
import type { ProgressBasicDocsExampleProps } from "../ProgressPageSolid.types";

type Props = ProgressBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => (
    <Progress
        value={props.value}
        hasError={props.hasError}
        ariaLabel={"Setup progress"}
        renderContent={(getState) => <PageProgressContent state={getState} />}
    />
);
