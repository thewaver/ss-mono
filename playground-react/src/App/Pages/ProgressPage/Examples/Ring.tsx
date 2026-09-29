import { Progress } from "@thewaver/ss-components-react";

import { PageProgressRing } from "../../../StyledComponents/ProgressRing/ProgressRing";
import type { ProgressExampleProps } from "../ProgressPage.types";

const BYTES_PER_KB = 1000;

type Props = ProgressExampleProps;

export const RingExample = (props: Props) => (
    <Progress
        value={props.uploadedBytes}
        max={props.uploadTotalBytes}
        ariaLabel={"Upload, drawn as a ring"}
        ariaValueText={`${Math.round(props.uploadedBytes / BYTES_PER_KB)} of ${Math.round(
            props.uploadTotalBytes / BYTES_PER_KB,
        )} kB`}
        sizing={"fit-content"}
        renderContent={(state) => <PageProgressRing state={state} />}
    />
);
