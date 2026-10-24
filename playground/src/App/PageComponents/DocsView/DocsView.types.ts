export type DocsTableOfContentsEntry = {
    id: string;
    title: string;
    depth: number;
};

export type DocsSectionRegistration = {
    title: string;
    element: HTMLElement;
};

export type BasePageDocsViewValues = {
    description: string;
};

export type BasePageDocsViewProps = BasePageDocsViewValues;
