import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const listItemTemplate = (svg, name) =>
  `<li class="country-item"><img class="country-flag" src=${svg}><p class="country-name">${name}</p>
    </li>`;
const countryChosen = (svg, name, capital, pop, lang) =>
  `<li><div class="country-wrapper"><img class="country-flag" src=${svg}><p class="country-name-big">${name}</p></div><ul class="descr-list"><p class="descr">Capital: <span class="content">${capital}</span></p>
<p class="descr">Population: <span class="content">${pop}</span></p>
<p class="descr">Language: <span class="content">${lang}</span></p></ul>
    </li>`;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

const onInput = e => {
  e.preventDefault();
  refs.list.innerHTML = '';
  if (refs.input.value === '') {
    return;
  }
  fetchCountries(refs.input.value.trim())
    .then(data => {
      if (data.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length >= 2 && data.length <= 10) {
        return data.map(country => {
          refs.list.insertAdjacentHTML(
            'beforeend',
            listItemTemplate(country.flags.svg, country.name.official)
          );
        });
      }
      return data.map(country => {
        const { flags, capital, name, population, languages } = country;
        return refs.list.insertAdjacentHTML(
          'beforeend',
          countryChosen(
            flags.svg,
            name.official,
            capital,
            population,
            Object.values(languages)
          )
        );
      });
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      return (refs.list.innerHTML = '');
    });
};
const debouncedInput = debounce(onInput, DEBOUNCE_DELAY);
refs.input.addEventListener('input', debouncedInput);
