import { Progress } from "@thewaver/ss-components-solid";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

const USED_GB = 412;
const TOTAL_GB = 512;

export const DiskMeterDocsExample = () => (
    <Progress
        role={"meter"}
        value={USED_GB}
        max={TOTAL_GB}
        ariaLabel={"Disk usage"}
        ariaValueText={`${USED_GB} of ${TOTAL_GB} GB used`}
        renderContent={(getState) => <PageProgressContent state={getState} />}
    />
);
