from fastapi import FastAPI
from routes.items import router as items_router
from routes.analytics import router as analytics_router
from routes.quiz import router as quiz_router
from routes.users import router as users_router # importing users router, done by divya

app = FastAPI()

app.include_router(users_router, prefix="/users") # including users router, done by divya
app.include_router(items_router, prefix="/items")
app.include_router(analytics_router, prefix="/analytics") # By Meet Added prefix for analytics
app.include_router(quiz_router, prefix="/quiz") # By meet, router for quiz added


# why the hell did I write this function?
@app.get("/home")
async def get_home():
    return {"message": "Welcome to the Multi-Page FastAPI App!"}