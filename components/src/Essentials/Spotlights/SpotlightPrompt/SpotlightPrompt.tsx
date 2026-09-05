import { Spotlight } from "../../../Primitives/Spotlight/Spotlight";
import type { SpotlightPromptProps } from "../../../Primitives/Spotlight/Spotlight.types";

export const SpotlightPrompt = (props: SpotlightPromptProps) => <Spotlight {...props} mode={"prompt"} />;
