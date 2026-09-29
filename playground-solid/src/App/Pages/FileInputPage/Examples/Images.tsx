import { FileInput } from "@thewaver/ss-components-solid";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const ImagesExample = (props: Props) => (
    <FileInput
        files={props.files}
        accept={"image/*"}
        ariaLabel={"Avatar"}
        renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
    />
);
