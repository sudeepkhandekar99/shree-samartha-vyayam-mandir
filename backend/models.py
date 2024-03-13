from tortoise import fields
from tortoise.models import Model
from tortoise.contrib.pydantic import pydantic_model_creator

class PersonalInfo(Model):
    id = fields.IntField(pk=True)
    registration_number = fields.CharField(max_length=100)
    name = fields.CharField(max_length=100)
    email = fields.CharField(max_length=100)
    address = fields.TextField()
    sex = fields.CharField(max_length=1)  # Add sex field with choices
    age = fields.IntField(null=True)
    date_of_birth = fields.CharField(max_length=100)
    mobile_number = fields.CharField(max_length=15)
    height = fields.CharField(max_length=15)
    weight = fields.CharField(max_length=15)
    past_registration_info = fields.TextField(null=True)
    activity = fields.CharField(max_length=15) # treat this as morning
    batch = fields.CharField(default="", max_length=15) # class 1..2...3..
    division = fields.CharField(default="", max_length=15) # based on mail and female
    fees_status = fields.BooleanField(default=False)
    
    
class SummerCamp(Model):
    id = fields.IntField(pk=True)
    personal_info = fields.ForeignKeyField("models.PersonalInfo", related_name="summer_camps")
    class_name = fields.CharField(max_length=50)
    division = fields.CharField(max_length=10)

PersonalInfo_pydantic = pydantic_model_creator(PersonalInfo, name="PersonalInfo")
PersonalInfo_request = pydantic_model_creator(PersonalInfo, name="PersonalInfoRequest", exclude_readonly=True)


class User(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50, unique=True)
    email = fields.CharField(max_length=255)
    password = fields.CharField(max_length=255)

    class Meta:
        table = "users"