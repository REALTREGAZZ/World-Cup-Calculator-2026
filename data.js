// data.js - Base de datos completa del Mundial 2026

// 1. Base de datos de todos los equipos (48 equipos confirmados + playoff teams)
const teams = {
    // Hosts
    "MEX": { name: "México", code: "MEX", rating: 79, flag: "flags/MEX.png", confederation: "CONCACAF" },
    "CAN": { name: "Canadá", code: "CAN", rating: 78, flag: "flags/CAN.png", confederation: "CONCACAF" },
    "USA": { name: "Estados Unidos", code: "USA", rating: 81, flag: "flags/USA.png", confederation: "CONCACAF" },

    // CONMEBOL
    "BRA": { name: "Brasil", code: "BRA", rating: 90, flag: "flags/BRA.png", confederation: "CONMEBOL" },
    "ARG": { name: "Argentina", code: "ARG", rating: 92, flag: "flags/ARG.png", confederation: "CONMEBOL" },
    "URU": { name: "Uruguay", code: "URU", rating: 82, flag: "flags/URU.png", confederation: "CONMEBOL" },
    "COL": { name: "Colombia", code: "COL", rating: 81, flag: "flags/COL.png", confederation: "CONMEBOL" },
    "ECU": { name: "Ecuador", code: "ECU", rating: 78, flag: "flags/ECU.png", confederation: "CONMEBOL" },
    "PAR": { name: "Paraguay", code: "PAR", rating: 74, flag: "flags/PAR.png", confederation: "CONMEBOL" },

    // UEFA - Direct Qualifiers
    "ENG": { name: "Inglaterra", code: "ENG", rating: 89, flag: "flags/ENG.png", confederation: "UEFA" },
    "FRA": { name: "Francia", code: "FRA", rating: 91, flag: "flags/FRA.png", confederation: "UEFA" },
    "ESP": { name: "España", code: "ESP", rating: 88, flag: "flags/ESP.png", confederation: "UEFA" },
    "POR": { name: "Portugal", code: "POR", rating: 87, flag: "flags/POR.png", confederation: "UEFA" },
    "NED": { name: "Holanda", code: "NED", rating: 86, flag: "flags/NED.png", confederation: "UEFA" },
    "BEL": { name: "Bélgica", code: "BEL", rating: 84, flag: "flags/BEL.png", confederation: "UEFA" },
    "GER": { name: "Alemania", code: "GER", rating: 87, flag: "flags/GER.png", confederation: "UEFA" },
    "SUI": { name: "Suiza", code: "SUI", rating: 80, flag: "flags/SUI.png", confederation: "UEFA" },
    "CRO": { name: "Croacia", code: "CRO", rating: 83, flag: "flags/CRO.png", confederation: "UEFA" },
    "AUT": { name: "Austria", code: "AUT", rating: 78, flag: "flags/AUT.png", confederation: "UEFA" },
    "SCO": { name: "Escocia", code: "SCO", rating: 74, flag: "flags/SCO.png", confederation: "UEFA" },
    "NOR": { name: "Noruega", code: "NOR", rating: 77, flag: "flags/NOR.png", confederation: "UEFA" },

    // UEFA Playoffs
    "DEN": { name: "Dinamarca", code: "DEN", rating: 81, flag: "flags/DEN.png", confederation: "UEFA", playoff: "UEFA_D" },
    "CZE": { name: "R. Checa", code: "CZE", rating: 75, flag: "flags/CZE.png", confederation: "UEFA", playoff: "UEFA_D" },
    "MKD": { name: "Macedonia", code: "MKD", rating: 70, flag: "flags/MKD.png", confederation: "UEFA", playoff: "UEFA_D" },
    "IRL": { name: "Irlanda", code: "IRL", rating: 71, flag: "flags/IRL.png", confederation: "UEFA", playoff: "UEFA_D" },

    "ITA": { name: "Italia", code: "ITA", rating: 85, flag: "flags/ITA.png", confederation: "UEFA", playoff: "UEFA_A" },
    "WAL": { name: "Gales", code: "WAL", rating: 74, flag: "flags/WAL.png", confederation: "UEFA", playoff: "UEFA_A" },
    "BIH": { name: "Bosnia", code: "BIH", rating: 72, flag: "flags/BIH.png", confederation: "UEFA", playoff: "UEFA_A" },
    "NIR": { name: "Irlanda del Norte", code: "NIR", rating: 70, flag: "flags/NIR.png", confederation: "UEFA", playoff: "UEFA_A" },

    "TUR": { name: "Turquía", code: "TUR", rating: 77, flag: "flags/TUR.png", confederation: "UEFA", playoff: "UEFA_C" },
    "ROU": { name: "Rumanía", code: "ROU", rating: 73, flag: "flags/ROU.png", confederation: "UEFA", playoff: "UEFA_C" },
    "SVK": { name: "Eslovaquia", code: "SVK", rating: 72, flag: "flags/SVK.png", confederation: "UEFA", playoff: "UEFA_C" },
    "KOS": { name: "Kosovo", code: "KOS", rating: 68, flag: "flags/KOS.png", confederation: "UEFA", playoff: "UEFA_C" },

    "UKR": { name: "Ucrania", code: "UKR", rating: 77, flag: "flags/UKR.png", confederation: "UEFA", playoff: "UEFA_B" },
    "SWE": { name: "Suecia", code: "SWE", rating: 75, flag: "flags/SWE.png", confederation: "UEFA", playoff: "UEFA_B" },
    "POL": { name: "Polonia", code: "POL", rating: 78, flag: "flags/POL.png", confederation: "UEFA", playoff: "UEFA_B" },
    "ALB": { name: "Albania", code: "ALB", rating: 69, flag: "flags/ALB.png", confederation: "UEFA", playoff: "UEFA_B" },

    // AFC
    "JPN": { name: "Japón", code: "JPN", rating: 80, flag: "flags/JPN.png", confederation: "AFC" },
    "KOR": { name: "Corea del Sur", code: "KOR", rating: 79, flag: "flags/KOR.png", confederation: "AFC" },
    "AUS": { name: "Australia", code: "AUS", rating: 76, flag: "flags/AUS.png", confederation: "AFC" },
    "IRN": { name: "Irán", code: "IRN", rating: 78, flag: "flags/IRN.png", confederation: "AFC" },
    "QAT": { name: "Qatar", code: "QAT", rating: 72, flag: "flags/QAT.png", confederation: "AFC" },
    "KSA": { name: "Arabia Saudí", code: "KSA", rating: 74, flag: "flags/KSA.png", confederation: "AFC" },
    "JOR": { name: "Jordania", code: "JOR", rating: 69, flag: "flags/JOR.png", confederation: "AFC" },
    "UZB": { name: "Uzbekistán", code: "UZB", rating: 71, flag: "flags/UZB.png", confederation: "AFC" },

    // CAF
    "MAR": { name: "Marruecos", code: "MAR", rating: 87, flag: "flags/MAR.png", confederation: "CAF" },
    "SEN": { name: "Senegal", code: "SEN", rating: 79, flag: "flags/SEN.png", confederation: "CAF" },
    "EGY": { name: "Egipto", code: "EGY", rating: 77, flag: "flags/EGY.png", confederation: "CAF" },
    "CIV": { name: "Costa de Marfil", code: "CIV", rating: 75, flag: "flags/CIV.png", confederation: "CAF" },
    "ALG": { name: "Argelia", code: "ALG", rating: 76, flag: "flags/ALG.png", confederation: "CAF" },
    "GHA": { name: "Ghana", code: "GHA", rating: 74, flag: "flags/GHA.png", confederation: "CAF" },
    "RSA": { name: "Sudáfrica", code: "RSA", rating: 73, flag: "flags/RSA.png", confederation: "CAF" },
    "CPV": { name: "Cabo Verde", code: "CPV", rating: 71, flag: "flags/CPV.png", confederation: "CAF" },
    "TUN": { name: "Túnez", code: "TUN", rating: 72, flag: "flags/TUN.png", confederation: "CAF" },

    // CONCACAF (beyond hosts)
    "HTI": { name: "Haití", code: "HTI", rating: 68, flag: "flags/HTI.png", confederation: "CONCACAF" },
    "CUW": { name: "Curaçao", code: "CUW", rating: 67, flag: "flags/CUW.png", confederation: "CONCACAF" },
    "PAN": { name: "Panamá", code: "PAN", rating: 72, flag: "flags/PAN.png", confederation: "CONCACAF" },

    // OFC
    "NZL": { name: "Nueva Zelanda", code: "NZL", rating: 70, flag: "flags/NZL.png", confederation: "OFC" },

    // FIFA Playoff Teams
    "IRQ": { name: "Irak", code: "IRQ", rating: 70, flag: "flags/IRQ.png", confederation: "AFC", playoff: "FIFA_B" },
    "BOL": { name: "Bolivia", code: "BOL", rating: 71, flag: "flags/BOL.png", confederation: "CONMEBOL", playoff: "FIFA_B" },
    "SUR": { name: "Surinam", code: "SUR", rating: 67, flag: "flags/SUR.png", confederation: "CONCACAF", playoff: "FIFA_B" },

    "COD": { name: "RD Congo", code: "COD", rating: 70, flag: "flags/COD.png", confederation: "CAF", playoff: "FIFA_A" },
    "JAM": { name: "Jamaica", code: "JAM", rating: 71, flag: "flags/JAM.png", confederation: "CONCACAF", playoff: "FIFA_A" },
    "NCL": { name: "Nueva Caledonia", code: "NCL", rating: 65, flag: "flags/NCL.png", confederation: "OFC", playoff: "FIFA_A" }
};

