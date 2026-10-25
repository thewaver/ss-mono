import { useState } from "react";

import { FileInput } from "@thewaver/ss-components-react";
import type { FileInputRejection } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    DROP_ZONE_ACCEPT,
    DROP_ZONE_MAX_FILES,
    DROP_ZONE_MAX_SIZE_BYTES,
    DROP_ZONE_REASON_TEXT,
} from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import { PageFileDropZoneContent } from "../../../StyledComponents/FileDropZoneContent/FileDropZoneContent";

export const DropZoneDocsExample = () => {
    const filesState = useState<File[]>([]);

    const [rejections, setRejections] = useState<FileInputRejection[]>([]);

    return (
        <>
            <FileInput
                files={filesState}
                isMultiple={true}
                maxFiles={DROP_ZONE_MAX_FILES}
                maxSizeBytes={DROP_ZONE_MAX_SIZE_BYTES}
                accept={DROP_ZONE_ACCEPT}
                ariaLabel={"Gallery images"}
                renderContent={(renderProps) => (
                    <PageFileDropZoneContent
                        renderProps={renderProps}
                        prompt={renderProps.isDragOver ? "Let go to add them" : "Drop images here, or press to choose"}
                    />
                )}
                onChange={() => setRejections([])}
                onReject={setRejections}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Refused: ${
                    rejections
                        .map((rejection) => `${rejection.file.name}, ${DROP_ZONE_REASON_TEXT[rejection.reason]}`)
                        .join("; ") || "nothing"
                }`}
            </div>
        </>
    );
};
