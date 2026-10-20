//import StarsData from '../../StarsData.json'
import StarsData from '../../DataSources/StarsData1.json'

export const openStar = (starId, setExpandedId, setIsStar, setSearchQuery) => {
  const targetStar = StarsData.find((s) => s.id === starId);
  //const targetStar = StarsData.find((s) => s.hip === starId);
  
  if (targetStar) {
    setSearchQuery('');
    setExpandedId(targetStar.id);
    setIsStar(true);
    
    setTimeout(() => {
      const element = document.getElementById(`star-${targetStar.id}`);
      
      if (element) {
        element.scrollIntoView({ 
          //behavior: 'smooth', 
          block: 'start' });
      }
    }, 100);
  }
};