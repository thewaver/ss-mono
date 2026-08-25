import { FileInput } from "@thewaver/ss-components";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const ImagesExample = (props: Props) => (
    <FileInput
        filesSignal={props.filesSignal}
        accept={"image/*"}
        ariaLabel={"Avatar"}
        renderContent={(getFlags) => <PageFileInputContent flags={getFlags} />}
    />
);
