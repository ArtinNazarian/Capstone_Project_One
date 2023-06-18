import os
from unittest import TestCase
from sqlalchemy import exc

from models import db, User

os.environ['DATABASE_URL'] = "postgresql:///recipe_test"

from app import app

db.create_all()

app.config['WTF_CSRF_ENAABLED']=False

class RecipeViewTestCase(TestCase):    

    def test_login_form(self):
        with app.test_client() as client:
            res = client.get('/login')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('<h1 class="title-heading">Login</h1>', html)

    def test_signup_form(self):
        with app.test_client() as client:
            res = client.get('/register')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('<h1 class="title-heading">Create an Account</h1>', html)

  