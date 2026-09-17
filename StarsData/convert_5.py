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

def parse_float(val, round_digits=None):
    """Безопасно преобразует строку в число (float) с округлением."""
    try:
        num = float(val)
        return round(num, round_digits) if round_digits is not None else num
    except (ValueError, TypeError):
        return None

# Группируем сырые записи из CSV по кодам созвездий
constellation_stars = {code: [] for code in CONSTELLATIONS}

with gzip.open('hygdata_v37.csv.gz', 'rt', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        con_code = row['con'].strip()
        if con_code in CONSTELLATIONS:
            constellation_stars[con_code].append(row)

result = []

for con_code, stars in constellation_stars.items():
    if not stars:
        continue

    # Сортируем все звезды созвездия по видимой яркости (mag)
    stars_sorted = sorted(
        stars,
        key=lambda s: parse_float(s['mag']) if parse_float(s['mag']) is not None else 99.0
    )

    # 1. Отбираем все звезды с собственными именами
    selected_stars = [s for s in stars_sorted if s['proper'].strip()]
    
    # 2. Если звезд в созвездии меньше 3, добираем самые яркие безымянные
    if len(selected_stars) < 3:
        selected_ids = {s['id'] for s in selected_stars}
        for s in stars_sorted:
            if len(selected_stars) >= 3:
                break
            if s['id'] not in selected_ids:
                selected_stars.append(s)
                selected_ids.add(s['id'])

    # Формируем итоговые объекты для базы
    for row in selected_stars:
        proper = row['proper'].strip()
        bf = row['bf'].strip()
        hip = row['hip'].strip()

        # Формируем читаемое имя для звезды
        if proper:
            name = proper
        elif bf:
            name = bf
        elif hip:
            name = f"HIP {hip}"
        else:
            name = f"Star {row['id'].strip()}"

        full_constellation = CONSTELLATIONS[con_code]
        star_id = name.lower().replace(" ", "_").replace("-", "_")

        dist_parsecs = parse_float(row['dist'])
        dist_ly = round(dist_parsecs * 3.26156, 1) if dist_parsecs is not None else None

        result.append({
            "id": star_id,
            "entity": "Star",
            "name": name,
            "constellation": full_constellation,
            "constellation_abbr": con_code,
            "right_ascension": parse_float(row['ra'], 4),
            "declination": parse_float(row['dec'], 4),
            "apparent_magnitude": parse_float(row['mag'], 2),
            "absolute_magnitude": parse_float(row['absmag'], 2),
            "distance_light_year": dist_ly,
            "spectral_class": row['spect'].strip() if row['spect'] else ""
        })

with open('starsData.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Готово! Сохранено звезд: {len(result)}")