//import ConstellationData from '../../ConstellationsData.json';
import ConstellationData from '../../DataSources/ConstellationData1.json';

export const openConstellationCard = (constellationId, setExpandedId, setIsConstellation, setSearchQuery) => {
  const targetConstellation = ConstellationData.find(
    //(c) => c.name.toLowerCase() === constellationId
    (c) => c.id === constellationId
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
    }, 0); //100
  }
}; 