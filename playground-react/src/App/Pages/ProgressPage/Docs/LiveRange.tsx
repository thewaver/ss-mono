import { useEffect, useState } from "react";

import { Progress } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    BYTES_PER_KB,
    UPLOAD_TICK_BYTES,
    UPLOAD_TICK_MS,
    UPLOAD_TOTAL_BYTES,
} from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

export const LiveRangeDocsExample = () => {
    const [uploadedBytes, setUploadedBytes] = useState(0);

    const valueText = `${Math.round(uploadedBytes / BYTES_PER_KB)} of ${Math.round(UPLOAD_TOTAL_BYTES / BYTES_PER_KB)} kB`;

    useEffect(() => {
        const timer = setInterval(() => {
            setUploadedBytes((bytes) => (bytes >= UPLOAD_TOTAL_BYTES ? 0 : bytes + UPLOAD_TICK_BYTES));
        }, UPLOAD_TICK_MS);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <>
            <Progress
                value={uploadedBytes}
                max={UPLOAD_TOTAL_BYTES}
                ariaLabel={"Upload"}
                ariaValueText={valueText}
                renderContent={(state) => <PageProgressContent state={state} />}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Read out as: ${valueText}`}</div>
        </>
    );
};
