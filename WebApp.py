# standard resources
import os
import time
import traceback
import random
import re
from pathlib import Path

# Handles serving html files and other content
from flask import Flask, render_template, redirect, url_for, send_from_directory, abort
# Handles caching
from flask_caching import Cache
# For HTML parsing
from bs4 import BeautifulSoup

# Setup config and create the Flask application
config = {
    "DEBUG": False,
    "CACHE_TYPE": "SimpleCache",
    "CACHE_DEFAULT_TIMEOUT": 300
}
app = Flask(__name__)
app.config.from_mapping(config)
# Define the absolute path to templates directory
templates_dir = os.path.join(app.root_path, app.template_folder)
# Setup cache
cache = Cache(app)

# A dict containing all filepaths of Scraps Guide article names. For use as Jinja2 context for the scraps guide index route.
scraps_index_paths = {}
# A dict containing the text from all Scraps Guide articles, for use in site-wide searches.
scraps_guide_search_index = {}

"""
Builds an index array of all articles (reference links) within the Scraps Guide.
Additionally, builds an index object containing all article content in one giant dict, for use in searching.
"""
def scraps_guide_build_index():
    # Recursively get all folders and files within subfolder.
    files = list(Path("./templates/Scraps/guide").glob('*/*.html')) # **/*.html to include top-level folder contents
    # Process all of the discovered article files.
    paths = []
    for file in files:
        # Format and save the filepath
        path = file.as_posix().replace("templates/Scraps/guide/", "")
        paths.append(path)
        # Initialize the object with the document
        soup = BeautifulSoup(open(file.as_posix()), "html.parser")
        # Retrieve each string in the body of the article, recursively
        fulltext = ""
        for string in soup.body.strings:
            # append each string to fulltext
            fulltext += string + "\n"
        # Finally, map the path to it's fulltext.
        scraps_guide_search_index[path] = fulltext
    # Returns the resulting array.
    return paths

"""
Sorts all articles and subdirectories under the Scraps Guide into a nested dict, for use in indexing.
"""
def sort_files_by_subfolders(root_dir):
    result = {}
    for root, _, files in os.walk(root_dir):
        # Skip files in the root directory
        if root == root_dir:
            continue
        current_dict = result
        path = root.split(os.path.sep)
        for folder in path[1:]:
            current_dict = current_dict.setdefault(folder, {})
        for file in files:
            current_dict[file] = None
    return result

# Build the search index, and simultaneously build a flat array of all articles.
scraps_index_paths['flat'] = scraps_guide_build_index();
# Build a nested directory for use in indexing.
scraps_index_paths['paths'] = sort_files_by_subfolders("./templates/Scraps/guide")




"""
Handles users entering a wrong link or other 404 errors.
:param e: The error.
:returns: The website's 404 error page.
"""
@app.errorhandler(404)
@cache.cached()
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('PyroNeon/404.html'), 404

"""
Attempts to route a URL dynamically, when provided a path to use. If the resource can't be found, throws a 404.
Automatically protects against directory traversals. Case insensitive.
:param relpath: The relative path to the resource to access. Automatically given a suffix '.html' and does NOT require a leading '/'
:param context: A dict containing context to provide to the template through Jinja. Includes site modified date, creation date by default.
:returns: The resulting html resource, or an error 404 if the resource wasn't found.
"""
def route_page(relpath, context = {}):
    # Lowercase and add suffix .html
    relpath = relpath.lower() + '.html'
    try:
        # protect against directory traversals
        resourcepath = str(Path(templates_dir).joinpath('./templates/' + relpath).resolve().relative_to(Path(templates_dir).resolve()))
        #print(resourcepath)
        # merge default context with the custom context provided (if any)
        context.update(default_context(resourcepath))
        # Try rendering the requested resource
        return render_template(relpath, **context)
    except Exception:
        #print(traceback.format_exc())
        abort(404)

"""
Tries to build default contextual data in the form of a dict containing context about the file being accessed.
Includes the creation date of the file, and the last modified date of the file.
:param relpath: The relative path to the resource. Assumed to be a resource within templates folder.
:returns: A dict containing context about the file.
"""
def default_context(relpath):
    context = {
        'creation_date': time.ctime(os.path.getctime(relpath)),
        'last_modified': time.ctime(os.path.getmtime(relpath))
    }
    return context



# Redirects the site root to 'Products'
@app.route('/')
def main_index_route():
    return redirect("/products", code=302)

# Explicit route to the 'about' page.
@app.route('/about')
@cache.cached()
def homepage():
    return render_template('PyroNeon/index.html')

# Route main site pages
@app.route('/<path:path>')
@cache.cached()
def main_page_router(path):
    return route_page('PyroNeon/'+path)

# Directs to the discord invite.
@app.route('/discord')
def discordRedirect():
    return redirect("https://www.discord.gg/CvYVuSCXvk", code=302)




# Route accounts to the dashboard by default
@app.route('/accounts')
def accounts_index_route():
    return redirect("/accounts/users/dashboard", code=302)

