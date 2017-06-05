function main() {

    var resultStats = document.getElementById('resultStats');

    if (resultStats !== null) {

        // Regex to get current page from #resultStats
        // Get integers from two string formats:
        //
        //     Ongeveer 453.000 resultaten (0,48 seconden)
        //     (Only two matches = first page)
        //
        //     Pagina 2 van ongeveer 453.000 resultaten<nobr> (0,43 seconden)&nbsp;</nobr>
        //     (First match is the current page)
        //
        var resultStats = resultStats.innerHTML;
        var regExMatch = resultStats.match(/[0-9]+(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?(\.|,)?[0-9]?/g);

        // > 2 matches = first match is page number
        if (typeof regExMatch[2] !== 'undefined') {
            var currentPage = parseInt(regExMatch[0]);
        } else {
            var currentPage = 1;
        }

        // get all regular/organic search results
        var results = document.querySelectorAll('.g .rc');

        // @todo: this doesnt work for last page
        var resultsPerPage = results.length;
        if (resultsPerPage < 10) {
            var resultsPerPage = 10;
        }

        // Now add our counter
        for (var i = 0, g = results.length; i < g ; i++) {
            counter = document.createElement('div');
            counter.className = 'js-counter';

            // index zero
            // multiple pages (currentPage)
            if (currentPage > 1) {
                counter.innerHTML = '#' + (i + (currentPage * resultsPerPage) - (resultsPerPage - 1));
            } else {
                // index zero + 1
                counter.innerHTML = '#' + (i + 1);
            }

            results[i].parentNode.appendChild(counter);
        }

    }

    return true;

}

// Listen to hash change
// window.onhashchange and similair functions dont work with google instant search
oldHash = location.hash;
var hashchange = setInterval(function() {

    currentHash = location.hash;

    if (currentHash != oldHash) {

        // hash has changed, run function again
        setTimeout(main, 1000);

        // set curenthash again
        // and keep listening
        oldHash = currentHash;
    }


}, 1000);

// run on page load
setTimeout(main, 1000);