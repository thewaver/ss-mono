import { material } from "./Variants/Material.css";
import { plasticine } from "./Variants/Plasticine.css";
import { retroOS } from "./Variants/RetroOS.css";
import { terminal } from "./Variants/Terminal.css";
import { _acrylic } from "./Variants/_Acrylic.css";
import { _beveled } from "./Variants/_Beveled.css";
import { _clear } from "./Variants/_Clear.css";
import { _gemstone } from "./Variants/_Gemstone.css";
import { _glossy } from "./Variants/_Glossy.css";
import { _hardCandy } from "./Variants/_HardCandy.css";
import { _hollow } from "./Variants/_Hollow.css";
import { _matte } from "./Variants/_Matte.css";
import { _minimal } from "./Variants/_Minimal.css";
import { _neon } from "./Variants/_Neon.css";
import { _plastic } from "./Variants/_Plastic.css";
import { _retro } from "./Variants/_Retro.css";
import { _shaded } from "./Variants/_Shaded.css";
import { _softCandy } from "./Variants/_SoftCandy.css";

export const PLAYGROUND_SKINS = {
    material,
    plasticine,
    retroOS,
    terminal,
    _acrylic,
    _beveled,
    _clear,
    _gemstone,
    _glossy,
    _hardCandy,
    _hollow,
    _matte,
    _minimal,
    _neon,
    _plastic,
    _retro,
    _shaded,
    _softCandy,
};

export const DEFAULT_SKIN: keyof typeof PLAYGROUND_SKINS = "plasticine";
