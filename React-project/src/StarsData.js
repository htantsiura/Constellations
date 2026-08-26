export const AllStars = [

  {
    // Basic Identification
    entity: "Star",
    id: "rigel",
    name: "Rigel",
    bayerDesignation: "Beta Orionis",
    flamsteedDesignation: "19 Orionis",
    constellation: {
      name: "Orion",
      iauAbbreviation: "Ori"
    },

    // Astrometry and Position
    astrometry: {
      equatorialCoordinates: {
        rightAscensionHours: 5.242,
        declinationDegrees: -8.201
      },
      distance: {
        lightYears: 860,
        parsecs: 260
      },
      parallaxMilliarcseconds: 3.78,
      properMotion: {
        raMasPerYear: 1.87,
        decMasPerYear: -0.56
      }
    },

    // Physical Properties
    physicalProperties: {
      spectralClass: "B8 Ia",
      stellarType: "Blue-white supergiant",
      apparentMagnitude: 0.13,
      absoluteMagnitude: -7.84,
      massSolarMasses: 21,
      radiusSolarRadii: 79,
      luminositySolarLuminosities: 120000,
      surfaceTemperatureKelvin: 12100,
      estimatedAgeMillionsYears: 8
    },

    // Stellar System & Characteristics
    system: {
      isMultipleStarSystem: true,
      componentCount: 4,
      primaryComponent: "Rigel A",
      variableType: "Alpha Cygni variable"
    }
  }, 

  {
    // Basic Identification
    entity: "Star",
    id: "betelgeuse",
    name: "Betelgeuse",
  }, 

  {
    // Basic Identification
    entity: "Star",
    id: "bellatrix",
    name: "Bellatrix",
  }, 

  {
    // Basic Identification
    entity: "Star",
    id: "mintaka",
    name: "Mintaka",
  }, 

  {
    // Basic Identification
    entity: "Star",
    id: "anyting",
    name: "Anything Else",
  }
];