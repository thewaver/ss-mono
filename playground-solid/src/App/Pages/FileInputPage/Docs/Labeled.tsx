import { createSignal } from "solid-js";

import { FileInput, Label } from "@thewaver/ss-components-solid";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const filesSignal = createSignal<File[]>([]);

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Contract</PageLabelCaption>

            <FileInput
                files={filesSignal}
                renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
            />
        </Label>
    );
};
