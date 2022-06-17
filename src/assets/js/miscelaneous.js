export const moonPhases = {
  0.49: "Waxing crescent",
  0.5: "First quarter",
  0.99: "Waxing gibbous",
  1: "Full Moon",
};

export const windRose = {
  22.5: "Tramuntana",
  67.5: "Gregal",
  112.5: "Levante",
  157.5: "Jaloque",
  202.5: "Mediodía",
  247.5: "Lebeche",
  292.5: "Poniente",
  337.5: "Mistral",
};

export const UVIndex = {
  2: "✅",
  5: "⚠️",
  7: "⚠️⚠️",
  10: "🛑",
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
};

export const showPosition = (position) => {
  return position;
};

export const savePreferences = (key, value) => {
  const savedOptions = JSON.parse(localStorage.getItem("guiempo")) || {};
  savedOptions[key] = value;
  localStorage.setItem("guiempo", JSON.stringify(savedOptions));
};

export const mediaDependingClass = (className, width, maxMin) => {
  const media = window.matchMedia(`(${maxMin}-width: ${width}px)`);
  console.log(media, media.matches);
  if (!media.matches) return;
  return className;
}