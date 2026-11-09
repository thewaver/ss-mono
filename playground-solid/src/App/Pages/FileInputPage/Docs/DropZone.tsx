import { createSignal } from "solid-js";

import { FileInput } from "@thewaver/ss-components-solid";
import type { FileInputRejection } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    DROP_ZONE_ACCEPT,
    DROP_ZONE_MAX_FILES,
    DROP_ZONE_MAX_SIZE_BYTES,
    DROP_ZONE_REASON_TEXT,
} from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import { PageFileDropZoneContent } from "../../../StyledComponents/FileDropZoneContent/FileDropZoneContent";
import type { FileInputDropZoneDocsExampleProps } from "../FileInputPageSolid.types";

type Props = FileInputDropZoneDocsExampleProps;

export const DropZoneDocsExample = (props: Props) => {
    const filesSignal = createSignal<File[]>([]);

    const [getRejections, setRejections] = createSignal<FileInputRejection[]>([]);

    return (
        <>
            <FileInput
                files={filesSignal}
                hasError={props.hasError}
                isDisabled={props.isDisabled}
                isMultiple={true}
                maxFiles={DROP_ZONE_MAX_FILES}
                maxSizeBytes={DROP_ZONE_MAX_SIZE_BYTES}
                accept={DROP_ZONE_ACCEPT}
                ariaLabel={"Gallery images"}
                renderContent={(getRenderProps) => (
                    <PageFileDropZoneContent
                        renderProps={getRenderProps}
                        prompt={
                            getRenderProps().isDragOver ? "Let go to add them" : "Drop images here, or press to choose"
                        }
                    />
                )}
                onChange={() => setRejections([])}
                onReject={setRejections}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Refused: ${
                    getRejections()
                        .map((rejection) => `${rejection.file.name}, ${DROP_ZONE_REASON_TEXT[rejection.reason]}`)
                        .join("; ") || "nothing"
                }`}
            </div>
        </>
    );
};
