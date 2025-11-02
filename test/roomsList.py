import requests

def makeRequest(url):
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYwNzAyNDA0LCJpYXQiOjE3NjA2MTYwMDQsImp0aSI6IjI2NjE1OGY5ZmU4ZjQwMWE4ZDQ5ODE3NDEyNmM0NjBlIiwidXNlcl9pZCI6ImZlY2RlZWE1LWJlMTctNGIyOS1hOWU5LTRkYTE0ZTVlNTg2YiJ9.DjWwiSM2FPhb4KMw2hHB638HwH_YbEh3639a-pRiD7Y'
        }
    response = requests.get(url, headers=headers)
    return response

res = makeRequest('http://localhost:8000/api/chat/rooms/')

print(res.json())

