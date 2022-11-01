# Handles serving html files and other content
from flask import Flask, send_file, render_template, redirect
app = Flask(__name__)

# Homepage for the entire website.
@app.route('/')
def home():
    return render_template('PyroNeon/index.html')

# Showcase for all the products provided by PN
@app.route('/products')
def products():
    return render_template('PyroNeon/products.html')

# Contacts / Social links page for the company
@app.route('/community')
def community():
    return render_template('PyroNeon/community.html')

# Directs to the 404 page.
@app.route('/missing')
def missingpage():
    return render_template('PyroNeon/404.html')











# Landing page for the Puzzle Minefield game
@app.route('/PuzzleMinefield')
def puzzleMinefield():
    return render_template('PuzzleMinefield/index.html')

# Puzzle Minefield's downloads page
@app.route('/PuzzleMinefield/downloads')
def puzzleMinefieldDownloads():
    return render_template('PuzzleMinefield/downloads.html')

# Contacts and social links for Puzzle Minefield
@app.route('/PuzzleMinefield/community')
def puzzleMinefieldCommunity():
    return render_template('PuzzleMinefield/community.html')

# Frequently Asked Questions about Puzzle Minefield
@app.route('/PuzzleMinefield/FAQ')
def puzzleMinefieldFAQ():
    return render_template('PuzzleMinefield/faq.html')

# Downloading Puzzle Minefield as a JAR file
@app.route('/PuzzleMinefield/download-jar')
def download_jar():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/PuzzleMinefield-Releases/releases/latest/download/PuzzleMinefield.jar", code=302)

# Downloading Puzzle Minefield as an EXE file
@app.route('/PuzzleMinefield/download-exe')
def download_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/PuzzleMinefield-Releases/releases/latest/download/PuzzleMinefield.exe", code=302)







# Landing page for CLIPnP
@app.route('/clipnp')
def clipnp():
    return render_template('CLIPnP/index.html')








# Landing page for CLIPnP
@app.route('/scraps')
def scraps():
    return render_template('Scraps/index.html')

# Landing page for CLIPnP
@app.route('/scraps/join')
def scrapsJoin():
    return render_template('Scraps/join.html')

# Landing page for CLIPnP
@app.route('/scraps/community')
def scrapsCommunity():
    return render_template('Scraps/community.html')

# Landing page for CLIPnP
@app.route('/scraps/guide')
def scrapsGuide():
    return render_template('Scraps/guide.html')



@app.route('/accounts')
def accountsHomepage():
    return redirect("/accounts/account-dashboard", code=302)

# Register for a new PN account
@app.route('/accounts/register')
def registerAccount():
    return render_template('Accounts/register.html')

@app.route('/accounts/email/account-created-success')
def createdAccountSuccessfully():
    return render_template('Accounts/email/account-created-success.html')

@app.route('/accounts/email/activate')
def activateEmailAddress():
    return render_template('Accounts/email/activate-email-address.html')

@app.route('/accounts/email/resend-email-code')
def resendEmailCode():
    return render_template('Accounts/email/resend-confirmation-code.html')

@app.route('/accounts/email/enter-manual-confirmation-code')
def enterManualConfirmationCode():
    return render_template('Accounts/email/enter-manual-confirmation-code.html')

@app.route('/accounts/login')
def login():
    return render_template('Accounts/login.html')

@app.route('/accounts/account-dashboard')
def accountDashboard():
    return render_template('Accounts/account-dashboard.html')

@app.route('/accounts/update/delete-account')
def deleteAccount():
    return render_template('Accounts/updates/delete-account.html')

@app.route('/accounts/update/change-username')
def changeUsername():
    return render_template('Accounts/updates/change-username.html')

@app.route('/accounts/update/change-password')
def changePassword():
    return render_template('Accounts/updates/change-password.html')

@app.route('/accounts/update/change-email-address')
def changeEmailAddress():
    return render_template('Accounts/updates/change-email-address.html')




# Handles users entering a wrong link or other 404 errors.
@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('PyroNeon/404.html'), 404

# Registers the 404 error handler
app.register_error_handler(404, page_not_found)

# Runs the program, accepting traffic from any ip address
if __name__ == "__main__":
    app.run(host="0.0.0.0")
