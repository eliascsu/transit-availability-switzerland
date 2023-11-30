from heatmap import main as heatmap_main
from get_PT_quality import main as get_PT_quality_main


def generate_data():
    heatmap_main()

if __name__ == "__main__":
    generate_data()
    get_PT_quality_main()