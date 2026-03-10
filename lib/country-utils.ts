/**
 * 🛡️ AFRIDAM GEOGRAPHIC UTILITIES
 * Version: 2026.03.11
 * Focus: ISO 3166-1 alpha-2 Country Code Mapping for AI context.
 */

const COUNTRY_ISO_MAP: Record<string, string> = {
  "Nigeria": "NG",
  "Ghana": "GH",
  "Kenya": "KE",
  "South Africa": "ZA",
  "Ethiopia": "ET",
  "Rwanda": "RW",
  "Uganda": "UG",
  "Egypt": "EG",
  "Morocco": "MA",
  "Cameroon": "CM",
  "Senegal": "SN",
  "Benin": "BJ",
  "Ivory Coast": "CI",
  "Tanzania": "TZ",
  "Algeria": "DZ",
  "Angola": "AO",
  "Botswana": "BW",
  "Zambia": "ZM",
  "Zimbabwe": "ZW",
};

/**
 * 🚀 THE GEOGRAPHIC HANDSHAKE
 * Converts a country name to its 2-character ISO code.
 * Defaults to "NG" (Nigeria) if no match is found, as per system default.
 */
export function getCountryIsoCode(countryName: string | undefined | null): string {
  if (!countryName) return "NG";
  
  // Clean the input: trim and capitalized match
  const cleanName = countryName.trim();
  
  // Direct lookup
  if (COUNTRY_ISO_MAP[cleanName]) {
    return COUNTRY_ISO_MAP[cleanName];
  }

  // Case-insensitive lookup as fallback
  const entry = Object.entries(COUNTRY_ISO_MAP).find(
    ([name]) => name.toLowerCase() === cleanName.toLowerCase()
  );

  return entry ? entry[1] : "NG";
}
