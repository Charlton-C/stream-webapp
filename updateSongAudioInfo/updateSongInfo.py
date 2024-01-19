import os, sys, base64, json
sys.path.append(os.path.dirname('additionalLibraries/tinytag-1.10.1/tinytag'))
from tinytag import TinyTag


# Get the parent file directory in ordeer to access the songs folder
currentFileDirectory = os.getcwd()
parentFileDirectory = os.path.dirname(currentFileDirectory)


# Get the most recent song added to the songsInfo json file
startingSongNumber = (int(open(parentFileDirectory+"/songAudioInfo/txt/lastUpdateFileNumber.txt", "r").readline()))

# Input for the number of new songs info to be added
print("Please enter how many songs you want to add")
numberOfSongsToAdd = int(input())

# For loop to add the new songs info
for i in range(numberOfSongsToAdd):
	print((startingSongNumber+1) + i)

# Update the most recent song added to the songsInfo json file number
open(parentFileDirectory+"/songAudioInfo/txt/lastUpdateFileNumber.txt", "w").write(str(startingSongNumber+numberOfSongsToAdd))