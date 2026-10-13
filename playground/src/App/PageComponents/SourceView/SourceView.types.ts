export type SourceFile = {
    name: string;
    source: string;
};

export type SourceGroup = {
    name: string;
    files: SourceFile[];
    expandedNames: string[];
};

export type BaseSourceViewValues = {
    path: string;
};

export type BaseSourceViewProps = BaseSourceViewValues;
