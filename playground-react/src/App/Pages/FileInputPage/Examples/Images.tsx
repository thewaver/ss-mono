import { FileInput } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const ImagesExample = (props: Props) => (
    <FileInput
        files={props.files}
        accept={"image/*"}
        ariaLabel={"Avatar"}
        renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
    />
);
