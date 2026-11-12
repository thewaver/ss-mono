import { acrylic } from "./Variants/Acrylic.css";
import { blocky } from "./Variants/Blocky.css";
import { cartoon } from "./Variants/Cartoon.css";
import { flat } from "./Variants/Flat.css";
import { shaded } from "./Variants/Shaded.css";
import { terminal } from "./Variants/Terminal.css";
import { xenon } from "./Variants/Xenon.css";

export const PLAYGROUND_SKINS = {
    acrylic,
    blocky,
    cartoon,
    flat,
    shaded,
    terminal,
    xenon,
};

export const DEFAULT_SKIN: keyof typeof PLAYGROUND_SKINS = "shaded";
