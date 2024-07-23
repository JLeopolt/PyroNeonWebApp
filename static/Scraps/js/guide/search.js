const resultsContainer = document.getElementById('resultsContainer');
const searchField = document.getElementById('searchfield');

// Load the pre-specified search key from url params, if any.
searchByURLParams();

// Add onclick to the search button to tie it to the javascript search function.
document.getElementById("searchButton").onclick = function(){search(searchField.value);};

// Allow the user to press enter to search without clicking the button.
searchField.addEventListener("keyup", ({key}) => {
  if (key === "Enter") {
      search(searchField.value);
  }
});

// container
const searchSection = document.getElementsByClassName('searchSection')[0];

// Reveals the results table automatically whenever it gains focus again.
searchSection.addEventListener('focusin', function() {
  // If the results container has contents, reveal it.
  if(resultsContainer.innerHTML !== ''){
    // reveal the search results list.
    toggleResultsContainerVisibility(true);
  }
});

// Add click event listener to the document to handle clicks outside the container
document.addEventListener('click', (event) => {
    if (!searchSection.contains(event.target)) {
        toggleResultsContainerVisibility(false);
    }
});

// Automatically performs a search on page load, if a query was specified within URL params.
function searchByURLParams(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  // If the URL had a search already specified
  if(urlParams.has('query')){
    // Get the search param and search it immediately.
    const searchKey = urlParams.get('query');
    searchField.value = searchKey;
    search(searchKey);
  }
}

/**
Called when the user submits a search query. Accesses the search text field,
and performs an API request to the backend. The backend does a deep search against
all indexed articles, and returns a list of results, including the context in which
they were found.
*/
export function search(keystring){
  // If the keystring is empty, don't bother performing a search.
  if(keystring === ""){
    // Reset the search results, and hide the list entirely.
    resetSearchResults();
    toggleResultsContainerVisibility(false);
    return;
  }
  // Reset the search results but reveal the list.
  resetSearchResults();
  toggleResultsContainerVisibility(true);
  // Fetch search results from the server
  const userAction = async () => {
    // Deliberately encode the URI so that trailing whitespace is preserved.
    let response = await fetch("/scraps/guide/api/search/" + encodeURIComponent(keystring));
    // If this was an invalid request, do nothing.
    if(response.status === 404){
      return;
    }
    // Get the response and extract search results.
    response = await response.json();
    const results = response.results;
    // Build search result elements for each result
    for(const result of results){
      insertResultElement(keystring, result);
    }
    // if results array is empty
    if(results.length == 0){
      insertEmptyResultElement();
    }
  }
  userAction();
}

// Removes all contents of the results container.
function resetSearchResults(){
  // Remove the contents of the list.
  resultsContainer.innerHTML = '';
}

// Toggles visibility of the results container.
function toggleResultsContainerVisibility(isVisible){
  // If the search results table should be hidden, or revealed.
  let state = 'block';
  if(isVisible === false){
    state = 'none';
  }
  // Update display state accordingly.
  resultsContainer.style.display = state;
}

function insertEmptyResultElement(){
  // give the user an info message, that no results were found.
  let message = document.createElement('p');
  message.classList.add('emptyResultNotice');
  message.innerText = 'No results found.';
  // insert the new entry into the results container
  resultsContainer.appendChild(message);
}

/**
Builds a result element to add to the results list, which includes a reference to the page,
and a few words of context around the result of the keyword found within the article.
*/
function insertResultElement(query, result){
  // get the URL and title of the article from filepath
  let article = processRawPath(result.path);
  // build a hyperlink object wrapper
  let entryWrapper = document.createElement('a');
  entryWrapper.href = article.url;

  // create a header with the article name
  let entryTitle = document.createElement('span');
  entryTitle.classList.add('searchResultTitle');
  entryTitle.innerText = article.title;
  entryWrapper.appendChild(entryTitle);
  entryWrapper.appendChild(document.createElement('br'));

  // create context
  let context = document.createElement('i');
  entryWrapper.appendChild(context);

  // Find the keyword itself within context, and highlight it.
  // Case insensitive search for the word in the text
  let index = result.context.toLowerCase().indexOf(query.toLowerCase());
  if (index !== -1) {
    // insert the beginning of the quote
    context.innerText = "\"" + result.context.slice(0, index);
    // highlight the keystring found within the quote
    let highlight = document.createElement('span');
    highlight.classList.add('searchResultHighlight');
    highlight.innerText = result.context.slice(index, index + query.length);
    context.appendChild(highlight);
    // append the rest of the quote
    context.appendChild(document.createTextNode(result.context.slice(index + query.length) + "\""));
  }

  // insert the new entry into the results container element
  resultsContainer.appendChild(entryWrapper);
}

// Returns an object containing the URL and user-friendly title of an article.
function processRawPath(path){
  // For each path, clip it's filename and prefix.
  path = path.slice(0, -5);
  return {
    "url" : "/scraps/guide/"+path,
    "title" : path.replace("-", " ").replace("/",": ")
  }
}
