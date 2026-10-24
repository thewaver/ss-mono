import type { Component } from "vue";

import type { BasePageDocsViewProps } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

export type DocsRouteProps = BasePageDocsViewProps & {
    docs?: () => Promise<{ default: Component }>;
};
