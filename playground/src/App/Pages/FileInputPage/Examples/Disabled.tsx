import { FileInput } from "@thewaver/ss-components";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const DisabledExample = (props: Props) => (
    <FileInput
        filesSignal={props.filesSignal}
        isDisabled={true}
        ariaLabel={"Disabled attachment"}
        renderContent={(getFlags) => <PageFileInputContent flags={getFlags} />}
    />
);
