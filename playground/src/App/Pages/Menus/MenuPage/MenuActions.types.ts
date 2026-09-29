export type Action = {
    name: string;
    shortcut?: string;
};

export type Destination = {
    name: string;
    path: string[];
    isLeaf: boolean;
};
