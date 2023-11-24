from flask_restful import Api
import server.resources as res

API = "/api/v1/"  # optional string


def add_routes(app):
    api = Api(app)

    api.add_resource(res.population_data.PopulationResource, API + "data/population")
    api.add_resource(res.OeV_Haltestellen_data.OeVHaltestellenResource, API + "data/OeV_Haltestellen_ARE")
    return api
