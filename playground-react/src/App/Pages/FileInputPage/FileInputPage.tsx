import { useState } from "react";

import type { FileInputRejection } from "@thewaver/ss-components-react";
import {
    DROP_ZONE_REASON_TEXT,
    MAX_ATTACHMENT_BYTES,
} from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { DisabledExample } from "./Examples/Disabled";
import { DropZoneExample } from "./Examples/DropZone";
import { ErroredExample } from "./Examples/Errored";
import { ImagesExample } from "./Examples/Images";
import { LabeledExample } from "./Examples/Labeled";
import { MultipleExample } from "./Examples/Multiple";
import { ReachableExample } from "./Examples/Reachable";
import { RejectingSetterExample } from "./Examples/RejectingSetter";

const EXAMPLES_ROOT = "/src/App/Pages/FileInputPage/Examples";

const describe = (files: File[]) => (files.length ? files.map((file) => file.name).join(", ") : "none");

const describeRejections = (rejections: FileInputRejection[]) =>
    rejections.length
        ? rejections.map((rejection) => `${rejection.file.name}: ${DROP_ZONE_REASON_TEXT[rejection.reason]}`).join(", ")
        : "none";

export const FileInputPage = () => {
    const defaultState = useState<File[]>([]);
    const multipleState = useState<File[]>([]);
    const imagesState = useState<File[]>([]);
    const rejectingState = useState<File[]>([]);
    const disabledState = useState<File[]>([]);
    const reachableState = useState<File[]>([]);
    const erroredState = useState<File[]>([]);
    const labeledState = useState<File[]>([]);
    const dropZoneState = useState<File[]>([]);

    const [rejection, setRejection] = useState("");
    const [dropZoneRejections, setDropZoneRejections] = useState<FileInputRejection[]>([]);

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `files: ${describe(defaultState[0])}`,
            component: () => <DefaultExample files={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "multiple",
            name: "Multiple",
            readout: () => `files: ${describe(multipleState[0])}`,
            component: () => <MultipleExample files={multipleState} />,
            path: `${EXAMPLES_ROOT}/Multiple.tsx`,
        },
        {
            key: "images",
            name: "Accepting images only",
            readout: () => `files: ${describe(imagesState[0])} — accept is a filter, never a guarantee`,
            component: () => <ImagesExample files={imagesState} />,
            path: `${EXAMPLES_ROOT}/Images.tsx`,
        },
        {
            key: "rejectingSetter",
            name: "Rejecting setter",
            readout: () =>
                `files: ${describe(rejectingState[0])}${rejection ? ` — ${rejection}` : ` — anything over ${MAX_ATTACHMENT_BYTES} bytes is refused`}`,
            component: () => (
                <RejectingSetterExample
                    files={rejectingState}
                    rejection={rejection}
                    onRejectionChange={setRejection}
                />
            ),
            path: `${EXAMPLES_ROOT}/RejectingSetter.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `files: ${describe(disabledState[0])}`,
            component: () => <DisabledExample files={disabledState} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `files: ${describe(reachableState[0])}`,
            component: () => <ReachableExample files={reachableState} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `files: ${describe(erroredState[0])} — required, nothing picked yet`,
            component: () => <ErroredExample files={erroredState} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
        {
            key: "label",
            name: "In a Label",
            readout: () => `files: ${describe(labeledState[0])} — the caption opens the dialog`,
            component: () => <LabeledExample files={labeledState} />,
            path: `${EXAMPLES_ROOT}/Labeled.tsx`,
        },
        {
            key: "dropZone",
            name: "Drop area with limits",
            readout: () => `files: ${describe(dropZoneState[0])} — refused: ${describeRejections(dropZoneRejections)}`,
            component: () => <DropZoneExample files={dropZoneState} onRejectionsChange={setDropZoneRejections} />,
            path: `${EXAMPLES_ROOT}/DropZone.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
