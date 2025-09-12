const bgClasses = [
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-red-100',
  'bg-pink-100',
  'bg-cyan-100',
  'bg-orange-100',
  'bg-lime-100',
];

export const getRandomBgClass = () => {
  const randomIndex = Math.floor(Math.random() * bgClasses.length);
  return bgClasses[randomIndex];
};

const bgTextPairs = [
  ['bg-blue-100 text-blue-700'],
  ['bg-green-100 text-green-700'],
  ['bg-yellow-100 text-yellow-700'],
  ['bg-purple-100 text-purple-700'],
  ['bg-red-100 text-red-700'],
  ['bg-pink-100 text-pink-700'],
  ['bg-cyan-100 text-cyan-700'],
  ['bg-orange-100 text-orange-700'],
  ['bg-lime-100 text-lime-700'],
];

export const getRandomBgTextClass = () => {
  const randomIndex = Math.floor(Math.random() * bgClasses.length);
  return bgTextPairs[randomIndex];
};


const darkBgClasses = [
  'bg-blue-700',
  'bg-green-700',
  'bg-yellow-700',
  'bg-purple-700',
  'bg-red-700',
  'bg-pink-700',
  'bg-cyan-700',
  'bg-orange-700',
  'bg-lime-700',
  'bg-gray-700',
  'bg-indigo-700',
  'bg-teal-700',
];

export const getRandomDarkBgClass = () => {
  const randomIndex = Math.floor(Math.random() * darkBgClasses.length);
  return darkBgClasses[randomIndex];
};

const darkClasses = [
  'blue-700',
  'green-700',
  'yellow-700',
  'purple-700',
  'red-700',
  'pink-700',
  'cyan-700',
  'orange-700',
  'lime-700',
  'gray-700',
  'indigo-700',
  'teal-700',
];

export const getRandomDarkClass = () => {
  const randomIndex = Math.floor(Math.random() * darkBgClasses.length);
  return darkClasses[randomIndex];
};