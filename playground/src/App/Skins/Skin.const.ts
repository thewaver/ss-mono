import { blocky } from "./Variants/Blocky.css";
import { cardboard } from "./Variants/Cardboard.css";
import { cartoon } from "./Variants/Cartoon.css";
import { plasticine } from "./Variants/Plasticine.css";
import { terminal } from "./Variants/Terminal.css";
import { _acrylic } from "./Variants/_Acrylic.css";
import { _beveled } from "./Variants/_Beveled.css";
import { _clear } from "./Variants/_Clear.css";
import { _gemstone } from "./Variants/_Gemstone.css";
import { _glossy } from "./Variants/_Glossy.css";
import { _hardCandy } from "./Variants/_HardCandy.css";
import { _matte } from "./Variants/_Matte.css";
import { _neon } from "./Variants/_Neon.css";
import { _plastic } from "./Variants/_Plastic.css";
import { _shaded } from "./Variants/_Shaded.css";

export const PLAYGROUND_SKINS = {
    blocky,
    cartoon,
    cardboard,
    plasticine,
    terminal,
    _acrylic,
    _beveled,
    _clear,
    _gemstone,
    _glossy,
    _hardCandy,
    _matte,
    _neon,
    _plastic,
    _shaded,
};

export const DEFAULT_SKIN: keyof typeof PLAYGROUND_SKINS = "terminal";
