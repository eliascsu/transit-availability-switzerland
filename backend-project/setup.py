import os
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name="server",
    version="0.0.1",
    description="Backend for the dummy project of the XAI-IML 2023 course.",
    long_description=read("README.md"),
    package_data={
        "": [
            "pt-stops.geojson",
            "Population.csv",
            "UnservedPopulation.csv",
        ]
    },
    data_files=[(
        "data", [
            os.path.join("data", "pt-stops.geojson"),
            os.path.join("data", "user-pt-stops.geojson"),
            os.path.join("data", "Population.csv"),
            os.path.join("data", "UnservedPopulation.csv"),
        ]
    )],
    classifiers=[
        "Intended Audience :: Developers",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Development Status :: 4 - Beta",
    ],
    entry_points={
        "console_scripts": [
            "start-server = server.router.app:start_server",
        ]
    },
    install_requires=[
        "Flask",
        "flask-restful",
        "flask-cors",
        "pandas",
        "scikit-learn",
        "pandas_geojson"
    ],
    packages=find_packages(where="src", include=["server*"]),
    package_dir={"": "src"},
)
