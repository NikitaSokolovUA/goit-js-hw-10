import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


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
        return
    }

    fetchCountries(name)
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
        
        refs.listCountry.innerHTML = '';
        refs.infoBoxCountry.innerHTML = countryInfo
                return
    }    
           
    const countriesList = renderTamplateCountries(countries)
    refs.listCountry.innerHTML = countriesList
}



function fetchCountries(name) {
    const searchParams = '?fields=name,capital,population,flags,languages'


    return fetch(`https://restcountries.com/v2/name/${name}${searchParams}`)
        .then(responce => {
            if (!responce.ok) {
        throw new Error(responce.status);
      }
      return responce.json();})
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