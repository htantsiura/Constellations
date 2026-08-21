export const StarsAndConstellations = [

  {
    // Basic Information
    entity: "Constellation",
    id: "ori",
    officialName: "Orion",
    commonName: "The Hunter",
    iauAbbreviation: "Ori",

    // Astrometric and Geometric Parameters
    astrometry: {
      areaSqDegrees: 594,
      equatorialCoordinates: {
        rightAscension: { 
          minHours: 4.71, 
          maxHours: 6.42 
        },
        declination: { 
          minDegrees: -10.97, 
          maxDegrees: 22.91 
        }
      }
    },

    // Stellar Composition & Deep-Sky Objects
    composition: {
      visibleStarsCount: 120, // Stars brighter than 6.5m
      brightestStar: {
        name: "Rigel",
        bayerDesignation: "Beta Orionis",
        apparentMagnitude: 0.18,
        spectralClass: "B8 Ia"
      },
      asterisms: [
        "Orion's Belt", 
        "Orion's Sword", 
        "The Hourglass"
      ],
      deepSkyObjects: [
        { 
          name: "Orion Nebula", 
          catalogId: "M42", 
          type: "Emission nebula" 
        },
        { 
          name: "Horsehead Nebula", 
          catalogId: "Barnard 33", 
          type: "Dark nebula" 
        }
      ],
      meteorShowers: [
        "Orionids", 
        "Chi Orionids"
      ]
    },

    // Visibility and Observation Conditions
    observation: {
      visibilityLatitudes: {
        minDegrees: -75,
        maxDegrees: 85
      },
      bestMonthToObserve: "January"
    }
  },

  {
    // Basic Identification
    entity: "Star",
    id: "rigel",
    officialName: "Rigel",
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
  }

];