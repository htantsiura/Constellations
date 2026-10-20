//import ConstellationData from '../../ConstellationsData.json';
import ConstellationData from '../../DataSources/ConstellationData1.json';

export const openConstellation = (constellationName, setExpandedId, setIsConstellation, setSearchQuery) => {
  const targetConstellation = ConstellationData.find(
    (c) => c.name === constellationName
  );
  if (targetConstellation) {
    setSearchQuery('');
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