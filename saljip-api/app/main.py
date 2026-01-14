from fastapi import FastAPI

app = FastAPI(title="살집찾기 API")

@app.get("/")
def read_root():
	return{"message": "살집찾기 백엔드 성공!"}