// 2. Definición de Playoffs
const playoffs = {
    "UEFA_D": ["DEN", "CZE", "MKD", "IRL"],
    "UEFA_A": ["ITA", "WAL", "BIH", "NIR"],
    "UEFA_C": ["TUR", "ROU", "SVK", "KOS"],
    "UEFA_B": ["UKR", "SWE", "POL", "ALB"],
    "FIFA_B": ["IRQ", "BOL", "SUR"],
    "FIFA_A": ["COD", "JAM", "NCL"]
};

// 3. Grupos Oficiales (con placeholders de playoffs)
const initialGroups = {
    "A": { teams: ["MEX", "RSA", "KOR", "UEFA_D"], matches: [], standings: [] },
    "B": { teams: ["CAN", "UEFA_A", "QAT", "SUI"], matches: [], standings: [] },
    "C": { teams: ["BRA", "MAR", "HTI", "SCO"], matches: [], standings: [] },
    "D": { teams: ["USA", "PAR", "AUS", "UEFA_C"], matches: [], standings: [] },
    "E": { teams: ["GER", "CUW", "CIV", "ECU"], matches: [], standings: [] },
    "F": { teams: ["NED", "JPN", "UEFA_B", "TUN"], matches: [], standings: [] },
    "G": { teams: ["BEL", "EGY", "IRN", "NZL"], matches: [], standings: [] },
    "H": { teams: ["ESP", "CPV", "KSA", "URU"], matches: [], standings: [] },
    "I": { teams: ["FRA", "SEN", "FIFA_B", "NOR"], matches: [], standings: [] },
    "J": { teams: ["ARG", "ALG", "AUT", "JOR"], matches: [], standings: [] },
    "K": { teams: ["POR", "FIFA_A", "COL", "UZB"], matches: [], standings: [] },
    "L": { teams: ["ENG", "CRO", "GHA", "PAN"], matches: [], standings: [] }
};

// 4. Estado del torneo (copia mutable)
let groups = JSON.parse(JSON.stringify(initialGroups));

// 5. Estructura de Eliminatorias
const knockoutBracket = {
    r32: [],
    r16: [],
    qf: [],
    sf: [],
    thirdPlace: null,
    final: null
};

// 6. Estadísticas globales
let tournamentStats = {
    totalMatches: 0,
    totalGoals: 0,
    topScorer: { team: null, goals: 0 },
    yellowCards: {},
    playoffWinners: {}
};
