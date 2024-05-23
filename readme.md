## Register user
#### POST: http://localhost:8000/auth/register
> BODY: {
  "email": "sample@gmail.com",
  "phone": "9876543210",
  "name": "sampleName",
  "password": "Password"
}

* email is optional field

## Login user
#### POST: http://localhost:8000/auth/login
> BODY: {
  //"email": "sample@gmail.com",
  "phone": "9876543210",
  "password": "password"
}

* email or phone both can be used to login

## Search user by name
#### GET: http://localhost:8080/contacts/users?name=sam

> headers: {
    token: Bearer TokenFromLogin
}

## Search user by phone
#### GET: http://localhost:8080/contacts/users?phone=9876543210

> headers: {
    token: Bearer TokenFromLogin
}

## Mark as spam
#### POST: http://localhost:8000/contacts/spam/9876543210

> headers: {
    token: Bearer TokenFromLogin
}

## User details
#### GET: http://localhost:8000/contacts/details/1d2wpx6v50e66hrv

> headers: {
    token: Bearer TokenFromLogin
}
