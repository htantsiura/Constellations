import json

# Справочник официальных данных МАС для созвездий:
# [Код МАС, Площадь в кв. градусах, Центр RA (часы), Центр Dec (градусы)]
CONSTELLATION_INFO = {
    "Andromeda": {"abbr": "And", "square": 722.3, "ra": 0.8, "dec": 37.4},
    "Antlia": {"abbr": "Ant", "square": 238.9, "ra": 10.2, "dec": -32.5},
    "Apus": {"abbr": "Aps", "square": 206.3, "ra": 16.1, "dec": -75.3},
    "Aquarius": {"abbr": "Aqr", "square": 980.0, "ra": 22.3, "dec": -10.8},
    "Aquila": {"abbr": "Aql", "square": 652.5, "ra": 19.7, "dec": 3.4},
    "Ara": {"abbr": "Ara", "square": 237.1, "ra": 17.4, "dec": -53.6},
    "Aries": {"abbr": "Ari", "square": 441.4, "ra": 2.6, "dec": 20.8},
    "Auriga": {"abbr": "Aur", "square": 657.4, "ra": 6.0, "dec": 42.0},
    "Boötes": {"abbr": "Boo", "square": 906.8, "ra": 14.7, "dec": 31.2},
    "Caelum": {"abbr": "Cae", "square": 125.0, "ra": 4.7, "dec": -37.9},
    "Camelopardalis": {"abbr": "Cam", "square": 756.8, "ra": 6.1, "dec": 70.0},
    "Cancer": {"abbr": "Cnc", "square": 505.9, "ra": 8.6, "dec": 19.8},
    "Canes Venatici": {"abbr": "CVn", "square": 465.2, "ra": 13.1, "dec": 40.1},
    "Canis Major": {"abbr": "CMa", "square": 380.1, "ra": 6.8, "dec": -22.1},
    "Canis Minor": {"abbr": "CMi", "square": 183.4, "ra": 7.7, "dec": 6.4},
    "Capricornus": {"abbr": "Cap", "square": 413.9, "ra": 21.0, "dec": -18.0},
    "Carina": {"abbr": "Car", "square": 494.2, "ra": 8.7, "dec": -63.2},
    "Cassiopeia": {"abbr": "Cas", "square": 598.4, "ra": 1.3, "dec": 62.2},
    "Centaurus": {"abbr": "Cen", "square": 1060.4, "ra": 13.4, "dec": -47.4},
    "Cepheus": {"abbr": "Cep", "square": 587.8, "ra": 22.0, "dec": 71.0},
    "Cetus": {"abbr": "Cet", "square": 1231.4, "ra": 1.7, "dec": -11.4},
    "Chamaeleon": {"abbr": "Cha", "square": 131.6, "ra": 11.1, "dec": -79.4},
    "Circinus": {"abbr": "Cir", "square": 93.4, "ra": 14.8, "dec": -63.1},
    "Columba": {"abbr": "Col", "square": 270.2, "ra": 5.9, "dec": -35.1},
    "Coma Berenices": {"abbr": "Com", "square": 386.5, "ra": 12.8, "dec": 23.3},
    "Corona Australis": {"abbr": "CrA", "square": 127.7, "ra": 18.6, "dec": -41.8},
    "Corona Borealis": {"abbr": "CrB", "square": 178.7, "ra": 15.8, "dec": 32.6},
    "Corvus": {"abbr": "Crv", "square": 183.8, "ra": 12.4, "dec": -18.4},
    "Crater": {"abbr": "Crt", "square": 282.4, "ra": 11.4, "dec": -15.9},
    "Crux": {"abbr": "Cru", "square": 68.4, "ra": 12.4, "dec": -60.2},
    "Cygnus": {"abbr": "Cyg", "square": 804.0, "ra": 20.6, "dec": 44.5},
    "Delphinus": {"abbr": "Del", "square": 188.5, "ra": 20.7, "dec": 11.7},
    "Dorado": {"abbr": "Dor", "square": 179.2, "ra": 5.2, "dec": -59.7},
    "Draco": {"abbr": "Dra", "square": 1083.0, "ra": 15.1, "dec": 67.0},
    "Equuleus": {"abbr": "Equ", "square": 71.6, "ra": 21.2, "dec": 7.8},
    "Eridanus": {"abbr": "Eri", "square": 1137.9, "ra": 3.5, "dec": -28.8},
    "Fornax": {"abbr": "For", "square": 397.5, "ra": 2.8, "dec": -31.6},
    "Gemini": {"abbr": "Gem", "square": 513.8, "ra": 7.1, "dec": 22.6},
    "Grus": {"abbr": "Gru", "square": 365.5, "ra": 22.5, "dec": -46.4},
    "Hercules": {"abbr": "Her", "square": 1225.1, "ra": 17.4, "dec": 27.5},
    "Horologium": {"abbr": "Hor", "square": 248.9, "ra": 3.3, "dec": -51.3},
    "Hydra": {"abbr": "Hya", "square": 1302.8, "ra": 10.6, "dec": -14.5},
    "Hydrus": {"abbr": "Hyi", "square": 243.0, "ra": 2.4, "dec": -69.9},
    "Indus": {"abbr": "Ind", "square": 294.0, "ra": 20.6, "dec": -54.6},
    "Lacerta": {"abbr": "Lac", "square": 200.7, "ra": 22.5, "dec": 46.0},
    "Leo": {"abbr": "Leo", "square": 947.0, "ra": 10.7, "dec": 13.1},
    "Leo Minor": {"abbr": "LMi", "square": 232.0, "ra": 10.2, "dec": 32.2},
    "Lepus": {"abbr": "Lep", "square": 290.3, "ra": 5.6, "dec": -19.0},
    "Libra": {"abbr": "Lib", "square": 538.1, "ra": 15.2, "dec": -15.6},
    "Lupus": {"abbr": "Lup", "square": 333.7, "ra": 15.2, "dec": -42.7},
    "Lynx": {"abbr": "Lyn", "square": 545.4, "ra": 8.0, "dec": 47.5},
    "Lyra": {"abbr": "Lyr", "square": 286.5, "ra": 18.9, "dec": 36.7},
    "Mensa": {"abbr": "Men", "square": 153.5, "ra": 5.4, "dec": -77.5},
    "Microscopium": {"abbr": "Mic", "square": 210.0, "ra": 20.8, "dec": -36.3},
    "Monoceros": {"abbr": "Mon", "square": 481.6, "ra": 7.1, "dec": -3.3},
    "Musca": {"abbr": "Mus", "square": 138.4, "ra": 12.5, "dec": -70.2},
    "Norma": {"abbr": "Nor", "square": 165.2, "ra": 16.1, "dec": -51.0},
    "Octans": {"abbr": "Oct", "square": 291.0, "ra": 23.0, "dec": -82.2},
    "Ophiuchus": {"abbr": "Oph", "square": 948.3, "ra": 17.4, "dec": -4.4},
    "Orion": {"abbr": "Ori", "square": 594.1, "ra": 5.6, "dec": 5.4},
    "Pavo": {"abbr": "Pav", "square": 377.7, "ra": 19.6, "dec": -65.8},
    "Pegasus": {"abbr": "Peg", "square": 1121.0, "ra": 22.7, "dec": 19.5},
    "Perseus": {"abbr": "Per", "square": 615.0, "ra": 3.2, "dec": 45.0},
    "Phoenix": {"abbr": "Phe", "square": 469.3, "ra": 0.4, "dec": -48.6},
    "Pictor": {"abbr": "Pic", "square": 246.7, "ra": 5.8, "dec": -53.5},
    "Pisces": {"abbr": "Psc", "square": 889.4, "ra": 0.5, "dec": 13.7},
    "Piscis Austrinus": {"abbr": "PsA", "square": 245.0, "ra": 22.3, "dec": -30.6},
    "Puppis": {"abbr": "Pup", "square": 673.4, "ra": 7.3, "dec": -31.2},
    "Pyxis": {"abbr": "Pyx", "square": 220.8, "ra": 8.9, "dec": -27.4},
    "Reticulum": {"abbr": "Ret", "square": 113.9, "ra": 3.9, "dec": -59.9},
    "Sagitta": {"abbr": "Sge", "square": 79.9, "ra": 19.7, "dec": 18.9},
    "Sagittarius": {"abbr": "Sgr", "square": 867.4, "ra": 19.1, "dec": -28.5},
    "Scorpius": {"abbr": "Sco", "square": 496.8, "ra": 16.9, "dec": -30.7},
    "Sculptor": {"abbr": "Scl", "square": 475.0, "ra": 0.1, "dec": -32.1},
    "Scutum": {"abbr": "Sct", "square": 109.1, "ra": 18.7, "dec": -9.9},
    "Serpens": {"abbr": "Ser", "square": 636.9, "ra": 17.0, "dec": 6.0},
    "Sextans": {"abbr": "Sex", "square": 313.5, "ra": 10.2, "dec": -2.6},
    "Taurus": {"abbr": "Tau", "square": 797.2, "ra": 4.7, "dec": 14.9},
    "Telescopium": {"abbr": "Tel", "square": 251.5, "ra": 19.3, "dec": -51.0},
    "Triangulum": {"abbr": "Tri", "square": 131.9, "ra": 2.2, "dec": 31.4},
    "Triangulum Australe": {"abbr": "TrA", "square": 110.0, "ra": 16.1, "dec": -65.4},
    "Tucana": {"abbr": "Tuc", "square": 294.6, "ra": 23.8, "dec": -65.7},
    "Ursa Major": {"abbr": "UMa", "square": 1279.7, "ra": 11.3, "dec": 55.6},
    "Ursa Minor": {"abbr": "UMi", "square": 255.9, "ra": 15.0, "dec": 78.0},
    "Vela": {"abbr": "Vel", "square": 499.6, "ra": 9.6, "dec": -47.2},
    "Virgo": {"abbr": "Vir", "square": 1294.4, "ra": 13.4, "dec": -4.2},
    "Volans": {"abbr": "Vol", "square": 141.4, "ra": 7.8, "dec": -69.8},
    "Vulpecula": {"abbr": "Vul", "square": 268.2, "ra": 20.2, "dec": 24.4}
}

