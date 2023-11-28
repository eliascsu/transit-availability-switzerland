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
            "dataset_OeV_Haltestellen_ARE.geojson",
            "dataset_population.csv",
        ]
    },
    data_files=[(
        "data", [
            os.path.join("data", "dataset_OeV_Haltestellen_ARE.geojson"),
            os.path.join("data", "dataset_population.csv"),
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
        "Flask>=2.0.0",
        "flask-restful>=0.3.9,<0.4",
        "flask-cors>=3.0.10,<3.1",
        "pandas>=1.4.1,<1.5",
        "scikit-learn",
    ],
    packages=find_packages(where="src", include=["server*"]),
    package_dir={"": "src"},
)
