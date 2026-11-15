import { acrylic } from "./Variants/Acrylic.css";
import { blocky } from "./Variants/Blocky.css";
import { cartoon } from "./Variants/Cartoon.css";
import { flat } from "./Variants/Flat.css";
import { glossy } from "./Variants/Glossy.css";
import { shaded } from "./Variants/Shaded.css";
import { tek } from "./Variants/Tek.css";
import { terminal } from "./Variants/Terminal.css";
import { xenon } from "./Variants/Xenon.css";

export const PLAYGROUND_SKINS = {
    acrylic,
    blocky,
    cartoon,
    flat,
    glossy,
    shaded,
    terminal,
    tek,
    xenon,
};

export const DEFAULT_SKIN: keyof typeof PLAYGROUND_SKINS = "shaded";
