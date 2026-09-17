import ConstellationData from '../../ConstellationsData.json';

export const openConstellation = (constellationName, setExpandedId, setIsConstellation) => {
  const targetConstellation = ConstellationData.find(
    (c) => c.name === constellationName
  );
  if (targetConstellation) {
    setExpandedId(targetConstellation.id);
    setIsConstellation(true); 

    setTimeout(() => {
      const element = document.getElementById(`constell-${targetConstellation.id}`);
      
      if (element) {
        element.scrollIntoView({ 
          //behavior: 'smooth',
          block: 'start'      // attach to the top of the block
        });
      }
    }, 100);
  }
};