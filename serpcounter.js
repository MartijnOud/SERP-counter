function main() {

    // Get SERPs
    var results = document.querySelectorAll('#search .yuRUbf');

    // Calculate results per page
    var resultStats = document.querySelector('#result-stats');
    if (resultStats !== null) {
        var resultStats = resultStats.innerHTML;

        // Regex to match &nbsp; (or single space) surrounded by digits
        // Replaces thousand seperator space with a .
        var resultStats = resultStats.replace(/(?<=[0-9]{1,3})(&nbsp;|\s{1})(?=[0-9]{1,3})/g, '.');

        // Regex to get current page from #resultStats
        // Get integers from two string for
        //     About 22.600.000 results (0,43 seconds) mats:
        //
        //     (Two matches == first page)
        //
        //     Page 2 of about 22.600.000 results (0,50 seconds)
        //     (First match is the _current_ page)
        //
        //     Works for most known locales
        //
        //
        var regExMatch = resultStats.match(/[0-9]+(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?/g);

        // 2+ matches = first match is page number
        var currentPage = 1;
        if (typeof regExMatch[2] !== 'undefined') {
            var currentPage = parseInt(regExMatch[0]);
        }

        var resultsPerPage = results.length;
    } else {
        // defaults for queries without resultsPerPage
        var currentPage = 1;
        var resultsPerPage = 10;
    }

    // Reset localstorage on page 1 for new searches
    if (currentPage == 1) {
        localStorage.removeItem('countLastPage');
        localStorage.removeItem('lastPage');
    }

    // countActual = index. Starts at 0, resets every page
    // countDisplay = Human friendly, stored in localStorage
    var countDisplay = 1;
    for (var countActual = 0; countActual < results.length; countActual++, countDisplay++) {

        // Skip if URL is invisible (PAA box)
        var urls = results[countActual].querySelectorAll('cite');
        var url = window.getComputedStyle(urls[0]);
        if (url.visibility == "hidden") {
            countDisplay--;
            continue;
        }


        if (currentPage == 1) {
            var count = countDisplay;
        } else if (parseInt(localStorage.getItem('countLastPage')) !== null && (parseInt(localStorage.getItem('lastPage')) + 1) == currentPage) {
            var count = (countDisplay + parseInt(localStorage.getItem('countLastPage')));
        } else {
            // Fallback for when localStorage is not set (no chronological navigation)
            var count = (countActual + (currentPage * resultsPerPage)) - (resultsPerPage-1);
        }

        counter = document.createElement('div');
        counter.className = 'js-counter';
        counter.textContent = '#' + count;


        results[countActual].parentNode.prepend(counter);
    }

    localStorage.setItem('lastPage', currentPage);
    localStorage.setItem('countLastPage', count);


    return true;

}

// Listen to hash change
// window.onhashchange and similar functions don't work with instant search
oldHash = location.hash;
var hashchange = setInterval(function() {

    currentHash = location.hash;

    if (currentHash != oldHash) {

        // hash has changed, run function again
        setTimeout(main, 750);

        // set curenthash again
        // and keep listening
        oldHash = currentHash;
    }

}, 750);

// run on page load
setTimeout(main, 750);