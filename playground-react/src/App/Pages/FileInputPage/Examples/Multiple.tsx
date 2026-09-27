import { FileInput } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const MultipleExample = (props: Props) => (
    <FileInput
        filesState={props.filesState}
        isMultiple={true}
        ariaLabel={"Attachments"}
        renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
    />
);
