import { FileInput } from "@thewaver/ss-components-react";
import {
    DROP_ZONE_ACCEPT,
    DROP_ZONE_MAX_FILES,
    DROP_ZONE_MAX_SIZE_BYTES,
} from "@thewaver/ss-playground-core/App/Pages/FileInputPage/FileInputPage.const";

import { PageFileDropZoneContent } from "../../../StyledComponents/FileDropZoneContent/FileDropZoneContent";
import type { FileInputDropZoneExampleProps } from "../FileInputPage.types";

type Props = FileInputDropZoneExampleProps;

export const DropZoneExample = (props: Props) => (
    <FileInput
        filesState={props.filesState}
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
        onChange={() => props.onRejectionsChange([])}
        onReject={props.onRejectionsChange}
    />
);
