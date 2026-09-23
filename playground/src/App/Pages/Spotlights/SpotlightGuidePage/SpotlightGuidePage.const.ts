import type { TourStep } from "./SpotlightGuidePage.types";

export const TOUR_STORAGE_KEY = "playground.spotlightTour.step";

export const RICH_TOUR_STEPS: TourStep[] = [
    { title: "The shelf", text: "Everything for sale sits here, one potato at a time." },
    {
        title: "Add to the basket",
        text: "This step is yours to do. Press Try it, then press Add to basket, and the tour carries on by itself.",
        isWaitingForUser: true,
    },
    { title: "The basket", text: "What you added lands here, with a count beside it." },
    { title: "Checkout", text: "When you are ready, this is where you would pay." },
];
