/**
 * La geometria del palco, in un posto solo.
 *
 * Il palco comincia dove finisce la linea del tempo: le due misure qui
 * sotto devono combaciare con la larghezza di `HistoryIntroPanel`
 * (38% su tablet, 32% da desktop) e di `HistoryTimeline` (3rem / 13rem).
 * Sono l'unica cosa che i tre componenti della scena devono condividere,
 * e stanno qui perché cambiarle in un file solo è meno fragile che
 * inseguirle in tre.
 *
 * `PALCO` sborda a destra: le fotografie escono dal viewport invece di
 * finirci dentro, ed è quello che le fa leggere come una scena e non
 * come un carosello. `PALCO_PIENO` si ferma al bordo, e serve a chi deve
 * restare centrato su quello che si vede davvero — il finale.
 */

const SINISTRA = "left-[calc(38%+3rem)] lg:left-[calc(32%+13rem)]";

export const PALCO = `absolute inset-y-0 ${SINISTRA} right-[-12%] lg:right-[-8%]`;

export const PALCO_PIENO = `absolute inset-y-0 ${SINISTRA} right-0`;
