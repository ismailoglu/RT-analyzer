RT-analyzer
===========

An app to analyze real-time PCR data

## Background

RT-PCR or [quantitative real-time PCR](http://en.wikipedia.org/wiki/Real-time_polymerase_chain_reaction) is a technique that is used to analyze expression level of a specific RNA molecule in a sample. I won't go into much detail, but a PCR (polymerase chain reaction) is performed and the amound of DNA is measured at every cycle. Multiple reactions are run in parallel in order to test multiple samples (e.g. control vs treatment) and different genes in those samples. The difference between cycle numbers where a reaction passes a set threshold DNA amount, shows the difference between expression levels of two genes. 

### What is used now and why we need this

There is no widely used, specialized program for RT-PCR analysis. People usually use Excel, which means a lot of time moving numbers around, typing in formulas etc. When the reaction numbers increase the sheets become hard to control. Finally, drawing the graphs in Excel can be a hassle. Adding error bars is not a simple task.

## Input

Every reaction has two parameters: Sample and Gene. Corresponding to these parameters there will be a cycle number, e.g. "24.15". Different instruments have different output models, but a user can easily copy and paste their data into a .csv file in a predetermined format ("Sample","Gene","Cycle number"). So, the data will be input by uploading .csv files.

In addition to the data, the user should be able to define "repeat samples" and special control genes. So, there should be a little form with a few menus.

## Calculations

Expression level of a Gene is determined in relation to a "control" gene selected by the user. So, the difference between cycle numbers should be calculated.

If the Sample and Gene are the same for two reactions these are repeat reactions. So, data from these should be averaged. Also, the user will be able to select some "Sample" names that are repeats of each other. This should be averaged and standard deviations should be calculated. (The first group is possibly technical repeats and the second group is biological repeats. The user should be asked what to do with each type.)

## Output

At the end, we will come to a list of averages and stdevs for each "Sample"-"Gene" pair. This should be outputted either as a table or csv, so that the user can take their data back to Excel if they wish to.

The main output will be in the form of graphs. The user should be given a choice of graph types (bar, line etc.). The graph should be redrawn as the user chooses a different type. The user should be able to choose what type of error bars they want and these should be introduced automatically. The user should be able to change some parameters of the graph (colors, bar width etc.) for visual appeal. At the end the user should be able to save their graphs as an image at different resolutions for presentation or publication purposes. 

## Conclusion
All in all this is a simple program that would save a lot of time and help us create beautiful graphs. As it is our motto, the program should be easy to use and provide the same experience on different platforms from Macbook Pro to Chromebook.
