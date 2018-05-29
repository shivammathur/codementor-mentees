import os
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
    while True:
        ctry = geocoder.google(i["mentee"]['time_zone_str'].split('(')[0].strip())
        if not ctry.error:
            break;
    if not ctry.country_long:
        print("no country", str(i["mentee"]['time_zone_str'].split('(')[0].strip()))
    data.append({"user": abs(hash(str(i["mentee"]['id']))), "country": ctry.country_long})

for i in se:
    ctry = None
    while True:
        ctry = geocoder.google(i["mentee"]['timezone_display'].split('(')[0].strip())
        if not ctry.error:
            break;        
    if not ctry.country_long:
        print("no country", str(i["mentee"]['timezone_display'].split('(')[0].strip()))        
    data.append({"user": abs(hash(str(i['id']))), "country": ctry.country_long})

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)