import { FileInput, Label } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { FileInputExampleProps } from "../FileInputPage.types";

const LABEL_GAP = 5;

type Props = FileInputExampleProps;

export const LabeledExample = (props: Props) => (
    <Label orientation={"vertical"} gap={LABEL_GAP}>
        <PageLabelCaption>Contract</PageLabelCaption>

        <FileInput
            files={props.files}
            renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
        />
    </Label>
);
