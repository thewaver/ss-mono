export const FILLER_NAMES = ["Alder", "Birch", "Cedar", "Elm", "Hazel", "Larch", "Maple", "Rowan", "Willow", "Yew"];

export const FILLER_COUNT = 60;

export const EXAMPLES_ROOT = "/src/App/Pages/DrawerPage/Examples";

export const FILLERS = Array.from(
    { length: FILLER_COUNT },
    (_, index) => `${FILLER_NAMES[index % FILLER_NAMES.length]} ${index + 1}`,
);

export const DOCS_ROOT = "/src/App/Pages/DrawerPage/Docs";

export const FIELD_WIDTH = 110;

export const DOCS_SECTIONS = {
    swipingAway: {
        title: "Swiping it away",
        content:
            'Swipe a drawer back toward its edge, more than a third of the way across it, and letting go closes it; short of that it springs back. Under a finger, a swipe over content that has been scrolled scrolls it back instead. A swipe is a drag, and a drag needs a single-pointer way to do the same thing ([wcag id="2.5.7"]WCAG 2.5.7[/wcag]), which here is the press on the overlay. So the two share one switch: turning off [prop]isDismissableOnOverlayClick[/prop] turns the swipe off with it.',
    },
};
