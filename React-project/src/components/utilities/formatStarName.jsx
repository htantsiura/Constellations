const formatStarName = (name) => {
  return name
    .split('_') // 1. Разбиваем слово там, где есть подчеркивание (получаем массив слов)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // 2. У каждого слова делаем первую букву большой
    .join(' '); // 3. Склеиваем слова обратно, но уже через пробел
};