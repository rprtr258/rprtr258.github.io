import matplotlib.pyplot as plt
import pandas as pd
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()

f = pd.read_csv("raindrop.csv", parse_dates=["Date"], date_parser=lambda x:pd.datetime.strptime(x, "%d.%m.%Y"), names=["Date", "N"])
plt.plot(f["Date"], f["N"])
plt.xlim(min(f["Date"]), max(f["Date"]))
plt.ylim(min(f["N"]), max(f["N"]))
fig = plt.gcf() 
fig.set_size_inches(18.5, 10.5)
fig.savefig("img/fig.png")

