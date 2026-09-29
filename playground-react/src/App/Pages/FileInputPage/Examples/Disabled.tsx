import { FileInput } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const DisabledExample = (props: Props) => (
    <FileInput
        files={props.files}
        isDisabled={true}
        ariaLabel={"Disabled attachment"}
        renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
    />
);
