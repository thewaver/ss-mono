import { FileInput, Label } from "@thewaver/ss-components";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { FileInputExampleProps } from "../FileInputPage.types";

const LABEL_GAP = 5;

type Props = FileInputExampleProps;

export const LabelledExample = (props: Props) => (
    <Label dir={"column"} gap={() => LABEL_GAP}>
        <PageLabelCaption>Contract</PageLabelCaption>

        <FileInput
            filesSignal={props.filesSignal}
            renderContent={(getFlags) => <PageFileInputContent flags={getFlags} />}
        />
    </Label>
);
