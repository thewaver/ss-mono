import { FileInput } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const DefaultExample = (props: Props) => (
    <FileInput
        filesState={props.filesState}
        ariaLabel={"Attachment"}
        renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
    />
);
