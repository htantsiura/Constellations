import json


def update_constellation_avg_distances(
    stars_file="StarsData1_2.json",
    constellations_file="ConstellationData1.json",
    output_file="ConstellationData1.json",
):
    # 1. Читаем данные о звездах
    with open(stars_file, "r", encoding="utf-8") as f:
        stars_data = json.load(f)

    # Группируем расстояния звезд по созвездиям
    constellation_distances = {}

    for star in stars_data:
        const_name = star.get("constellation")
        distance = star.get("distance_light_year")

        if const_name and distance is not None:
            if const_name not in constellation_distances:
                constellation_distances[const_name] = []
            constellation_distances[const_name].append(distance)

    # 2. Вычисляем среднее арифметическое между самой далекой и самой ближней звездой
    avg_distances = {}
    for const_name, distances in constellation_distances.items():
        min_dist = min(distances)
        max_dist = max(distances)
        avg_dist = (min_dist + max_dist) / 2
        avg_distances[const_name] = round(avg_dist, 2)

    # 3. Читаем данные о созвездиях
    with open(constellations_file, "r", encoding="utf-8") as f:
        constellation_data = json.load(f)

    # 4. Обновляем значение avg_distance в созвездиях
    # Поддерживаем как список объектов, так и словарь
    if isinstance(constellation_data, list):
        for const in constellation_data:
            name = const.get("name") or const.get("constellation")
            if name in avg_distances:
                const["avg_distance"] = avg_distances[name]
    elif isinstance(constellation_data, dict):
        for const_key, const in constellation_data.items():
            name = const.get("name") or const_key
            if name in avg_distances:
                const["avg_distance"] = avg_distances[name]

    # 5. Перезаписываем обновленный JSON созвездий
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(constellation_data, f, ensure_ascii=False, indent=2)

    print("Данные успешно обновлены!")


if __name__ == "__main__":
    update_constellation_avg_distances()