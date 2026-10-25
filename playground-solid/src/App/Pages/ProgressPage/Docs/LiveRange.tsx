import { createSignal, onCleanup, onMount } from "solid-js";

import { Progress } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    BYTES_PER_KB,
    UPLOAD_TICK_BYTES,
    UPLOAD_TICK_MS,
    UPLOAD_TOTAL_BYTES,
} from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import { PageProgressContent } from "../../../StyledComponents/ProgressContent/ProgressContent";

export const LiveRangeDocsExample = () => {
    const [getUploadedBytes, setUploadedBytes] = createSignal(0);

    const getValueText = () =>
        `${Math.round(getUploadedBytes() / BYTES_PER_KB)} of ${Math.round(UPLOAD_TOTAL_BYTES / BYTES_PER_KB)} kB`;

    onMount(() => {
        const timer = setInterval(() => {
            setUploadedBytes((bytes) => (bytes >= UPLOAD_TOTAL_BYTES ? 0 : bytes + UPLOAD_TICK_BYTES));
        }, UPLOAD_TICK_MS);

        onCleanup(() => {
            clearInterval(timer);
        });
    });

    return (
        <>
            <Progress
                value={getUploadedBytes}
                max={UPLOAD_TOTAL_BYTES}
                ariaLabel={"Upload"}
                ariaValueText={getValueText}
                renderContent={(getState) => <PageProgressContent state={getState} />}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Read out as: ${getValueText()}`}</div>
        </>
    );
};
