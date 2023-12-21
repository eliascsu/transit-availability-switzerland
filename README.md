# Project Title

[[_TOC_]]

## Team Members
1. Joshua Durrant \<jdurrant>
2. Leander Hemmi \<hemmil>
3. Mathias Schmid \<smathia>
4. Cedric Koller \<cekoller>
5. Elias Csuka \<ecsuka>

## Project Description 

### Transit Availability in Urban and Suburban Areas

The goal of this project is to provide an application to display urban mobility data in contrast to population density. The issue consists of possible unequal access to mobility for some people living in urban and suburban areas. The application will visualize this, using OGD provided by the city of Zurich, with the possibility of extending the functionality for other urban areas. We do this by showing a map of the city, and overlaying a heatmap of the population over said area. Then, transit lines are added to the map, to visualize them. In the backend we use points spaced 100m from eachother, and calculate the time it would take to get from said points to a city-center/POI. The longer it takes, the more unequal is the access to mobility. For this we consider 4 main modes of transport: Public transit (Rail, Bus, etc.), Walking, Cycling and Driving. The user can then select which mode of transport they want to use, and the map will update accordingly. The user can also select a specific point on the map, and the application will show the time it takes to get to the c
tity-center/POI from said point. As an extension, we could also display land value and rent prices, to show the correlation between these and the access to mobility, and some possible inequalities.


### Ideas
Night lines in contrast to population age

### Users
Urban developers, transit planners, city planners, urban mobility researchers, etc.

### Datasets
Add here all used datasets.\
Document here where to find the data and how to download it. 
- Population Density per ha
  https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/gebaeude-wohnungen-haushalte-personen/bevoelkerung-haushalte-ab-2010.html
- Public transport stops and lines
  https://data.stadt-zuerich.ch/dataset/vbz_fahrplanogd

- Calculation of PT quality
  https://www.are.admin.ch/verkehrserschliessung
  Possibly reimplement the calculation oneself, so as to use other cities as well.
