// Simplified standalone typings for lodash merge function
declare module 'lodash.merge' {
  interface LodashMerge {
    <T, T2>(destination: T, source: T2): T & T2;
    <T, T2, T3>(destination: T, source: T2, source2: T3): T & T2 & T3;
  }
  const merge: LodashMerge;
  export = merge;
}
