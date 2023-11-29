# API Reference

## Overview

**Base URL**: `http://localhost:8000/api/v1/`


## Endpoints

### /datasets/population-heatmap

#### GET

**Summary**: Get population heatmap

**Description**: 

```json
[   
    {
        "lat": "float",
        "lng": "float",
        "intensity": "float",
        "actual": "integer"
    }   
]
```

### /datasets/population-unserved

#### GET

**Summary**: Get population unserved

**Description**: 

```json
[   
    {
        "lat": "float",
        "lng": "float",
        "intensity": "float",
        "actual": "integer"
    }   
]
```

### /datasets/pt-stops-are

#### GET

**Summary**: Get PT Stops provided by ARE

**Returns**:
GeoJSON FeatureCollection


### /user/pt-stops

#### GET

**Summary**: Get population served by User PT Stops

**Returns**:

```json
{
    "population_served": "integer",
}
```

#### POST

**Summary**: Create User PT Stops

Note: Will wait until previous requests are finished, then return the result.

**Takes**:

GeoJSON FeatureCollection

**Returns**:

Same GeoJSON FeatureCollection

### /datasets/pt-stops-are

#### GET

**Summary**: Get PT Stops provided by ARE

**Returns**:
GeoJSON FeatureCollection
