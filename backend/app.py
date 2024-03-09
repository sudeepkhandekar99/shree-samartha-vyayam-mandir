from fastapi import FastAPI, HTTPException
from tortoise.contrib.fastapi import register_tortoise
from models import * # Import the PersonalInfo model
from fastapi.middleware.cors import CORSMiddleware
from tortoise import Tortoise, fields
from models import User
from fastapi import FastAPI, Depends, HTTPException
from tortoise.contrib.fastapi import register_tortoise
from tortoise import Tortoise, fields
from models import User


app = FastAPI()

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)


@app.get("/")
def index():
    return {"message": "Hello, FastAPI!"}


@app.post('/personal_info/')
async def create_personal_info(payload: PersonalInfo_request):
    new_info = await PersonalInfo.create(**payload.dict())
    response  = await PersonalInfo_pydantic.from_tortoise_orm(new_info)
    return {"status": "success", "response": response}


@app.put('/personal_info/{info_id}')
async def update_personal_info(info_id: str, payload: PersonalInfo_request):
    try:
        info_instance = await PersonalInfo.get(registration_number=info_id)
        info_instance.registration_number = payload.registration_number
        info_instance.name = payload.name
        info_instance.email = payload.email
        info_instance.address = payload.address
        info_instance.sex = payload.sex
        info_instance.age = payload.age
        info_instance.date_of_birth = payload.date_of_birth
        info_instance.mobile_number = payload.mobile_number
        info_instance.height = payload.height
        info_instance.weight = payload.weight
        info_instance.past_registration_info = payload.past_registration_info
        info_instance.activity = payload.activity
        info_instance.batch = payload.batch
        info_instance.division = payload.division
        info_instance.fees_status = payload.fees_status
        await info_instance.save()

        response = await PersonalInfo_request.from_tortoise_orm(info_instance)
        return {"status": "success", "response": response}
    except PersonalInfo.DoesNotExist:
        raise HTTPException(status_code=404, detail="PersonalInfo not found")


@app.get('/personal-info/{personal_info_id}')
async def read_personal_info(personal_info_id: int):
    info = await PersonalInfo.get_or_none(registration_number=personal_info_id)
    if info is None:
        raise HTTPException(status_code=404, detail="Personal Info not found")
    return {"response": info}


@app.get('/get_all_personal_info')  
async def get_all_personal_info():
    response = await PersonalInfo_pydantic.from_queryset(PersonalInfo.all().order_by('-id'))
    return {"status": "success", "response": response}


@app.get('/get_all_unpaid_personal_info')
async def get_all_unpaid_personal_info():
    response = await PersonalInfo_pydantic.from_queryset(
        PersonalInfo.filter(fees_status=False).order_by('-id').all()
    )
    return {"status": "success", "response": response}


@app.post("/login")
async def login(username: str, password: str):
    user = await User.filter(username=username, password=password).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful"}


@app.get("/users")
async def get_users():
    users = await User.all()
    return users


@app.post("/users")
async def create_user(name: str, email: str, password: str):
    user = await User.create(name=name, email=email, password=password)
    return {"message": "User added successfully"}


@app.put('/update_fees_status/{personal_info_id}')
async def update_fees_status(personal_info_id: int):
    personal_info = await PersonalInfo.get_or_none(registration_number=personal_info_id)
    if personal_info is None:
        raise HTTPException(status_code=404, detail="Personal Info not found")
    personal_info.fees_status = True
    await personal_info.save()
    updated_personal_info = await PersonalInfo_pydantic.from_tortoise_orm(personal_info)
    return {"status": "success", "updated_info": updated_personal_info}


def determine_class_and_division(age: int, sex: str) -> tuple:
    if age >= 16:
        class_ = "Class 1"
    elif 14 <= age < 16:
        class_ = "Class 2"
    elif 11 <= age < 14:
        class_ = "Class 3"
    elif 9 <= age < 11:
        class_ = "Class 4"
    elif 7 <= age < 9:
        class_ = "Class 5"
    elif 6 <= age < 7:
        class_ = "Class 6"
    else:
        class_ = "Class 7"

    division = "A" if sex == "M" else "B" if sex == "F" else None

    return class_, division


@app.get("/paid_students")
async def get_paid_students():
    paid_students = await PersonalInfo.filter(fees_status=True).values(
        "id", "first_name", "last_name", "age", "sex", "mobile_number"
    )
    paid_students_data = []
    for student in paid_students:
        class_, division = determine_class_and_division(student.get("age", 0), student.get("sex", ""))
        if class_:
            student_data = {
                "id": student.get("id"),
                "first_name": student.get("first_name"),
                "last_name": student.get("last_name"),
                "class": class_,
                "division": division,
                "phone_number": student.get("mobile_number")
            }
            paid_students_data.append(student_data)
    
    return {"status": "success", "paid_students": paid_students_data}


register_tortoise(
    app,
    db_url="sqlite://database.sqlite3",
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True
)