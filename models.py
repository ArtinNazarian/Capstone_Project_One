from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text, nullable=False, unique=True)
    username = db.Column(db.Text, nullable=False, unique=True)    
    password = db.Column(db.Text, nullable=False)

    @classmethod
    def signup(cls, username, email, password):
        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')
        user = User( username = username, email = email, password=hashed_pwd)
        db.session.add(user)
        return user
    
    @classmethod
    def authenticate(cls, username, password):
        user = cls.query.filter_by(username = username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user
        return False

def connect_db(app):
    
    db.app = app
    db.init_app(app)
        