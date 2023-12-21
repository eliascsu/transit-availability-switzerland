from heatmap import main as heatmap_main
from get_PT_quality import main as get_PT_quality_main
from calc_coverage import main as calc_coverage_main


def generate_data():
    heatmap_main()

if __name__ == "__main__":
    generate_data()
    get_PT_quality_main()
    calc_coverage_main()