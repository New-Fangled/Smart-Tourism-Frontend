from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class GoogleAuth(BaseModel):
    code: str
    scope: Optional[str] = None

# Helper functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Routes
@app.post("/auth/register")
async def register(user: UserCreate):
    # Here you would typically:
    # 1. Check if user exists
    # 2. Hash the password
    # 3. Save to database
    # For demo, we'll just return success
    return {
        "message": "Registration successful",
        "user": {"email": user.email, "name": user.name}
    }

@app.post("/auth/login")
async def login(user: UserLogin):
    # Here you would typically:
    # 1. Verify credentials against database
    # 2. Create access token
    access_token = create_access_token({"sub": user.email})
    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"email": user.email}
    }

@app.get("/auth/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    return {"currentUser": {"email": payload["sub"]}}

@app.post("/auth/google")
async def google_auth(auth_data: GoogleAuth):
    try:
        # Here you would:
        # 1. Verify the Google token
        # 2. Get user info from Google
        # 3. Create or update user in your database
        # 4. Create access token
        
        # For demo, we'll just return success
        return {
            "message": "Google authentication successful",
            "user": {
                "email": "google_user@example.com",
                "name": "Google User"
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate Google credentials"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)