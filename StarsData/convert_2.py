import csv
import gzip
import json

# Справочник полных названий созвездий по кодам МАС
CONSTELLATIONS = {
    "And": "Andromeda", "Ant": "Antlia", "Aps": "Apus", "Aqr": "Aquarius", 
    "Aql": "Aquila", "Ara": "Ara", "Ari": "Aries", "Aur": "Auriga", 
    "Boo": "Boötes", "Cae": "Caelum", "Cam": "Camelopardalis", "Cnc": "Cancer", 
    "CVn": "Canes Venatici", "CMa": "Canis Major", "CMi": "Canis Minor", 
    "Cap": "Capricornus", "Car": "Carina", "Cas": "Cassiopeia", "Cen": "Centaurus", 
    "Cep": "Cepheus", "Cet": "Cetus", "Cha": "Chamaeleon", "Cir": "Circinus", 
    "Col": "Columba", "Com": "Coma Berenices", "CrA": "Corona Australis", 
    "CrB": "Corona Borealis", "Crv": "Corvus", "Crt": "Crater", "Cru": "Crux", 
    "Cyg": "Cygnus", "Del": "Delphinus", "Dor": "Dorado", "Dra": "Draco", 
    "Equ": "Equuleus", "Eri": "Eridanus", "For": "Fornax", "Gem": "Gemini", 
    "Gru": "Grus", "Her": "Hercules", "Hor": "Horologium", "Hya": "Hydra", 
    "Hyi": "Hydrus", "Ind": "Indus", "Lac": "Lacerta", "Leo": "Leo", 
    "LMi": "Leo Minor", "Lep": "Lepus", "Lib": "Libra", "Lup": "Lupus", 
    "Lyn": "Lynx", "Lyr": "Lyra", "Men": "Mensa", "Mic": "Microscopium", 
    "Mon": "Monoceros", "Mus": "Musca", "Nor": "Norma", "Oct": "Octans", 
    "Oph": "Ophiuchus", "Ori": "Orion", "Pav": "Pavo", "Peg": "Pegasus", 
    "Per": "Perseus", "Phe": "Phoenix", "Pic": "Pictor", "Psc": "Pisces", 
    "PsA": "Piscis Austrinus", "Pup": "Puppis", "Pyx": "Pyxis", "Ret": "Reticulum", 
    "Sge": "Sagitta", "Sgr": "Sagittarius", "Sco": "Scorpius", "Scl": "Sculptor", 
    "Sct": "Scutum", "Ser": "Serpens", "Sex": "Sextans", "Tau": "Taurus", 
    "Tel": "Telescopium", "Tri": "Triangulum", "TrA": "Triangulum Australe", 
    "Tuc": "Tucana", "UMa": "Ursa Major", "UMi": "Ursa Minor", "Vel": "Vela", 
    "Vir": "Virgo", "Vol": "Volans", "Vul": "Vulpecula"
}

result = []

with gzip.open('hygdata_v37.csv.gz', 'rt', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        proper = row['proper'].strip()
        con_code = row['con'].strip()
        
        # ФИЛЬТР: Берем только звезды, имеющие собственное имя (proper) 
        # и принадлежащие известному созвездию
        if proper and con_code in CONSTELLATIONS:
            full_constellation = CONSTELLATIONS[con_code]
            star_id = proper.lower().replace(" ", "_").replace("-", "_")

            try:
                dist_ly = str(round(float(row['dist']) * 3.26156, 1)) if row['dist'] else ""
            except ValueError:
                dist_ly = ""

            result.append({
                "id": star_id,
                "entity": "Star",
                "name": proper,
                "constellation": full_constellation,
                "right_ascension": round(float(row['ra']), 4) if row['ra'] else "",
                "declination": round(float(row['dec']), 4) if row['dec'] else "",
                "apparent_magnitude": str(row['mag']),
                "absolute_magnitude": str(row['absmag']),
                "distance_light_year": dist_ly,
                "spectral_class": row['spect'] if row['spect'] else ""
            })

with open('starsData.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Готово! Сохранено главных именованных звезд: {len(result)}")