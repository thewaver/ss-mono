import { useState } from "react";

import type { FileInputRejection, FileInputRenderProps, InteractionFlags } from "@thewaver/ss-components";

import { FileInput } from "../../src";

const FIELD_WIDTH = 240;
const FIELD_HEIGHT = 40;
const MAX_ATTACHMENT_BYTES = 1024;
const DROP_ZONE_MAX_FILES = 2;
const DROP_ZONE_MAX_SIZE_BYTES = 1024;

const TOOLTIP_DEFS = {
    placement: { x: "center", y: "top-out" },
    hoverShowDelayMs: 0,
    renderContent: () => <span>Uploads are closed</span>,
} as const;

const describe = (files: File[]) => files.map((file) => file.name).join(", ") || "none";

const Painter = ({ flags }: { flags: InteractionFlags<FileInputRenderProps> }) => (
    <div
        aria-hidden="true"
        data-drag-over={flags.isDragOver || undefined}
        style={{
            width: FIELD_WIDTH,
            height: FIELD_HEIGHT,
            border: `1px ${flags.isDragOver ? "dashed" : "solid"} ${flags.hasError ? "red" : "black"}`,
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    >
        {flags.files.length ? describe(flags.files) : "Choose a file"}
    </div>
);

const renderPainter = (flags: InteractionFlags<FileInputRenderProps>) => <Painter flags={flags} />;

const Readout = ({ text }: { text: string }) => <output data-readout="files">{text}</output>;

export const Default = () => {
    const filesState = useState<File[]>([]);

    return (
        <>
            <FileInput id="field" filesState={filesState} ariaLabel="Attachment" renderContent={renderPainter} />
            <Readout text={`files: ${describe(filesState[0])}`} />
        </>
    );
};

export const Multiple = () => {
    const filesState = useState<File[]>([]);

    return (
        <FileInput
            id="field"
            filesState={filesState}
            isMultiple={true}
            ariaLabel="Attachments"
            renderContent={renderPainter}
        />
    );
};

export const Images = () => {
    const filesState = useState<File[]>([]);

    return (
        <FileInput
            id="field"
            filesState={filesState}
            accept="image/*"
            ariaLabel="Avatar"
            renderContent={renderPainter}
        />
    );
};

export const RejectingSetter = () => {
    const filesState = useState<File[]>([]);
    const [rejection, setRejection] = useState("");

    return (
        <>
            <FileInput
                id="field"
                filesState={filesState}
                hasError={rejection !== ""}
                ariaLabel="Small attachment"
                renderContent={renderPainter}
                onChange={(files) => {
                    const tooBig = files.filter((file) => file.size > MAX_ATTACHMENT_BYTES);

                    setRejection(tooBig.length ? `${tooBig[0].name} is too big, pick again` : "");

                    if (tooBig.length) filesState[1]([]);
                }}
            />
            <Readout text={rejection || `files: ${describe(filesState[0])}`} />
        </>
    );
};

export const Disabled = ({ isReachable = false }: { isReachable?: boolean }) => {
    const filesState = useState<File[]>([]);

    return (
        <FileInput
            id="field"
            filesState={filesState}
            isDisabled={true}
            isReachableWhenDisabled={isReachable}
            tooltipDefs={isReachable ? TOOLTIP_DEFS : undefined}
            ariaLabel="Locked attachment"
            renderContent={renderPainter}
        />
    );
};

export const DropZone = () => {
    const filesState = useState<File[]>([]);
    const [rejections, setRejections] = useState<FileInputRejection[]>([]);

    return (
        <>
            <FileInput
                id="field"
                filesState={filesState}
                isMultiple={true}
                maxFiles={DROP_ZONE_MAX_FILES}
                maxSizeBytes={DROP_ZONE_MAX_SIZE_BYTES}
                accept="image/*"
                ariaLabel="Gallery images"
                renderContent={renderPainter}
                onChange={() => setRejections([])}
                onReject={setRejections}
            />
            <Readout text={`files: ${describe(filesState[0])}`} />
            <output data-readout="rejections">
                {rejections.map((rejection) => `${rejection.file.name}: ${rejection.reason}`).join(", ") || "none"}
            </output>
        </>
    );
};
