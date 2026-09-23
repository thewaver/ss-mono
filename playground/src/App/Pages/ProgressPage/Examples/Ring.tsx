import { Progress, access } from "@thewaver/ss-components";

import { PageProgressRing } from "../../../StyledComponents/ProgressRing/ProgressRing";
import type { ProgressExampleProps } from "../ProgressPage.types";

const BYTES_PER_KB = 1000;

type Props = ProgressExampleProps;

export const RingExample = (props: Props) => (
    <Progress
        value={props.uploadedBytes}
        max={props.uploadTotalBytes}
        ariaLabel={"Upload, drawn as a ring"}
        ariaValueText={() =>
            `${Math.round(access(props.uploadedBytes) / BYTES_PER_KB)} of ${Math.round(
                access(props.uploadTotalBytes) / BYTES_PER_KB,
            )} kB`
        }
        sizing={"fit-content"}
        renderContent={(getState) => <PageProgressRing state={getState} />}
    />
);
