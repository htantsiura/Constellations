import csv
import gzip
import json

result = []

# Читаем файл .gz напрямую встроенной библиотекой
with gzip.open('hygdata_v37.csv.gz', 'rt', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            mag = float(row['mag']) if row['mag'] else 99.0
        except ValueError:
            mag = 99.0
            
        con = row['con']
        
        # Фильтруем: только звезды ярче 6.0m с зафиксированным созвездием
        if mag <= 6.0 and con:
            proper = row['proper'].strip()
            hip = row['hip'].strip()
            
            # Генерация ID и названия
            if proper:
                star_id = proper.lower().replace(" ", "_")
                name = proper
            elif hip:
                star_id = f"hip_{hip}"
                name = f"HIP {hip}"
            else:
                star_id = f"hyg_{row['id']}"
                name = f"HYG {row['id']}"
                
            # Перевод расстояния из парсеков в световые года
            try:
                dist_ly = str(round(float(row['dist']) * 3.26156, 1)) if row['dist'] else ""
            except ValueError:
                dist_ly = ""

            result.append({
                "id": star_id,
                "entity": "Star",
                "name": name,
                "constellation": con,
                "right_ascension": round(float(row['ra']), 4) if row['ra'] else "",
                "declination": round(float(row['dec']), 4) if row['dec'] else "",
                "apparent_magnitude": str(row['mag']),
                "absolute_magnitude": str(row['absmag']),
                "distance_light_year": dist_ly,
                "spectral_class": row['spect'] if row['spect'] else ""
            })

# Сохраняем итоговый JSON
with open('starsData.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Успешно! Обработано и сохранено звезд: {len(result)}")