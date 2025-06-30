## Blake Stambaugh's Developer Portfolio
Welcome to the code for Blake Stambaugh's website. The main page displaying his personal projects is still under construction. However, the River Report is finished, and can be viewed below.

## [The River Report](https://yumm13.github.io/blake-stambaugh-dev/river-report)
The River Report is a dashboard that displays local river information to the user. The site will automatically scroll through every site, displaying their flow rate in cubic feet per second, water temperature in Fahrenheit, the weather forcast over the next 3 days, and the average flow rate 1 year ago. This project was created to be displayed at the University of Utah's Outdoor Adventures so future customers can have easy access to river information while in the shop.

It displays data from 25 different USGS using their river API. Weather at each of the sites is gathered using OpenMeteo, a free weather API. 

The River Report is also a remaster of a previous project. The first River Report was a Python script that webscraped a website with river info to display the information. This iteration had many issues. First, it gather river data in a poor fashion. If the website ever changed its format, the app was useless. Second, the app was flagged as a potential virus by computers in the shop since it came from an unknown developer. This lead to it not seeing much use. The new version of the River Report fixes these issues by utilizing free and keyless APIs to get the information I need. It is also a static website, so it can be hosted for free on GitHub pages allowing anyone to access it.
