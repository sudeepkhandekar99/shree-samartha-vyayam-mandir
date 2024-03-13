from fastapi import FastAPI, HTTPException
from tortoise.contrib.fastapi import register_tortoise
from models import * # Import the PersonalInfo model
from fastapi.middleware.cors import CORSMiddleware
from tortoise import Tortoise, fields
from models import User
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import StreamingResponse
from tortoise.contrib.fastapi import register_tortoise
from tortoise import Tortoise, fields
from models import User
from googletrans import Translator
import pandas as pd
from io import BytesIO
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from PIL import Image, ImageDraw, ImageFont




app = FastAPI()
router = APIRouter()

translator = Translator()

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
    age = payload.age
    if age >= 16:
        payload.batch = "Class 1"
    elif 14 <= age < 16:
        payload.batch = "Class 2"
    elif 11 <= age < 14:
        payload.batch = "Class 3"
    elif 9 <= age < 11:
        payload.batch = "Class 4"
    elif 7 <= age < 9:
        payload.batch = "Class 5"
    elif 6 <= age < 7:
        payload.batch = "Class 6"
    else:
        payload.batch = "Class 7"
    total = await PersonalInfo.all().count() 
    payload.activity = "Morning" if total <=150 else "Evening"
    payload.division = "A" if payload.sex == 'M' else "B"
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

@app.get('/download_personal-info/{status}')
async def download_personal_info(status: str):
    if status == "unpaid":
        data = await PersonalInfo_pydantic.from_queryset(
            PersonalInfo.filter(fees_status=False).order_by('-id')
        )
    elif status == "paid":
        data = await PersonalInfo_pydantic.from_queryset(
            PersonalInfo.filter(fees_status=True).order_by('-id')
        )
    else:
        data = await PersonalInfo_pydantic.from_queryset(
            PersonalInfo.all().order_by('-id')
        )

    # Convert data to a list of dictionaries
    data_dicts = [dict(item) for item in data]

    # Convert data to pandas DataFrame
    df = pd.DataFrame(data_dicts)

    df[['registration_number', 'mobile_number']] = df[['registration_number', 'mobile_number']].astype(str)

    # Convert DataFrame to CSV format
    csv_data = df.to_csv(index=False, encoding='utf-8-sig')

    # Return StreamingResponse with CSV content
    return StreamingResponse(
        content=csv_data,
        media_type='text/csv',
        headers={'Content-Disposition': f'attachment; filename=personal_info_{status}.csv'}
    )


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


register_tortoise(
    app,
    db_url="sqlite://database.sqlite3",
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True
)

@app.get('/download_student_id_card/{registration_number}')
async def download_student_id_card(registration_number: str):
    # Fetch user data based on the registration number
    user_data = await PersonalInfo_pydantic.from_queryset(
        PersonalInfo.filter(registration_number=registration_number)
    )

    if not user_data:
        # Handle the case when the user is not found
        return JSONResponse(content={"error": "User not found"}, status_code=404)

    # Create an image for the ID card
    image = create_id_card_image(user_data[0])

    # Save the image to a BytesIO buffer
    image_buffer = BytesIO()
    image.save(image_buffer, format="PNG")
    image_buffer.seek(0)

    # Return StreamingResponse with the image content
    return StreamingResponse(
        content=image_buffer,
        media_type='image/png',
        headers={'Content-Disposition': f'attachment; filename=id_card_{registration_number}.png'}
    )

def create_id_card_image(user_data):
    # Create a blank image
    image = Image.new('RGB', (640, 480), color='white')
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()

    # Draw user data on the image
    draw.text((10, 10), f"Name: {user_data.name}", fill='black', font=font)
    draw.text((10, 30), f"Registration Number: {user_data.registration_number}", fill='black', font=font)
    # Add more fields as needed

    return image