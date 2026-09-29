import { Progress } from "@thewaver/ss-components-react";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";
import type { ProgressExampleProps } from "../ProgressPage.types";

const BYTES_PER_KB = 1000;

type Props = ProgressExampleProps;

export const LiveRangeExample = (props: Props) => {
    return (
        <Progress
            value={props.uploadedBytes}
            max={props.uploadTotalBytes}
            ariaLabel={"Upload"}
            ariaValueText={`${Math.round(props.uploadedBytes / BYTES_PER_KB)} of ${Math.round(
                props.uploadTotalBytes / BYTES_PER_KB,
            )} kB`}
            sizing={"fit-content"}
            renderContent={(state) => <PageProgressContent state={state} />}
        />
    );
};
