import requests

def makeRequest(url):
    data = {
        'username': 'AdminKevo',
        'password': 'Moneey62',
    }
    response = requests.post(url, data=data)
    return response

# res = makeRequest('http://localhost:8000/api/chat/rooms/')
res = makeRequest('http://localhost:8000/api/auth/login/')
resDict = res.json()

print(resDict['access'])

