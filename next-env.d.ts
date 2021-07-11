/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "@standards/duration" {
  export function createCustom(
    a: number,
    b: string,
    c: { unit: string }
  ): (d: string) => number {}
}
