import json
import geocoder

# Offline help data
with open('oh.json') as data_file:
    oh = json.load(data_file)

# Session data
with open('se.json') as data_file:    
    se = json.load(data_file)    

data = []

for i in oh:
	data.append({"user": abs(hash(str(i["mentee"]['id']))), "country": geocoder.google(i["mentee"]['time_zone_str'].split('(')[0].strip()).country_long})

for i in se:
	data.append({"user": abs(hash(str(i['id']))), "country": geocoder.google(i["mentee"]['timezone_display'].split('(')[0].strip()).country_long})

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)