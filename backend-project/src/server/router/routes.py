from flask_restful import Api
import server.resources as r

API = "/api/v1/"  # optional string


def add_routes(app):
    api = Api(app)
    # Datasets
    api.add_resource(r.PopulationHeatmap,  API + "datasets/population-heatmap")
    api.add_resource(r.PopulationUnserved, API + "datasets/population-unserved")
    api.add_resource(r.pt_stops_are,       API + "datasets/pt-stops-are")
    api.add_resource(r.user_pt_stops,      API + "user/pt-stops")
    return api
