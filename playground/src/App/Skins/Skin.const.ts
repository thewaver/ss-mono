import { acrylic } from "./Variants/Acrylic.css";
import { blocky } from "./Variants/Blocky.css";
import { cardboard } from "./Variants/Cardboard.css";
import { cartoon } from "./Variants/Cartoon.css";
import { neon } from "./Variants/Neon.css";
import { plasticine } from "./Variants/Plasticine.css";
import { terminal } from "./Variants/Terminal.css";

export const PLAYGROUND_SKINS = {
    acrylic,
    blocky,
    cartoon,
    cardboard,
    neon,
    plasticine,
    terminal,
};

export const DEFAULT_SKIN: keyof typeof PLAYGROUND_SKINS = "plasticine";