# Route Accounts pages
@app.route('/accounts/<path:path>')
@cache.cached()
def accounts_page_router(path):
    return route_page('Accounts/'+path)




# Routes PuzzleMinefield index.
@app.route('/PuzzleMinefield/')
@cache.cached()
def pmf_index_route():
    return render_template('PuzzleMinefield/index.html')

# Route PuzzleMinefield pages
@app.route('/PuzzleMinefield/<path:path>')
@cache.cached()
def pmf_page_router(path):
    return route_page('PuzzleMinefield/'+path)

# Downloading Puzzle Minefield as a JAR file
@app.route('/PuzzleMinefield/download-jar')
def download_pmf_jar():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/PuzzleMinefield-Releases/releases/latest/download/PuzzleMinefield.jar", code=302)

# Downloading Puzzle Minefield as an EXE file
@app.route('/PuzzleMinefield/download-exe')
def download_pmf_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/PuzzleMinefield-Releases/releases/latest/download/PuzzleMinefield.exe", code=302)

# Reporting a bug in Puzzle Minefield.
@app.route('/PuzzleMinefield/report-a-bug')
def puzzleMinefieldBugReport():
    return redirect("https://forms.gle/jJkvXrN67hCTx2ot7", code=302)





# Routes Scraps index page.
@app.route('/scraps/')
@cache.cached()
def scraps_index_route():
    return render_template('Scraps/index.html')

# Route Scraps pages
@app.route('/scraps/<path:path>')
@cache.cached()
def scraps_page_router(path):
    return route_page('Scraps/'+path)

# Redirects alternate scraps/wiki address to the new guide homepage.
@app.route('/scraps/wiki')
def scraps_wiki_redirect():
    return redirect("/scraps/guide", code=302)

# Route Scraps Guide homepage
@app.route('/scraps/guide')
@cache.cached()
def scraps_guide_homepage_route():
    return route_page('Scraps/guide/search')

# Handles the dynamic indexing for the Scraps Guide.
@app.route('/scraps/guide/index')
@cache.cached()
def scraps_guide_autoindex_route():
    return render_template('Scraps/guide/index.html', **scraps_index_paths)

# Redirects to a random article in the Scraps Guide.
@app.route('/scraps/guide/random')
def scraps_guide_random():
    # Build a random url from picking an item out of the autoindex and formatting as url.
    url = '/scraps/guide/' + random.choice(scraps_index_paths['flat'])[:-5]
    return redirect(url, code=302)

# Route Scraps Guide searches (api)
@app.route('/scraps/guide/api/search/<path:query>')
@cache.cached()
def scraps_guide_search(query):
    # Return each result in an array within a dict object.
    results = []
    # escape the query string for use in regex
    for page, contents in scraps_guide_search_index.items():
        # Regex pattern
        pattern = r'(?i)(?:\b\S+\s*){0,5}' + re.escape(query) + r'(?:\s*\S+){0,5}'
        # Find the match
        match = re.search(pattern, contents)
        if match:
            # Replace newline characters manually
            quote = match.group(0).replace("\n", " ")
            # Include the article and context info in the results list
            result = {"path" : page, "context" : quote}
            results.append(result)
    # Return a dict containing all the results
    return {'results' : results}






# Route Experimental pages -- Does not have a root index page.
@app.route('/experimental/<path:path>')
@cache.cached()
def experimental_page_router(path):
    return route_page('Experimental/'+path)

# Routes MUDTool index page.
@app.route('/experimental/mudtool/')
@cache.cached()
def mudtool_index_route():
    return render_template('Experimental/mudtool/index.html')

# Routes TUMULT index page.
@app.route('/experimental/TUMULT/')
@cache.cached()
def tumult_index_route():
    return render_template('Experimental/TUMULT/index.html')

# Downloading MUD as an EXE file
@app.route('/experimental/mudtool/download-exe')
def download_mudtool_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/MultimediaUtilityDownloadTool/releases/latest/download/MultimediaUtilityDownloadTool.exe", code=302)

# Downloading TUMULT as a JAR file
@app.route('/experimental/TUMULT/download-jar')
def tum_download_jar():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/TUMULT-Releases/releases/latest/download/Tumult.jar", code=302)

# Downloading TUMULT as an EXE file
@app.route('/experimental/TUMULT/download-exe')
def tum_download_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/TUMULT-Releases/releases/latest/download/Tumult.exe", code=302)





# Route muSign index page
@app.route('/musign/')
@cache.cached()
def musign_index_route(path):
    return render_template('muSign/index.html')

# Downloading muSign as an EXE file
@app.route('/musign/download-exe')
def download_musign_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/muSign/releases/latest/download/muSign.exe", code=302)





# Route CLIPnP index page
@app.route('/clipnp/')
@cache.cached()
def clipnp_index_route(path):
    return render_template('CLIPnP/index.html')





# Runs the program, accepting traffic from any ip address
if __name__ == "__main__":
    app.run(host="0.0.0.0")
