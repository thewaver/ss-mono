import { FileInput } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const ErroredExample = (props: Props) => (
    <FileInput
        filesState={props.filesState}
        hasError={props.filesState[0].length < 1}
        ariaLabel={"Required attachment"}
        renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
    />
);
