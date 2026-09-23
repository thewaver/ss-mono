import { createMemo, createSignal } from "solid-js";

import type { FileInputRejection } from "@thewaver/ss-components";

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
import { DROP_ZONE_REASON_TEXT, MAX_ATTACHMENT_BYTES } from "./FileInputPage.const";

const EXAMPLES_ROOT = "/src/App/Pages/FileInputPage/Examples";

const describe = (files: File[]) => (files.length ? files.map((file) => file.name).join(", ") : "none");

const describeRejections = (rejections: FileInputRejection[]) =>
    rejections.length
        ? rejections.map((rejection) => `${rejection.file.name}: ${DROP_ZONE_REASON_TEXT[rejection.reason]}`).join(", ")
        : "none";

export const FileInputPage = () => {
    const defaultSignal = createSignal<File[]>([]);
    const multipleSignal = createSignal<File[]>([]);
    const imagesSignal = createSignal<File[]>([]);
    const rejectingSignal = createSignal<File[]>([]);
    const disabledSignal = createSignal<File[]>([]);
    const reachableSignal = createSignal<File[]>([]);
    const erroredSignal = createSignal<File[]>([]);
    const labeledSignal = createSignal<File[]>([]);
    const dropZoneSignal = createSignal<File[]>([]);

    const [getRejection, setRejection] = createSignal("");
    const [getDropZoneRejections, setDropZoneRejections] = createSignal<FileInputRejection[]>([]);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Default",
            readout: () => `files: ${describe(defaultSignal[0]())}`,
            component: () => <DefaultExample filesSignal={defaultSignal} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "multiple",
            name: "Multiple",
            readout: () => `files: ${describe(multipleSignal[0]())}`,
            component: () => <MultipleExample filesSignal={multipleSignal} />,
            path: `${EXAMPLES_ROOT}/Multiple.tsx`,
        },
        {
            key: "images",
            name: "Accepting images only",
            readout: () => `files: ${describe(imagesSignal[0]())} — accept is a filter, never a guarantee`,
            component: () => <ImagesExample filesSignal={imagesSignal} />,
            path: `${EXAMPLES_ROOT}/Images.tsx`,
        },
        {
            key: "rejectingSetter",
            name: "Rejecting setter",
            readout: () =>
                `files: ${describe(rejectingSignal[0]())}${getRejection() ? ` — ${getRejection()}` : ` — anything over ${MAX_ATTACHMENT_BYTES} bytes is refused`}`,
            component: () => (
                <RejectingSetterExample
                    filesSignal={rejectingSignal}
                    rejection={getRejection}
                    onRejectionChange={setRejection}
                />
            ),
            path: `${EXAMPLES_ROOT}/RejectingSetter.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `files: ${describe(disabledSignal[0]())}`,
            component: () => <DisabledExample filesSignal={disabledSignal} />,
            path: `${EXAMPLES_ROOT}/Disabled.tsx`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `files: ${describe(reachableSignal[0]())}`,
            component: () => <ReachableExample filesSignal={reachableSignal} />,
            path: `${EXAMPLES_ROOT}/Reachable.tsx`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `files: ${describe(erroredSignal[0]())} — required, nothing picked yet`,
            component: () => <ErroredExample filesSignal={erroredSignal} />,
            path: `${EXAMPLES_ROOT}/Errored.tsx`,
        },
        {
            key: "label",
            name: "In a Label",
            readout: () => `files: ${describe(labeledSignal[0]())} — the caption opens the dialog`,
            component: () => <LabeledExample filesSignal={labeledSignal} />,
            path: `${EXAMPLES_ROOT}/Labeled.tsx`,
        },
        {
            key: "dropZone",
            name: "Drop area with limits",
            readout: () =>
                `files: ${describe(dropZoneSignal[0]())} — refused: ${describeRejections(getDropZoneRejections())}`,
            component: () => (
                <DropZoneExample filesSignal={dropZoneSignal} onRejectionsChange={setDropZoneRejections} />
            ),
            path: `${EXAMPLES_ROOT}/DropZone.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
