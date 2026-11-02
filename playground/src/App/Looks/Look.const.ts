import { aqua } from "./Variants/Aqua.css";
import { brutalist } from "./Variants/Brutalist.css";
import { clay } from "./Variants/Clay.css";
import { glass } from "./Variants/Glass.css";
import { hud } from "./Variants/Hud.css";
import { material } from "./Variants/Material.css";
import { neon } from "./Variants/Neon.css";
import { pixel } from "./Variants/Pixel.css";
import { plasma } from "./Variants/Plasma.css";
import { plasticine } from "./Variants/Plasticine.css";
import { retroOS } from "./Variants/RetroOS.css";
import { terminal } from "./Variants/Terminal.css";

export const PLAYGROUND_LOOKS = {
    aqua,
    brutalist,
    clay,
    glass,
    hud,
    material,
    neon,
    pixel,
    plasma,
    plasticine,
    retroOS,
    terminal,
};

export const DEFAULT_LOOK = "plasticine" satisfies keyof typeof PLAYGROUND_LOOKS;
