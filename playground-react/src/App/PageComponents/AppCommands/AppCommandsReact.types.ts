export type AppCommandsProps = {
    pageNames: string[];
    onGoToAbout: () => void;
    onGoToPage: (pageName: string) => void;
    onExpandAll: () => void;
    onCollapseAll: () => void;
};
