import requests

def makeRequest(url):

    username = str(input("Enter your username : "))
    password = str(input("Enter your password : "))
    data = {
        'username': username,
        'password': password,
    }
    response = requests.post(url, data=data)
    return response

# res = makeRequest('http://localhost:8000/api/chat/rooms/')
res = makeRequest('http://localhost:8000/api/auth/login/')
resDict = res.json()

print(resDict['access'])

