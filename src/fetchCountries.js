import { Notify } from 'notiflix/build/notiflix-notify-aio';
export const fetchCountries = name => {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error('response is gone');
    }
    return response.json();
  });
};
