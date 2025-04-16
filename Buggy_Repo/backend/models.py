from pydantic import BaseModel

class Item(BaseModel):
    name: str # Meet/Changed int to str
    description: str

class User(BaseModel):
    username: str
    bio: str
    
    # You can raise your hands and give the answer to the chocolate question
    # sir i am too shy to answer