export type PreviewExampleProps = {
    expandedState?: readonly [boolean, (isExpanded: boolean) => void];
    collapsedHeight: number;
    isScrolledIntoViewOnCollapse?: boolean;
    paragraphs: string[];
};
