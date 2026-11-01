import type { Point2d } from "@thewaver/ss-utils";

import type { ParticleTravelDefs } from "../../../Exotics/Particles/ParticleSpawner/ParticleSpawner.types";

export type ParticleTravelPathType = "line" | "arc" | "wave" | "spiral" | "orbit" | "bezier" | "zigzag" | "scatter";

export type ParticleTravelPathFn = (defs: ParticleTravelDefs, t: number) => Point2d;

export type ParticleTravelPathFactory = (opts: Record<string, number>) => ParticleTravelPathFn;
