import type { JSX } from "solid-js";

import type { AccessorValues } from "@thewaver/ss-components-solid";
import type { BasePageDocsExampleValues } from "@thewaver/ss-playground/App/PageComponents/DocsExample/DocsExample.types";

export type PageDocsExampleProps = AccessorValues<BasePageDocsExampleValues> & {
    renderKnobs?: () => JSX.Element;
};