# 1. Загружаем сохраненные звезды из файла starsData.json
try:
    with open('starsData.json', 'r', encoding='utf-8') as f:
        stars_data = json.load(f)
except FileNotFoundError:
    print("Ошибка: Файл starsData.json не найден в текущей папке!")
    exit()

# 2. Группируем звезды по созвездиям
stars_by_constellation = {}
for star in stars_data:
    con_name = star.get('constellation')
    if con_name:
        if con_name not in stars_by_constellation:
            stars_by_constellation[con_name] = []
        stars_by_constellation[con_name].append(star)

constellations_result = []

# 3. Формируем итоговые объекты созвездий
for name, meta in CONSTELLATION_INFO.items():
    con_stars = stars_by_constellation.get(name, [])
    
    # Сортируем звезды созвездия по видимой звездной величине (самая яркая — первая)
    con_stars_sorted = sorted(
        con_stars, 
        key=lambda s: s['apparent_magnitude'] if s['apparent_magnitude'] is not None else 99.0
    )
    
    brightest_star = con_stars_sorted[0]['name'] if con_stars_sorted else ""
    list_of_main_stars = [s['id'] for s in con_stars]
    
    con_id = name.lower().replace(" ", "_").replace("ö", "o")
    
    constellations_result.append({
        "id": con_id,
        "entity": "Constellation",
        "name": name,
        "constellation_abbr": meta["abbr"],
        "right_ascension": meta["ra"],
        "declination": meta["dec"],
        "square": meta["square"],
        "main_stars_qty": len(list_of_main_stars),
        "brightest_star": brightest_star,
        "list_of_main_stars": list_of_main_stars
    })

# 4. Сохраняем результат в файл constellationsData.json
with open('constellationsData.json', 'w', encoding='utf-8') as f:
    json.dump(constellations_result, f, ensure_ascii=False, indent=2)

print(f"Готово! Сформирована базовая база для {len(constellations_result)} созвездий в constellationsData.json")