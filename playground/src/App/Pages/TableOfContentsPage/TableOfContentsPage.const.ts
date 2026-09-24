import type { TableOfContentsSection } from "./TableOfContentsPage.types";

export const TOC_GAP = 5;

export const HEADING_LEVEL = 3;

export const SECTIONS: TableOfContentsSection[] = [
    {
        id: "tocPlanting",
        title: "Planting",
        text: "Set the tubers a hand apart in a trench a spade deep, eyes upwards, and cover them loosely. Nothing shows for weeks, which is the part everybody finds hardest.",
    },
    {
        id: "tocEarthingUp",
        title: "Earthing up",
        text: "When the shoots are a hand tall, draw soil up around them until only the tips show. It keeps light off the tubers, which would otherwise turn green, and it gives the plant room to make more of them.",
    },
    {
        id: "tocWatering",
        title: "Watering",
        text: "Little and often does less good than a soaking once a week. The tubers swell when the flowers open, and a dry spell then costs more of the crop than one at any other time.",
    },
    {
        id: "tocHarvest",
        title: "Harvest",
        text: "Early varieties are ready when the flowers open; later ones when the leaves yellow and die back. Lift them with a fork from well outside the row, so the prongs miss the crop.",
    },
    {
        id: "tocStorage",
        title: "Storage",
        text: "Let them dry on the surface for an afternoon, brush the soil off, and keep them somewhere cool, dark and airy. Anything bruised is eaten first rather than stored.",
    },
];

export const OUTLINE_SECTIONS: TableOfContentsSection[] = [
    {
        id: "outlineSoil",
        title: "Soil",
        text: "Everything after this depends on what the roots are sitting in, so it comes first and it takes the longest.",
    },
    {
        id: "outlineTesting",
        title: "Testing",
        depth: 1,
        text: "A kit from the garden center says how acid the ground is. Potatoes like it slightly sour, which is also what keeps scab away.",
    },
    {
        id: "outlineFeeding",
        title: "Feeding",
        depth: 1,
        text: "Dig in well-rotted manure in the autumn rather than the spring, so it has broken down by the time anything needs it.",
    },
    {
        id: "outlineSeed",
        title: "Seed potatoes",
        text: "Buy certified seed rather than replanting last year's crop, which carries whatever disease last year had.",
    },
    {
        id: "outlineChitting",
        title: "Chitting",
        depth: 1,
        text: "Stand them in egg boxes in a light, frost-free room for six weeks, eyes up, until each has a few short green shoots.",
    },
];
