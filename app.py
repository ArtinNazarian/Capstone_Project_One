import os
from flask import Flask, render_template, request, flash, redirect, session, g
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User
from forms import CreateUserForm, LoginForm, UserEditForm
from sqlalchemy.exc import IntegrityError

CURR_USER_KEY = "curr_user"

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = (os.environ.get('DATABASE_URL', 'postgresql:///recipe_db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
toolbar = DebugToolbarExtension(app)

connect_db(app)
app.app_context().push()

@app.before_request
def add_user_to_g():
    #If the user is logged in, add the user to g object
    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None

@app.route('/')
def homepage():
    if g.user:
        return render_template('home.html')
    else:
        return render_template('index.html')

@app.route('/register', methods=["GET", "POST"])
def register():
    form = CreateUserForm()

    if form.validate_on_submit():
        try:
            username = form.username.data
            email = form.email.data
            password = form.password.data            
            user = User.signup(username=username, email=email, password=password)
            db.session.commit()
        except IntegrityError as e:
            flash("The username is not avilable")
            return render_template('register.html', form=form)
        
        do_login(user)
        return render_template('home.html')
    else:
        return render_template('/register.html', form=form)



@app.route('/login', methods=["GET", "POST"])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)

        if user:
            do_login(user)
            return redirect('/')
        flash("Invalid username and/or passowrd")
    return render_template('login.html', form=form)


@app.route('/edit_profile', methods=["GET", "POST"])
def profile():
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    
    user = g.user
    form = UserEditForm(obj=user)
    if form.validate_on_submit():
        if User.authenticate(user.username, form.password.data):
            user.username = form.username.data
            user.email = form.email.data

            db.session.commit()
            return redirect('/')
        flash("Incorrect password. Try again")
    return render_template('edit_profile.html', form=form, user_id=user.id)

@app.route('/favorites', methods=["GET", "POST"])
def show_favorites():
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    
    return render_template ('favorites.html')


@app.route('/logout')
def logout():
    do_logout()

    flash("Goodbye")
    return redirect('/')

def do_logout():
    
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

def do_login(user):

    session[CURR_USER_KEY] = user.id


