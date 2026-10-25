import { useState } from "react";

import { FileInput, Label } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const filesState = useState<File[]>([]);

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Contract</PageLabelCaption>

            <FileInput
                files={filesState}
                renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
            />
        </Label>
    );
};
