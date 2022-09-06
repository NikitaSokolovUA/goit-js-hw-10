const SAERCH_PAPRAMS = '?fields=name,capital,population,flags,languages';


function fetchCountries(name) { return fetch(`https://restcountries.com/v2/name/${name}${SAERCH_PAPRAMS}`)
        .then(responce => {
            if (!responce.ok) {
        throw new Error(responce.status);
      }
            return responce.json()
        })
}

export default {fetchCountries}