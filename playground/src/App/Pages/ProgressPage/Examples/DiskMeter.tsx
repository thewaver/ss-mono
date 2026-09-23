import { Progress } from "@thewaver/ss-components";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const USED_GB = 412;
const TOTAL_GB = 512;

export const DiskMeterExample = () => (
    <Progress
        role={"meter"}
        value={USED_GB}
        max={TOTAL_GB}
        ariaLabel={"Disk usage"}
        ariaValueText={`${USED_GB} of ${TOTAL_GB} GB used`}
        sizing={"fit-content"}
        renderContent={(getState) => <PageProgressContent state={getState} />}
    />
);
