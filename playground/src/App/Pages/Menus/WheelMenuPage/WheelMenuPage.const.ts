export const EXAMPLE_NAMES = {
    wheel: "Whole wheel",
    half: "Half wheel",
    concentric: "Concentric bands",
    concentricHalves: "Concentric halves",
    weighted: "A wedge that asks for room",
    flick: "Hold and flick",
    tuned: "Tuned",
};

export const EXAMPLES_ROOT = "/src/App/Pages/Menus/WheelMenuPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/Menus/WheelMenuPage/Docs";

export const FIELD_WIDTH = 110;

export const HALF_TURN_DEGREES = 180;

export const HOLE_RADIUS = 64;

export const BAND_WIDTH = 84;

export const LEVEL_GAP = 8;

export const LAYOUT_SIZE = "368px";

export const NOTHING_RUN = "nothing run yet";

export const DOCS_SECTIONS = {
    submenusBands: {
        title: "Submenus as bands",
        content:
            "Give an item [prop]items[/prop] of its own and its submenu opens as a band round the same center, outside the one that opened it and [prop]levelGap[/prop] away from it. The band is aimed at the wedge that opened it and is only as wide as its own items need, so a short submenu stays short however far out it sits. Over less than a whole turn, a band is shifted to stay inside the spread.",
    },
    wedgeAskingForRoom: {
        title: "A wedge that asks for room",
        content:
            "An item may ask for its own share of the turn with [prop]arcDegrees[/prop], and the items that do not ask share what is left. The wedges follow one another from the same start, so two can never overlap. Here Confirm asks for half the turn.",
    },
    holdFlick: {
        title: "Hold and flick",
        content:
            "With [prop]opensOnHold[/prop] on, pressing the button and holding it down opens the wheel. Move a short way toward a wedge and let go to pick it; come back to the middle before letting go to pick nothing. A plain click still opens the wheel and leaves it open, to be picked from by clicking or with the keyboard.",
    },
};
