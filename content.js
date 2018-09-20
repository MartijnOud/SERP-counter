function main() {

    var resultStats = document.getElementById('resultStats');

    if (resultStats !== null) {

        // Regex to get current page from #resultStats
        // Get integers from two string formats:
        //
        //     About 22.600.000 results (0,43 seconds) 
        //     (Two matches == first page)
        //
        //     Page 2 of about 22.600.000 results (0,50 seconds)
        //     (First match is the _current_ page)
        //
        //
        var resultStats = resultStats.innerHTML;
        var regExMatch = resultStats.match(/[0-9]+(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?/g);

        // 2+ matches = first match is page number
        var currentPage = 1;
        if (typeof regExMatch[2] !== 'undefined') {
            var currentPage = parseInt(regExMatch[0]);
        }

        var results = document.querySelectorAll('.g .rc');
        var resultsPerPage = results.length;

        // Set featured snippet to #0        
        if (results[0].getElementsByClassName('st').length == 0) {
            var countDisplay = 0;
        } else {
            var countDisplay = 1;
        }

        // Reset localstorage on page 1 for new searches
        if (currentPage == 1) {
            localStorage.removeItem('countLastPage');
            localStorage.removeItem('lastPage');
        }

        // countActual = index. Starts at 0, resets every page
        // countDisplay = Human friendly, stored in localStorage
        for (var countActual = 0; countActual < results.length; countActual++, countDisplay++) {

            counter = document.createElement('div');
            counter.className = 'js-counter';

            if (currentPage == 1) {
                var count = countDisplay;
                counter.innerHTML = '#' + count;
            } else if (parseInt(localStorage.getItem('countLastPage')) !== null && (parseInt(localStorage.getItem('lastPage')) + 1) == currentPage) {
                var count = (countDisplay + parseInt(localStorage.getItem('countLastPage')));
                counter.innerHTML = '#' + count;
            } else {
                // Fallback for when localStorage is not set (no chronological navigation)
                var count = (countActual + (currentPage * resultsPerPage)) - (resultsPerPage-1);
                counter.innerHTML = '#' + count;
            }

            results[countActual].parentNode.prepend(counter);
        }

        localStorage.setItem('lastPage', currentPage);
        localStorage.setItem('countLastPage', count);
    }

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