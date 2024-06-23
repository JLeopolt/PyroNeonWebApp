import os
import time
# Handles serving html files and other content
from flask import Flask, render_template, redirect, url_for, send_from_directory, abort
app = Flask(__name__)

"""
Handles users entering a wrong link or other 404 errors.
:param e: The error.
:returns: The website's 404 error page.
"""
@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('PyroNeon/404.html'), 404

"""
Attempts to route a URL dynamically, when provided a path to use. If the resource can't be found, throws a 404.
:param relpath: The relative path to the resource to access. Automatically given a suffix '.html' and does NOT require a leading '/'
:param context: A dict containing context to provide to the template through Jinja. Includes site modified date, creation date by default.
:returns: The resulting html resource, or an error 404 if the resource wasn't found.
"""
def route_page(relpath, context = {}):
    relpath += '.html'
    # merge default context with the custom context provided (if any)
    context.update(default_context(relpath))
    try:
        # Try getting the requested resource first
        return render_template(relpath, **context)
    except Exception as e:
        abort(404)

"""
Tries to build default contextual data in the form of a dict containing context about the file being accessed.
Includes the creation date of the file, and the last modified date of the file.
:param relpath: The relative path to the resource. Assumed to be a resource within templates folder.
:returns: A dict containing context about the file.
"""
def default_context(relpath):
    path = './templates/'+relpath
    context = {
        'creation_date': time.ctime(os.path.getctime(path)),
        'last_modified': time.ctime(os.path.getmtime(path))
    }
    return context




# Routes the site root to homepage (index).
@app.route('/')
def main_index_route():
    return render_template('PyroNeon/index.html')

# Route main site pages
@app.route('/<path:path>')
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
def accounts_page_router(path):
    return route_page('Accounts/'+path)




# Routes PuzzleMinefield index.
@app.route('/PuzzleMinefield/')
def pmf_index_route():
    return render_template('PuzzleMinefield/index.html')

# Route PuzzleMinefield pages
@app.route('/PuzzleMinefield/<path:path>')
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
def scraps_index_route():
    return render_template('Scraps/index.html')

# Route Scraps pages
@app.route('/scraps/<path:path>')
def scraps_page_router(path):
    return route_page('Scraps/'+path)






# Route Experimental pages -- Does not have a root index page.
@app.route('/experimental/<path:path>')
def experimental_page_router(path):
    return route_page('Experimental/'+path)

# Routes MUDTool index page.
@app.route('/experimental/mudtool/')
def mudtool_index_route():
    return render_template('Experimental/mudtool/index.html')

# Routes TUMULT index page.
@app.route('/experimental/TUMULT/')
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
def musign_index_route(path):
    return render_template('muSign/index.html')

# Downloading muSign as an EXE file
@app.route('/musign/download-exe')
def download_musign_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/muSign/releases/latest/download/muSign.exe", code=302)





# Route CLIPnP index page
@app.route('/clipnp/')
def clipnp_index_route(path):
    return render_template('CLIPnP/index.html')





# Runs the program, accepting traffic from any ip address
if __name__ == "__main__":
    app.run(host="0.0.0.0")
