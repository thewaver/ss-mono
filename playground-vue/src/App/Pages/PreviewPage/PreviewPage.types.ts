export type PreviewExampleProps = {
    "expanded"?: boolean;
    "onUpdate:expanded"?: (isExpanded: boolean) => void;
    "collapsedHeight": number;
    "isScrolledIntoViewOnCollapse"?: boolean;
    "paragraphs": string[];
};
