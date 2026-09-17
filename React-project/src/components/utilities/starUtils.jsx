import StarsData from '../../StarsData.json'

export const openStar = (starId, setExpandedId, setIsStar) => {
  const targetStar = StarsData.find((s) => s.id === starId);
  
  if (targetStar) {
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