import { FileInput } from "@thewaver/ss-components";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const MultipleExample = (props: Props) => (
    <FileInput
        filesSignal={props.filesSignal}
        isMultiple={true}
        ariaLabel={"Attachments"}
        renderContent={(getFlags) => <PageFileInputContent flags={getFlags} />}
    />
);
