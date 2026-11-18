import type { TourStep } from "./SpotlightTour.types";

export const TOUR_STORAGE_KEY = "playground.spotlightTour.step";

export const RICH_TOUR_STEPS: TourStep[] = [
    { title: "The shelf", text: "Everything for sale sits here, one potato at a time." },
    {
        title: "Add to the basket",
        text: "This step is yours to do. Press Try, then press Add to basket, and the tour carries on by itself.",
        isWaitingForUser: true,
    },
    { title: "The basket", text: "What you added lands here, with a count beside it." },
    { title: "Checkout", text: "When you are ready, this is where you would pay." },
];

export const DOCS_ROOT = "/src/App/Pages/Spotlights/SpotlightGuidePage/Docs";

export const DOCS_SECTIONS = {
    tourStepReaderDoes: {
        title: "A tour with a step the reader does",
        content:
            "A guide seals the whole page, so the element it lights cannot be pressed. For a step the reader is to do, open a SpotlightPrompt over the guide: the guide fades but stays open while the prompt lights the one control, and using the control brings the guide back on the next step. Escape on the prompt brings the guide back on the same step. Escape on the guide closes it, and the tour pauses where it was. The example also keeps the step in sessionStorage, so a reload offers to resume there.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "The popup takes the direction of the element it lights, so inside a box whose text runs right to left, the popup's text and buttons run from the right too. The hole and the overlay are not text, and stay as they are.",
    },
};
