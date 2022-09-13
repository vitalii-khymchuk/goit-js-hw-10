import './css/styles.scss';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import simple_markup from './templates/simple_markup.hbs';
import advanced_markup from './templates/advanced_markup.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const countryName = e.target.value.trim();
  if (countryName !== '') {
    clearMarkup();
    fetchCountries(countryName).then(addMarkup).catch(showError);
    return;
  }
  clearMarkup();
}

function addMarkup(data) {
  const quantityOfCountries = data.length;

  if (quantityOfCountries > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (quantityOfCountries === 1) {
    addAdvancedMarkup(data);
    return;
  }

  refs.countryList.innerHTML = simple_markup(data);
}

function addAdvancedMarkup(data) {
  const countryInfo = data[0];
  const languages = Object.values(data[0].languages).join(', ');
  countryInfo.languages = languages;

  refs.countryInfo.innerHTML = advanced_markup(countryInfo);
}

function showError(error) {
  Notify.failure('Oops, there is no country with that name');
  console.log(error);
}

function clearMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
