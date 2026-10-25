import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";
import type { ProgressBasicDocsExampleProps } from "../ProgressPageReact.types";

type Props = ProgressBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => (
    <Progress
        value={props.value}
        hasError={props.hasError}
        ariaLabel={"Setup progress"}
        renderContent={(state) => <PageProgressContent state={state} />}
    />
);
