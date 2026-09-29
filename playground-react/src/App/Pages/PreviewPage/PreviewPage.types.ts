export type PreviewExampleProps = {
    expanded?: readonly [boolean, (isExpanded: boolean) => void];
    collapsedHeight: number;
    isScrolledIntoViewOnCollapse?: boolean;
    paragraphs: string[];
};
