import { FileInput } from "@thewaver/ss-components-solid";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const MultipleExample = (props: Props) => (
    <FileInput
        files={props.files}
        isMultiple={true}
        ariaLabel={"Attachments"}
        renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
    />
);
