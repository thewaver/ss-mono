import { material } from "./Variants/Material.css";
import { plasticine } from "./Variants/Plasticine.css";
import { retroOS } from "./Variants/RetroOS.css";
import { terminal } from "./Variants/Terminal.css";

export const PLAYGROUND_LOOKS = {
    material,
    plasticine,
    retroOS,
    terminal,
};

export const DEFAULT_LOOK: keyof typeof PLAYGROUND_LOOKS = "plasticine";
