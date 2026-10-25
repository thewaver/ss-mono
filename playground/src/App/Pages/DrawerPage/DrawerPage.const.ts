export const FILLER_NAMES = ["Alder", "Birch", "Cedar", "Elm", "Hazel", "Larch", "Maple", "Rowan", "Willow", "Yew"];

export const FILLER_COUNT = 60;

export const EXAMPLES_ROOT = "/src/App/Pages/DrawerPage/Examples";

export const FILLERS = Array.from(
    { length: FILLER_COUNT },
    (_, index) => `${FILLER_NAMES[index % FILLER_NAMES.length]} ${index + 1}`,
);

export const DOCS_ROOT = "/src/App/Pages/DrawerPage/Docs";

export const FIELD_WIDTH = 110;
