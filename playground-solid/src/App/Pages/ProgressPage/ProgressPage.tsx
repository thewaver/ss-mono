import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    UPLOAD_TICK_BYTES,
    UPLOAD_TICK_MS,
    UPLOAD_TOTAL_BYTES,
} from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DeterminateExample } from "./Examples/Determinate";
import { DiskMeterExample } from "./Examples/DiskMeter";
import { ErroredExample } from "./Examples/Errored";
import { FillingContainerExample } from "./Examples/FillingContainer";
import { IndeterminateExample } from "./Examples/Indeterminate";
import { LiveRangeExample } from "./Examples/LiveRange";
import { OutOfRangeExample } from "./Examples/OutOfRange";
import { RingExample } from "./Examples/Ring";
import type { ProgressExampleProps } from "./ProgressPageSolid.types";

export const ProgressPage = () => {
    const [getUploadedBytes, setUploadedBytes] = createSignal(0);

    onMount(() => {
        const timer = setInterval(() => {
            setUploadedBytes((prev) => (prev >= UPLOAD_TOTAL_BYTES ? 0 : prev + UPLOAD_TICK_BYTES));
        }, UPLOAD_TICK_MS);

        onCleanup(() => {
            clearInterval(timer);
        });
    });

    const getExamples = createMemo(() => {
        const commonProps: ProgressExampleProps = {
            uploadedBytes: getUploadedBytes,
            uploadTotalBytes: () => UPLOAD_TOTAL_BYTES,
        };

        return [
            {
                key: "determinate",
                name: EXAMPLE_NAMES.determinate,
                readout: () => "ratio: 0.4 — a plain 0..1 value, which is what the painter is handed",
                component: () => <DeterminateExample />,
                path: `${EXAMPLES_ROOT}/Determinate.tsx`,
            },
            {
                key: "indeterminate",
                name: EXAMPLE_NAMES.indeterminate,
                readout: () => "no value at all, so aria-valuenow is absent and the painter animates instead",
                component: () => <IndeterminateExample />,
                path: `${EXAMPLES_ROOT}/Indeterminate.tsx`,
            },
            {
                key: "liveRange",
                name: EXAMPLE_NAMES.liveRange,
                readout: () => `${getUploadedBytes()} of ${UPLOAD_TOTAL_BYTES} bytes — min and max are the real units`,
                component: () => <LiveRangeExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/LiveRange.tsx`,
            },
            {
                key: "outOfRange",
                name: EXAMPLE_NAMES.outOfRange,
                readout: () => "value: 5 against a 0..1 range — clamped rather than drawn past the end",
                component: () => <OutOfRangeExample />,
                path: `${EXAMPLES_ROOT}/OutOfRange.tsx`,
            },
            {
                key: "errored",
                name: EXAMPLE_NAMES.errored,
                readout: () => "value: 0.62 — the transfer stalled, and hasError is the owner's to say",
                component: () => <ErroredExample />,
                path: `${EXAMPLES_ROOT}/Errored.tsx`,
            },
            {
                key: "diskMeter",
                name: EXAMPLE_NAMES.diskMeter,
                readout: () =>
                    'role="meter" — a reading of how full the disk is rather than work that will finish, so it is announced as a gauge and has no indeterminate state',
                component: () => <DiskMeterExample />,
                path: `${EXAMPLES_ROOT}/DiskMeter.tsx`,
            },
            {
                key: "ring",
                name: EXAMPLE_NAMES.ring,
                readout: () =>
                    `${getUploadedBytes()} of ${UPLOAD_TOTAL_BYTES} bytes — the same upload as the live range, painted round a circle; the component is unchanged`,
                component: () => <RingExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Ring.tsx`,
            },
            {
                key: "fillingContainer",
                name: EXAMPLE_NAMES.fillingContainer,
                readout: () => "sizing: fill — the default, since a track's natural width is its container's",
                component: () => <FillingContainerExample />,
                path: `${EXAMPLES_ROOT}/FillingContainer.tsx`,
            },
        ];
    });

    return <PageExamples items={getExamples} />;
};