- Other datasets on https://map.geo.admin.ch/
  - [Travel time to centers](https://map.geo.admin.ch/?topic=are&lang=en&bgLayer=ch.swisstopo.pixelkarte-grau&catalogNodes=954%2C959%2C965&E=2617385.70&N=1186832.86&zoom=1.98685302734375&layers=ch.are.reisezeit-oev%2Cch.are.reisezeit-miv&layers_opacity=0.75%2C0.75&layers_visibility=true%2Cfalse)

### Tasks
Define all the tasks you want your dashboard solve.

### Frontend
- [x] Create content page and add base map with leaflet
- [x] Visualize population density
- [x] Draw quality of transit as heatmap
- [x] Make transit stops selectable and editable to redraw heatmap
- [x] Create a feature where one can draw a polyline as a new transit line, then send points of recalculation to backend, and then redraw the map.
- [x] Create account system to store user edited maps (optional)

### Backend
- [x] Implement backend crawler for population density
- [x] Implement route for population density
- [x] Describe logic on calculation for public transit quality
- [x] Implement backend crawler for public transit stops & lines
- [x] Implement calculation for public transit quality [Optional]: Do this for other cities
- [x] Implement route for public transit quality

- - -
## Folder Structure
Specify here the structure of you code and comment what the most important files contain

Generated with `tree --gitignore`

``` bash
.
├── backend-project
│   ├── data
│   │   ├── Population.csv -> Population for each ha. Created by crawler/main.py
│   │   ├── pt-stops.geojson -> Public transit stops and quality. Created by crawler/main.py
│   │   ├── UnservedPopulation.csv -> Population not served by PT for each ha. Created by crawler/main.py
│   │   └── user-pt-stops.geojson -> User created PT stops. Created by backend-server
│   ├── Dockerfile
│   ├── docs
│   │   └── API.md -> Documentation of the API
│   ├── MANIFEST.in
│   ├── package.json
│   ├── package-lock.json
│   ├── pyproject.toml
│   ├── README.md
│   ├── setup.py
│   └── src
│       ├── dummy_server.egg-info
│       │   ├── dependency_links.txt
│       │   ├── entry_points.txt
│       │   ├── PKG-INFO
│       │   ├── requires.txt
│       │   ├── SOURCES.txt
│       │   └── top_level.txt
│       ├── server
│       │   ├── __init__.py
│       │   ├── __pycache__
│       │   ├── resources
│       │   │   ├── datasets
│       │   │   │   ├── PopulationHeatmap.py
│       │   │   │   ├── pt_stops_are.py
│       │   │   │   └── __pycache__
│       │   │   ├── __init__.py
│       │   │   ├── __pycache__
│       │   │   └── user
│       │   │       ├── pt_stops.py
│       │   │       └── __pycache__
│       │   └── router
│       │       ├── app.py
│       │       ├── __init__.py
│       │       ├── __pycache__
│       │       └── routes.py
│       └── server.egg-info
│           ├── dependency_links.txt
│           ├── entry_points.txt
│           ├── PKG-INFO
│           ├── requires.txt
│           ├── SOURCES.txt
│           └── top_level.txt
├── census.py
├── crawler
│   ├── calc_coverage.py
│   ├── constants.py
│   ├── csvtogjson.py
│   ├── get_PT_quality.py
│   ├── heatmap.py
│   ├── main.py
│   ├── __pycache__
│   └── utils.py
├── helm
│   ├── charts
│   ├── Chart.yaml
│   ├── files
│   ├── templates
│   │   ├── deployment.yaml
│   │   ├── ingress.yaml
│   │   └── service.yaml
│   └── values.yaml
├── OeV_Haltestellen_ARE.geojson
├── react-frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── OeV_Haltestellen_ARE.csv
│   │   ├── OeV_Haltestellen_ARE.geojson
│   │   └── robots.txt
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── pages
│   │   │   ├── ContentPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── pages.css
│   │   │   └── utils
│   │   │       └── strings.tsx
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── router
│   │   │   ├── apiClient.ts
│   │   │   └── resources
│   │   │       └── data.ts
│   │   ├── setupTests.ts
│   │   └── types
│   │       ├── data.ts
│   │       └── margin.ts
│   └── tsconfig.json
└── README.md

```
## Resources

- [TransitLayer](https://developers.google.com/maps/documentation/javascript/trafficlayer), hopefully we might come up with a different source for the transitlayer, because apparently one cant use it with leaflet.js without compromising googles TOS
- [OpenTransportData](https://opentransportdata.swiss/en/), this will be used to calculate the quality of transit stops using the frequency of train/bus/tram services
- [Google Maps API](https://developers.google.com/maps)
- [Visualizing data with gmaps](https://mapsplatform.google.com/solutions/visualize-data/)
- [Working with heatmaps in google](https://developers.google.com/maps/documentation/javascript/examples/layer-heatmap)
  - [Example](https://jsfiddle.net/gh/get/library/pure/googlemaps/js-samples/tree/master/dist/samples/layer-heatmap/jsfiddle)
- [Add dataset to gmaps](https://developers.google.com/maps/documentation/javascript/dds-datasets/add-dataset-to-map)
- [Using WFS data in leaflet](https://gis.stackexchange.com/questions/64406/getting-wfs-data-from-geoserver-into-leaflet)
- [Shapefiles in leaflet](https://stackoverflow.com/questions/43478121/display-shapefile-on-leaflet-map-using-an-uploaded-file-zip)


### Zurich
- https://opendatazurich.github.io/geoportal/ some guidance on how to use leaflet with OGD
- https://openzh.github.io/starter-code-openZH/ starter code for using OGD with leaflet



## Requirements
Write here all intructions to build the environment and run your code.\
**NOTE:** If we cannot run your code following these requirements we will not be able to evaluate it.

## How to Run
Write here **DETAILED** intructions on how to run your code.\
**NOTE:** If we cannot run your code following these instructions we will not be able to evaluate it.

As an example here are the instructions to run the Dummy Project:
To run the Dummy project you have to:
- clone the repository;
- open a terminal instance and using the command ```cd``` move to the folder where the project has been downloaded;

To run the backend
- open the backend folder called "backend-project"
- to start the backend first you need to create a virtual environment using conda
    ```conda create -n nameOfTheEnvironment```
  - to activate the virtual environment run the command ```conda activate nameOfTheEnvironment```
  - install the requirements using the command ```pip3 install .```
  - If you want to make changes and test them in real time, you can install the package in editable mode using the command```pip install -e .```
  - to start the backend use the command ```python3 -m gamut_server.router.app``` or use the ```start-server``` command directly on your terminal

To run the frontend
- Open a new terminal window and go to the project folder
- Enter the frontend folder called "react-frontend"
- Do the following command to start the front end ```npm install```, ```npm start```
If all the steps have been successfully executed a new browser window witht he dummy project loaded will open automatically.

## Milestones
Document here the major milestones of your code and future planned steps.\
- [x] Week 1
  - [x] Created Landing Page and Content Page
  - [x] Added Base Map with Leaflet
  - [x] Visualized Population Density as Heatmap
  - [x] Visualized Quality of Transit as Circles
  - [x] Finally found out how to enable issues in GitLab
  - [x] Implemented backend crawler for population density and transit quality, convert files to geojson and created API endpint

- [ ] Week 2
  - [ ] Sub-task: [#2](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/dummy-fullstack/-/issues/2)
  - [ ] Sub-task: ...

Create a list subtask.\
Open an issue for each subtask. Once you create a subtask, link the corresponding issue.\
Create a merge request (with corresponding branch) from each issue.\
Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit.\
Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details. 

This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.  

## Weekly Summary 
Write here a short summary with weekly progress, including challenges and open questions.\
We will use this to understand what your struggles and where did the weekly effort go to.

### Week 1
So the main stuff we did this week was creating the main content page and adding the datasets to it. First we simply used WMS Tile Layers (directly from geo.admin.ch), which were very performant but we realized, that it was not very modular, because we couldn't add our datapoints to pre-rendered layers. Then we took the datasets and modeled the layers ourself, which was wayy more work, especially because the geo.admin.ch uses a different coordinate reference system (EPSG2056) to WGS84. Therefore we had to write a few scripts to create our own datasets with the right coordinates. Performance is also kind of an issue because we are working with fairly large amounts of data (~24000 datapoints for the transit availability and ~340000 for the population heatmap). We are fairly content with the performance at the moment, so it is not our top priority right now. We're still working on an attribution page, to properly credit the authors of the datasets and map tiles.

### Week 2

First of all, apologies for pushing the stable release this late, a lot of work went into making this even happen. This week a lot of work happened in the frontend as well as in the backend. For the frontend: We added the possibility of selecting layers to display, using a checkbox. It is now also possible to draw custom routes, by selecting points on the map, and then choosing a mode of transport and an interval, to calculate a new route. Points are then overlayed using this information to the map. On the backend, a score calculation has been implemented, on how many people are served by the new line, but the endpoint isn't used yet in the frontend. But this isn't the only thing: A lot of stuff has happened in the crawler in general:
1. MUCH BETTER PERFORMANCE: Using vectorization, it was possible to speed up the calculation of the heatmap points from an average of 240 seconds to just about 5 seconds.
2. Added file calc_coverage.py. It is now possible to calculate how many people are covered by one PT circle. This function has been implemented in the backend as well, to calculate a score for the user-added lines. Initially this took about 300 seconds to calculate per point, but using a vectorized haversine function, this now takes about 20-30ms per point, which makes it viable to use for user requests when caching the previous results. To calculate the population served in the entire country, it takes 23400*25ms, which cannot be further sped up, because the calculations are dependent on a shared array. Seeing as this is only required to be executed when the data is generated this is acceptable for us. We now also calculate a transit layer ourselves, to overlay onto the map. This matches the shortest path, using publicly available OSM data, the GTFS feed of switzerland and some libraries. Again, calculating this is very expensive and uses very large files (200gb+), which are not shared in the git repository for obvious reasons. The idea is to match the user rail/bus/tram line to existing geometry.
Frontend tasks for the next week include working on the design and states for the map and content page. For the backend we need to check the feasibility of even using such path matching algorithms. Maybe provide some overlays for the different modes of transport. Finish the score implementation for switzerland. Also provide attributions to libraries used and stuff... Also fix the pipelines

Questions:
How do we run the crawler scripts in gitlab?
Or should we rather run them once locally and push the data to the repository?
How do we access the gitlab website? We still can't see the URL in the CI/CD pipeline.

### Week 3

This week we refactored most of the code, splitting components into different files and functions, using context where necessary. We also reimplemented the logic for the user lines and stops using linestrings. This is much more robust and slightly more performant. We also added an editing mode that is active when the line Form is expanded as well as an attributions page. We added standalone public transport and population density maps to make the content more digestible and guide the user along the website. Also in line with making the content more digestible we added texts explaining the website goals and features. The score is now calculated based on the number of missing people that the newly added user lines cover. Lastly we added the 3D video of Zürich on the content page and improved and fixed the css styling of most of the components. 


## Q&A
How to run crawler weekly with CI/CD
Where link for page in CD

## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags. \
We will evaluate your code every week, based on the corresponding version.Versioning

Tags:
- Week 1: [Stable Release](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/flask/ecsuka_project_flask/-/tags/stable-week-1)
- Week 2: [Stable Release](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/flask/ecsuka_project_flask/-/tags/stable-week-2)
- Week 3: [Stable Release](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/flask/ecsuka_project_flask/-/tags/stable-week-3)
- ...


