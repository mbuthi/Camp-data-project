# from . import models, schemas
import models

import schemas

from sqlalchemy.orm import Session

import bcrypt

def gen_hash_passwd(passwd : str) -> str:
    """generated a password hash"""
    return bcrypt.hashpw(passwd.encode("utf-8"), bcrypt.gensalt(12)).decode("utf-8")

def check_hashed_password(passwd : str, hashed_passwd : str) -> bool:
    """checks the password hash"""
    return bcrypt.checkpw(passwd.encode("utf-8"), hashed_passwd.encode("utf-8"))

def get_user_by_id(db: Session, user_id : int):
    """Get\'s user data based on the user id"""
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user : schemas.UserCreate):
    """creates a user in the database"""    
    hashed_passwd = gen_hash_passwd(user.password)
    db_user = models.User(
        first_name=user.first_name.title(),
        last_name=user.last_name.title(),
        email=user.email.lower(),
        password=hashed_passwd
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db : Session, email : str):
    """Gets a user based on their email"""
    return db.query(models.User).filter(models.User.email == email).first()


def get_current_row(db : Session,):
    r = db.query(models.RowNumber).first()
    print(r)
    return r

def update_row(db : Session):
    row = db.query(models.RowNumber).first()
    row.row += 1
    db.commit()
    db.refresh(row)

def add_row(db : Session, row : schemas.Row):
    db_row = models.RowNumber(
        **row.dict()
    )
    db.add(db_row)
    db.commit()
    db.refresh(db_row)
    
def add_row_links(db: Session, data : schemas.AccessionLink):
    db_row = models.AccessionLink(
        **data.dict()
    )
    db.add(db_row)
    db.commit()
    db.refresh(db_row)
    
def update_row_links(db: Session, data : schemas.AccessionLink):
    to_update = db.query(models.AccessionLink).first()
    if data.accession != "":
        to_update.accession = data.accession
    if data.google_sheet_link != "":
        to_update.google_sheet_link = data.google_sheet_link
    db.commit()
    db.refresh(to_update)

def increment_accession(db : Session):
    to_increment = db.query(models.AccessionLink).first()
    to_increment.accession += 1    
    db.commit()
    db.refresh(to_increment)

def get_access_link(db : Session):
    data = db.query(models.AccessionLink).first()
    return data
    
    



