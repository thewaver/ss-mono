import { FileInput } from "@thewaver/ss-components-solid";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const ErroredExample = (props: Props) => (
    <FileInput
        files={props.files}
        hasError={() => props.files[0]().length < 1}
        ariaLabel={"Required attachment"}
        renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
    />
);
