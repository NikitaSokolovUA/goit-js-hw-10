import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './fetchCountries'


const DEBOUNCE_DELAY = 300;
const refs = {
    inputSearch: document.querySelector('#search-box'),
    listCountry: document.querySelector('.country-list'),
    infoBoxCountry: document.querySelector('.country-info')
}

refs.inputSearch.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY))

function onInputSearch(e) {
    const name = e.target.value.trim()

    if (name.length === 0) {
        clearListCountries()
        clearInfoBox()
        return
    }

    API.fetchCountries(name)
        .then(addMarkupOnPage)
    .catch(() => Notify.failure('Oops, there is no country with that name'))
}

function addMarkupOnPage(countries) {  

    if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return
    }
    
    if (countries.length === 1) {  
        const countryInfo = renderInfoCountry(countries[0])
        
        clearListCountries()
        addInfoBoxOnPage(countryInfo)
        return
    }    
      
        clearInfoBox()
        const countriesList = renderTamplateCountries(countries)
        addListCountriesOnPage(countriesList)
}

function renderTamplateCountries(countries) {
   return countries.map(country => `
    <li class='country-item'>
     <img src="${country.flags.svg}" alt="Flag: ${country.name}" width='60' height='40'>
    <p class='country-name'>${country.name}</p>
</li>`).join('')
}

function renderInfoCountry(country) {
    const languagesCountry = country.languages.map(({name}) => `${name}`).join(', ')

    return `
        <div class='country-item'>
            <img src="${country.flags.svg}" alt="Flag: ${country.name}" width='60' height='40'>
            <h1>${country.name}</h1>
        </div>
            <p><b>Capital: </b>${country.capital}</p>
            <p><b>Population: </b>${country.population}</p>
            <p><b>Languages: </b>${languagesCountry}</p>
    `
}

function clearListCountries() {
    refs.listCountry.innerHTML = '';
}

function clearInfoBox() {
    refs.infoBoxCountry.innerHTML = "";
}

function addListCountriesOnPage(markup) {
    refs.listCountry.innerHTML = markup;
}

function addInfoBoxOnPage(markup) {
    refs.infoBoxCountry.innerHTML = markup;
}