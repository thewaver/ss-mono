import { createSignal } from "solid-js";

import { FileInput } from "@thewaver/ss-components-solid";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputBasicDocsExampleProps } from "../FileInputPageSolid.types";

type Props = FileInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const filesSignal = createSignal<File[]>([]);

    return (
        <FileInput
            files={filesSignal}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Attachment"}
            renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
        />
    );
};
