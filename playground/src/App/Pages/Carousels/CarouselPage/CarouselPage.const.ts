export const EXAMPLE_NAMES = {
    manual: "Stepped by hand",
    rotating: "Rotating on its own",
    scrolled: "Driven by a scroll",
    noControls: "No controls at all",
    windowed: "A hundred slides, only the near ones built",
    pairs: "Two to a stop",
};

export const WINDOWED_SLIDE_COUNT = 100;

export const EXAMPLES_ROOT = "/src/App/Pages/Carousels/CarouselPage/Examples";

export const PAIR_SIZE = 2;

export const DOCS_ROOT = "/src/App/Pages/Carousels/CarouselPage/Docs";

export const SLIDE_COUNT = 4;

export const PAIRED_SLIDE_COUNT = 6;

export const DOCS_SECTIONS = {
    looks: {
        title: "Looks",
        content:
            "Where each slide is drawn is decided by [prop]placement[/prop], a rule that is told how far a slide is from the one showing and answers where to put it. The ready-made rules in CarouselPlacementUtils — a strip, a drum, cover flow and the rest — each come with a create function to tune it, and every one follows the orientation. Cover flow and depth wave draw their slides narrower than the box, so they take a [prop]faceRatio[/prop] saying how much of the box a slide's content fills.",
    },
    loopingAndSelfMoving: {
        title: "Looping and moving on its own",
        content:
            "A carousel loops by default: stepping on from the last slide comes round to the first, the short way. Set [prop]isLooping[/prop] to false and it stops at both ends instead. The controller's [prop]getCanStep[/prop] then answers no at an end, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back. Set [prop]autoplayDelayMs[/prop] and the carousel moves to the next slide after each delay; with looping off, it stops for good on the last slide. It holds still while the pointer is over it, while anything inside it has focus, and while the tab is in the background. Whether it is moving is [prop]playback[/prop], which both sides can write, and the controller's [prop]setIsPlaying[/prop] stops and starts it.",
    },
    drivenOutside: {
        title: "Driven from outside",
        content:
            "A [prop]progress[/prop] from 0 to 1 places the carousel anywhere from the first slide to the last, and the slide showing follows whichever is nearest. Here the box's scroll writes it, so scrolling moves the slides with it.",
    },
    severalSlidesStop: {
        title: "Several slides to a stop",
        content:
            "Pass [prop]computeGroups[/prop] and the slides are split into groups that rest on screen together, here two at a time. Stepping, the dots and [prop]index[/prop] then count groups, and every placement lays a group out in the room of one slide. It comes with [prop]computeGroupLabel[/prop], which names each group when the carousel announces it.",
    },
    onlyNearbySlidesBuilt: {
        title: "Only the nearby slides built",
        content:
            "Set [prop]isWindowed[/prop] and a slide is built only while it is close enough for the placement to draw it, so a hundred slides cost what a handful do. A slide that comes back is built again from nothing, losing anything it held, such as text typed into it, which is why it is off by default.",
    },
};
