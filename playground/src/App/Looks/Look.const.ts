import { aqua } from "./Variants/Aqua.css";
import { blueprint } from "./Variants/Blueprint.css";
import { brutalist } from "./Variants/Brutalist.css";
import { clay } from "./Variants/Clay.css";
import { glass } from "./Variants/Glass.css";
import { hud } from "./Variants/Hud.css";
import { material } from "./Variants/Material.css";
import { neon } from "./Variants/Neon.css";
import { paper } from "./Variants/Paper.css";
import { pixel } from "./Variants/Pixel.css";
import { plasma } from "./Variants/Plasma.css";
import { plasticine } from "./Variants/Plasticine.css";
import { retroOS } from "./Variants/RetroOS.css";
import { terminal } from "./Variants/Terminal.css";

export const PLAYGROUND_LOOKS = {
    aqua,
    blueprint,
    brutalist,
    clay,
    glass,
    hud,
    material,
    neon,
    paper,
    pixel,
    plasma,
    plasticine,
    retro_os: retroOS,
    terminal,
};

export const DEFAULT_LOOK = "plasticine" satisfies keyof typeof PLAYGROUND_LOOKS;
