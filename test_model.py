import os
from unittest import TestCase
from sqlalchemy import exc

from models import db, User

os.environ['DATABASE_URL'] = "postgresql:///recipe_test"

from app import app

db.create_all()

class UserModelTest(TestCase):

    def setUp(self):
        db.drop_all()
        db.create_all()

        u1 = User.signup("testUser1", "testUser1.gmail.com", "pass123")
        uid1 = 50
        u1.id = uid1

        db.session.commit()
       

        u1=User.query.get(uid1)

        self.u1 = u1
        self.uid1 = uid1

        self.client = app.test_client()

    def tearDown(self):
        res = super().tearDown()
        db.session.rollback()
        return res
    
    def test_signup(self):
        test_user = User.signup("samthebaker", "samthebaker@gmail.com", "password")
        user_id = 1002
        test_user.id = user_id
        db.session.commit()

        test_user = User.query.get(user_id)
        self.assertIsNotNone(test_user)
        self.assertEqual(test_user.username,'samthebaker')
        self.assertEqual(test_user.email,'samthebaker@gmail.com')
        self.assertNotEqual(test_user.password,"askdfla")

    def test_invalid_username(self):
        invalid_user = User.signup(None, 'joey77@yahoo.com', 'password')
        user_id = 1003
        invalid_user.id = user_id
        
        with self.assertRaises(exc.IntegrityError) as context:
            db.session.commit()



        

       