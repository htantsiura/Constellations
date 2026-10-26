*This project has been created by Hennadii Tantsiura.*

# Interactive Constellations

## Description

This project is an interactive educational tool designed to reveal the true depth of the night sky.

**The Problem:** Because of the vast distances in space, human eyes cannot perceive the depth of the stars. As a result, we tend to imagine the night sky as a flat dome with stars painted on its surface. 

**The Solution:** A fully interactive 3D model of the night sky that accurately maps stellar positions. This allows users to explore the stars and look around not just from Earth's perspective, but from anywhere within the 3D space.

The project consists of two interconnected layers: a 3D environment built with Three.js showcasing the stars, and a UI layer containing informational cards. Both are fully interactive. Users can explore by navigating the 3D scene, using the search function, or browsing the list of cards.

### Data & Accuracy
Star positions were calculated using the Hipparcos catalog. The constellation lines and lists of main stars are based on the `western_SnT` sky culture from *Sky & Telescope* magazine. This catalog uses the classic, strict constellation shapes traditionally printed on star charts for amateur astronomers. It features the 88 traditional Western constellations recognized by the International Astronomical Union (IAU)—such as Orion, Ursa Major, and the Zodiac signs—which originate from ancient Greek and Babylonian astronomy.

To keep the user's focus on the 3D depth and spatial relationships, star sizes and colors have been simplified. Currently, the sizes do not reflect true apparent magnitude (brightness), and colors do not match their actual spectral classes. The Sun is uniquely colored orange to serve as a clear visual anchor at the center of the model. These features may be expanded in future iterations.

For better visualization and usability on a screen, star distances are mapped using a logarithmic scale.  

*Disclaimer: While based on real astronomical data, positions and distances may have minor inaccuracies. This project is intended as an educational and inspirational tool to help visualize the 3D nature of the night sky, rather than an exact scientific reference.*

## Features

* **Logarithmic 3D Scale:** Spatially visualizes massive astronomical distances in an understandable, navigable format.
* **Smooth Camera Transitions:** Utilizes GSAP for cinematic, seamless camera flights and dynamic orbit targeting between celestial objects.
* **Synchronized Layers:** Seamless real-time synchronization between the 3D WebGL context (Three.js) and the interactive UI layer (React).
* **Interactive Navigation:** Orbit, pan, and zoom mechanics tailored for a "planetarium" style exploration.

## Instructions

**3D Scene Navigation:**
* The 3D scene displays constellations and their connecting lines.
* **First Click:** Click on any star or constellation to smoothly focus the camera on it.
* **Second Click:** Click the object again to make it the central pivot point, allowing you to orbit around it.

**UI Interactions:**
* The UI provides a list of stars and constellations with key information.
* Clicking a card opens detailed info and moves the 3D camera to focus on that object.
* Constellation cards include a list of their main stars; clicking a star name will focus the camera on it.
* Star cards feature a "Constellation" button to easily switch back to the parent constellation card and refocus the scene.

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2. Navigate to the project directory:

    ```Bash
    cd your-repo-name
    ```

3. Install the dependencies:

    ```Bash
    npm install
    ```

4. Start the development server:

    ```Bash
    npm run dev
    ```



## Built With

**Frontend:** React, JavaScript, Vite

**3D Rendering:** Three.js, GSAP

**Data Processing:** Python

**Design:** Figma

**AI Assistance:** Gemini

## Data Sources
Hipparcos Catalogue - Star positions
https://sci.esa.int/web/hipparcos/

Sky & Telescope (SnT) Catalogue - Constellation data
https://github.com/Stellarium/stellarium-skycultures/tree/master/western_SnT

Wikipedia & Google Search - General information

## Author
Hennadii Tantsiura

[Portfolio](https://hennadiitantsiura.tilda.ws/)

[LinkedIn](https://www.linkedin.com/in/htantsiura/)

GitHub: @htantsiura