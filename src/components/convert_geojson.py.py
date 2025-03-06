import json

# Load the existing JSON file from the full path
with open('C:/projects/bangalore-lakes-map/public/data/outer-boundary.geojson.json', 'r') as file:
    data = json.load(file)

# Convert GeometryCollection to FeatureCollection
features = []
for geometry in data['geometries']:
    feature = {
        "type": "Feature",
        "geometry": geometry,
        "properties": {}
    }
    features.append(feature)

geojson = {
    "type": "FeatureCollection",
    "features": features
}

# Save the converted GeoJSON
with open('C:/projects/bangalore-lakes-map/public/data/outer-boundary.geojson', 'w') as file:
    json.dump(geojson, file, indent=2)

print("✅ Conversion complete!")
