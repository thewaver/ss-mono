import type { ReactNode } from "react";

import type { BasePageDocsExampleProps } from "@thewaver/ss-playground/App/PageComponents/DocsExample/DocsExample.types";

export type PageDocsExampleProps = BasePageDocsExampleProps & {
    renderKnobs?: () => ReactNode;
};
