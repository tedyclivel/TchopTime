// global.d.ts

/**
 * Variable globale injectée par le plugin Babel de react-native-reanimated.
 * Indique si on est dans un contexte worklet (UI thread).
 */
declare const _WORKLET: boolean;

/**
 * Timestamp du frame courant dans un worklet.
 */
declare const _FRAME_TIMESTAMP: number;

/**
 * Timestamp de l'événement courant dans un worklet.
 */
declare const _eventTimestamp: number;
