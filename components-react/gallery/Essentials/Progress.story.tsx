import { useEffect, useState } from "react";

import type { ProgressState } from "@thewaver/ss-components";

import { Progress } from "../../src";

const PERCENT = 100;
const UPLOAD_TOTAL_BYTES = 2_400_000;
const UPLOAD_TICK_BYTES = 24_000;
const UPLOAD_TICK_MS = 50;
const BYTES_PER_KB = 1000;

const Bar = ({ state }: { state: ProgressState }) => (
    <div data-testid="track" style={{ width: "100%" }}>
        <div data-testid="fill" style={{ width: `${(state.ratio ?? 0) * PERCENT}%`, height: 8, background: "teal" }} />
        <span aria-hidden="true" data-testid="painted">
            {state.ratio === undefined ? "working" : `${Math.round(state.ratio * PERCENT)}%`}
        </span>
    </div>
);

export const Determinate = ({ sizing }: { sizing?: "fit-content" | "fill" }) => (
    <Progress
        id="progress"
        ariaLabel="Setup progress"
        value={0.4}
        sizing={sizing ?? "fit-content"}
        renderContent={(state) => <Bar state={state} />}
    />
);

export const Indeterminate = () => (
    <Progress id="progress" ariaLabel="Working" renderContent={(state) => <Bar state={state} />} />
);

export const OutOfRange = () => (
    <Progress id="progress" ariaLabel="Overshoot" value={5} renderContent={(state) => <Bar state={state} />} />
);

export const Errored = () => (
    <Progress
        id="progress"
        ariaLabel="Transfer"
        value={0.62}
        hasError
        renderContent={(state) => <Bar state={state} />}
    />
);

export const DiskMeter = () => (
    <Progress
        id="progress"
        role="meter"
        ariaLabel="Disk usage"
        value={412}
        max={512}
        ariaValueText="412 of 512 GB used"
        renderContent={(state) => <Bar state={state} />}
    />
);

export const Labelled = () => (
    <>
        <span id="caption">Copying</span>
        <Progress id="progress" ariaLabelledBy="caption" value={0.2} renderContent={(state) => <Bar state={state} />} />
    </>
);

export const LiveRange = () => {
    const [uploadedBytes, setUploadedBytes] = useState(0);

    useEffect(() => {
        const timer = setInterval(
            () => setUploadedBytes((prev) => (prev >= UPLOAD_TOTAL_BYTES ? 0 : prev + UPLOAD_TICK_BYTES)),
            UPLOAD_TICK_MS,
        );

        return () => clearInterval(timer);
    }, []);

    return (
        <Progress
            id="progress"
            ariaLabel="Upload"
            value={uploadedBytes}
            max={UPLOAD_TOTAL_BYTES}
            ariaValueText={`${uploadedBytes / BYTES_PER_KB} of ${UPLOAD_TOTAL_BYTES / BYTES_PER_KB} kB`}
            renderContent={(state) => <Bar state={state} />}
        />
    );
};

export const Sizings = () => (
    <div style={{ width: 400 }}>
        <Progress
            id="fit"
            ariaLabel="Fit"
            value={0.5}
            sizing="fit-content"
            renderContent={() => <span style={{ display: "block", width: 40 }}>fit</span>}
        />
        <Progress
            id="fill"
            ariaLabel="Fill"
            value={0.5}
            renderContent={() => <span style={{ display: "block", width: 40 }}>fill</span>}
        />
    </div>
);
