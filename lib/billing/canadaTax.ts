export type ProvinceCode =
    | "ON"
    | "NS"
    | "NL"
    | "PE"
    | "NB"
    | "BC"
    | "AB"
    | "MB"
    | "SK"
    | "QC"
    | "NT"
    | "NU"
    | "YT";

export function getCanadaTaxRate(province?: ProvinceCode) {
    if (!province) return 0;

    if (["NS", "NL", "PE", "NB"].includes(province)) return 0.15;
    if (province === "ON") return 0.13;

    return 0.05; // GST-only provinces
}
