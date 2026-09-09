export const AllConstellations = [

  {
    // Basic Information
    entity: "Constellation",
    id: "ori",
    name: "Orion",
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
    // Basic Information
    entity: "Constellation",
    id: "vrg",
    name: "Virgin",
  },

  {
    // Basic Information
    entity: "Constellation",
    id: "gmn",
    name: "Gemini",
  }
   


];