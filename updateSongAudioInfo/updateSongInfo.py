import os, sys, base64, json
sys.path.append(os.path.dirname('additionalLibraries/tinytag-1.10.1/tinytag'))
from tinytag import TinyTag


# Get the parent file directory in ordeer to access the songs folder
currentFileDirectory = os.getcwd()
parentFileDirectory = os.path.dirname(currentFileDirectory)


# Get the most recent song added to the songsInfo json file
startingSongNumber = (int(open(parentFileDirectory+"/songAudioInfo/txt/lastUpdateFileNumber.txt", "r").readline()))+1

print("Please enter how many songs you want to add")
endingSongNumber = int(input())
for i in range(endingSongNumber):
	print(startingSongNumber+i)