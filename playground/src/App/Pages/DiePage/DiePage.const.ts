import type { DieShapes } from "@thewaver/ss-components";

export const ICON_CLOUD_ICONS = [
    { icon: "🍎", label: "Apple" },
    { icon: "🍋", label: "Lemon" },
    { icon: "🍇", label: "Grapes" },
    { icon: "🍉", label: "Watermelon" },
    { icon: "🍒", label: "Cherries" },
    { icon: "🍓", label: "Strawberry" },
    { icon: "🥝", label: "Kiwi" },
    { icon: "🍍", label: "Pineapple" },
    { icon: "🥕", label: "Carrot" },
    { icon: "🌽", label: "Corn" },
    { icon: "🍄", label: "Mushroom" },
    { icon: "🌵", label: "Cactus" },
    { icon: "🌻", label: "Sunflower" },
    { icon: "🌙", label: "Moon" },
    { icon: "⭐", label: "Star" },
    { icon: "☀️", label: "Sun" },
    { icon: "🌈", label: "Rainbow" },
    { icon: "⚡", label: "Lightning" },
    { icon: "🔥", label: "Fire" },
    { icon: "💧", label: "Droplet" },
    { icon: "❄️", label: "Snowflake" },
    { icon: "🎈", label: "Balloon" },
    { icon: "🎲", label: "Die" },
    { icon: "🚀", label: "Rocket" },
];

export const ICON_CLOUD_EMPTY_LABEL = "Empty";

export const ICON_CLOUD_TURN_MS = 24000;

export const ICON_CLOUD_STEPS = [
    { direction: "left" as const, id: "dieCloudLeft", label: "Spin left" },
    { direction: "up" as const, id: "dieCloudUp", label: "Spin up" },
    { direction: "down" as const, id: "dieCloudDown", label: "Spin down" },
    { direction: "right" as const, id: "dieCloudRight", label: "Spin right" },
];

export const PLANET_ICONS = [
    { icon: "🛰️", label: "Satellite" },
    { icon: "🌙", label: "Moon" },
    { icon: "☄️", label: "Comet" },
    { icon: "🚀", label: "Rocket" },
    { icon: "⭐", label: "Star" },
    { icon: "🛸", label: "Flying saucer" },
    { icon: "👽", label: "Alien" },
    { icon: "🌟", label: "Glowing star" },
    { icon: "💫", label: "Dizzy star" },
    { icon: "🔭", label: "Telescope" },
    { icon: "🧑‍🚀", label: "Astronaut" },
    { icon: "🌠", label: "Shooting star" },
];

export const PLANET_SHAPE_KEY: DieShapes.SampleKey = "d12";

export const PLANET_STEPS = [
    { direction: "left" as const, id: "diePlanetLeft", label: "Spin left" },
    { direction: "up" as const, id: "diePlanetUp", label: "Spin up" },
    { direction: "down" as const, id: "diePlanetDown", label: "Spin down" },
    { direction: "right" as const, id: "diePlanetRight", label: "Spin right" },
];

export const EXAMPLE_NAMES = {
    tabletop: "Tabletop die",
    iconCloud: "Icon cloud",
    planet: "Planet",
};

export const EXAMPLES_ROOT = "/src/App/Pages/DiePage/Examples";

export const DIE_SIZE = 160;

export const CLOUD_SIZE = 240;

export const NO_MOTION_DURATION_MS = 0;

export const FIRST_NUMBER = 1;
