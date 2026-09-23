import { FileInput } from "@thewaver/ss-components";

import { PageFileDropZoneContent } from "../../../StyledComponents/FileDropZoneContent/FileDropZoneContent";
import { DROP_ZONE_ACCEPT, DROP_ZONE_MAX_FILES, DROP_ZONE_MAX_SIZE_BYTES } from "../FileInputPage.const";
import type { FileInputDropZoneExampleProps } from "../FileInputPage.types";

type Props = FileInputDropZoneExampleProps;

export const DropZoneExample = (props: Props) => (
    <FileInput
        filesSignal={props.filesSignal}
        isMultiple={true}
        maxFiles={DROP_ZONE_MAX_FILES}
        maxSizeBytes={DROP_ZONE_MAX_SIZE_BYTES}
        accept={DROP_ZONE_ACCEPT}
        ariaLabel={"Gallery images"}
        renderContent={(getRenderProps) => (
            <PageFileDropZoneContent
                renderProps={getRenderProps}
                prompt={getRenderProps().isDragOver ? "Let go to add them" : "Drop images here, or press to choose"}
            />
        )}
        onChange={() => props.onRejectionsChange([])}
        onReject={props.onRejectionsChange}
    />
);
