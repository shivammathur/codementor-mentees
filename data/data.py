import json
import time
import geocoder

# Offline help data
with open('oh.json', encoding="utf-8-sig") as data_file:
    oh = json.load(data_file)

# Session data
with open('se.json', encoding="utf-8-sig") as data_file:    
    se = json.load(data_file)    

data = []

for i in oh:
	ctry = None
	while(ctry is None):
		ctry = geocoder.google(i["mentee"]['time_zone_str'].split('(')[0].strip()).country_long
	data.append({"user": abs(hash(str(i["mentee"]['id']))), "country": ctry})

for i in se:
	ctry = None
	while(ctry is None):
		ctry =geocoder.google(i["mentee"]['timezone_display'].split('(')[0].strip()).country_long
	data.append({"user": abs(hash(str(i['id']))), "country": ctry})

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)