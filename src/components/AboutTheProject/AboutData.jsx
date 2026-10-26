export const aboutData = [
  {
    title: 'Description',
    description: '\nThis project is an interactive educational tool designed to reveal the true depth of the night sky.\n\nThe Problem: \nBecause of the vast distances in space, human eyes cannot perceive the depth of the stars. As a result, we tend to imagine the night sky as a flat dome with stars painted on its surface. \n\nThe Solution: \nA fully interactive 3D model of the night sky that accurately maps stellar positions. This allows users to explore the stars and look around not just from Earth\'s perspective, but from anywhere within the 3D space.\n\nThe project consists of two interconnected layers: a 3D environment built with Three.js showcasing the stars, and a UI layer containing informational cards. Both are fully interactive. Users can explore by navigating the 3D scene, using the search function, or browsing the list of cards.'
    
  },
  {
    title: 'Data & Accuracy',
    description: '\nStar positions were calculated using the Hipparcos catalog. The constellation lines and lists of main stars are based on the `western_SnT` sky culture from *Sky & Telescope* magazine. This catalog uses the classic, strict constellation shapes traditionally printed on star charts for amateur astronomers. It features the 88 traditional Western constellations.\n\nTo keep the user\'s focus on the 3D depth and spatial relationships, star sizes and colors have been simplified. Currently, the sizes do not reflect true apparent magnitude (brightness), and colors do not match their actual spectral classes. The Sun is uniquely colored orange to serve as a clear visual anchor at the center of the model. These features may be expanded in future iterations.\n\nFor better visualization and usability on a screen, star distances are mapped using a logarithmic scale.\n\n*Disclaimer: While based on real astronomical data, positions and distances may have minor inaccuracies. This project is intended as an educational and inspirational tool to help visualize the 3D nature of the night sky, rather than an exact scientific reference.*'
    
  },
  {
  title: 'Built With',
  description: '\nReact, JavaScript, Vite, Three.js, GSAP, Python, Figma, Gemini'
}, 
{
  title: 'Data Sources',
  description: (
    <>
      <br />
      <a href="https://sci.esa.int/web/hipparcos/" target="_blank" rel="noreferrer">
        Hipparcos Catalogue - Star positions
      </a>
      <br />
      <a href="https://github.com/Stellarium/stellarium-skycultures/tree/master/western_SnT" target="_blank" rel="noreferrer">
        Sky & Telescope (SnT) Catalogue
      </a>
      <br />
      Wikipedia & Google Search - General information
     </>
  )
},
{
  title: 'Contacts',
  description: (
    <>
      <br />
      <p>Author: Hennadii Tantsiura</p>
      <p><a href="https://hennadiitantsiura.tilda.ws/" target="_blank" rel="noreferrer">Portfolio</a> </p>
      <p><a href="https://www.linkedin.com/in/htantsiura/" target="_blank" rel="noreferrer">
        LinkedIn
      </a></p>
      <p><a href="https://github.com/htantsiura" target="_blank" rel="noreferrer">
        GitHub: @htantsiura
      </a></p>
      
       
      <br />
      <br /><br /><br /><br />
    </>
  )
}
]

