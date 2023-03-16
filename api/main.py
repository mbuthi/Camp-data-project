from fastapi import FastAPI, Depends, HTTPException, status

import models

import cruds

import schemas

from database import engine, SessionLocal

from sqlalchemy.orm import Session

import sheets

import datetime

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from jose import JWTError, jwt

from dotenv import load_dotenv

import os

from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from search import do_search, configure_google_sheet

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

SECRET_KEY=os.getenv("SECRET_KEY")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 180

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# origins = [    
#     "https://campdata2022.netlify.app/"
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
                


def create_access_token(data: dict, expires_delta: datetime.timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db : Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = cruds.get_user_by_email(db , email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):    
    return current_user 
    
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(user : schemas.UserLogin, db : Session = Depends(get_db)):
    user_ = cruds.get_user_by_email(db=db, email=user.email.lower())
    if not user_:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not cruds.check_hashed_password(user.password, user_.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password or email",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email.lower()}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}  


@app.get("/user/me", response_model=schemas.User)  
def read_user(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user

@app.post("/api/v1/user", response_model=schemas.User)
async def create_user(user : schemas.UserCreate, db : Session = Depends(get_db)):    
    exists = cruds.get_user_by_email(db, user.email.lower())
    if exists:
        return HTTPException(status_code=400, detail=f"user with email {user.email.lower()} exits")    
    return cruds.create_user(db=db, user=user)

@app.get("/api/v1/user/{user_id}", response_model=schemas.User)
async def read_user(user_id : int, db : Session = Depends(get_db)):
    usr = cruds.get_user_by_id(db=db, user_id=user_id)
    return usr


@app.post("/api/v1/data")
async def send_data(camp_data : schemas.DataCreate, current_user : schemas.User = Depends(get_current_user), db : Session = Depends(get_db)):
    data = cruds.get_access_link(db=db)    
    if not data:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="accession number and google sheet link missing!"
        )
    
    row = data.accession
    wk_sheet = sheets.configure_google_sheet(url=data.google_sheet_link)
    
    today = datetime.datetime.now()
    f_r_date  = today.strftime("%d/%m/%Y")
    localnames = " ".join(camp_data.localName)
    full_name = current_user.first_name + " " + current_user.last_name    
    to_send = [
        row ,camp_data.family, camp_data.genus, camp_data.species, 
        camp_data.authority, localnames, camp_data.language,
        "Not recorded", "Not recorded", "", "1", "Card", "Text", camp_data.country,
        full_name, f_r_date, 
    ]
    res = sheets.append_data(data=to_send, worksheet=wk_sheet)
    cruds.increment_accession(db=db)
    if res != True:
        return HTTPException(
            status_code=400, detail=res
        )    
    return {"detail" : "Camp Data sent successfully!"}

@app.get("/api/v1/search/{item}")    
async def search_item(item : int, db : Session = Depends(get_db)):
    row_sheetlink = cruds.get_access_link(db=db)
    if not row_sheetlink:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="accession number and google sheet link missing!" 
        )
    wk_sheet = configure_google_sheet(row_sheetlink.google_sheet_link)
    data = do_search(item, wk_sheet)    
    return data

@app.put("/api/v1/accession")
async def update_accession(data:schemas.AccessionLink, db : Session = Depends(get_db), ):
    cruds.update_row_links(db=db, data=data)
    return {"detail" : "Data updated successfully!"}

@app.post("/api/v1/accession")
async def add_accession_link(data : schemas.AccessionLink, db : Session = Depends(get_db)):
    cruds.add_row_links(db=db, data=data)
    return {"detail" : "Data added successfully!"}

@app.get("/api/v1/accession", response_model=schemas.AccessionLink)
async def get_accession_link(db: Session = Depends(get_db)):
    data = cruds.get_access_link(db=db)      
    if data:          
        return {
            "accession": data.accession,    
            "google_sheet_link": data.google_sheet_link
        }
    else:        
        return {
            "accession": 0,    
            "google_sheet_link": ""
        }
    
    