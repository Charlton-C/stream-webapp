import os, sys, json
sys.path.append(os.path.dirname('additionalLibraries/tinytag-1.10.1/tinytag'))
from tinytag import TinyTag


# Get the parent file directory in order to access the songs folder
currentFileDirectory = os.getcwd()
parentFileDirectory = os.path.dirname(currentFileDirectory)


# Get the next song to be added to the songsInfo json file
startingSongNumber = (int(open(parentFileDirectory+"/songAudioInfo/txt/nextUpdateFileNumber.txt", "r").readline()))

# Input for the number of new songs information to be added
print("Please enter how many songs you want to add")
numberOfSongsToAdd = int(input())

# For loop to add the new songs info
for i in range(numberOfSongsToAdd):
	song = TinyTag.get(parentFileDirectory+"/songs/"+str(startingSongNumber+i)+".mp3")

	songName = song.title
	songArtist = song.artist
	songAlbum = song.album


	songInfo = {
		(startingSongNumber+i) : [songName, songArtist, songAlbum]
	}

	songInfoJson = json.dumps(songInfo)
	print(songInfoJson)
	open(parentFileDirectory+"/songAudioInfo/json/songsInfo.json", "a").write(songInfoJson)

# Update the number of the next song to be added to the songsInfo json file number
open(parentFileDirectory+"/songAudioInfo/txt/nextUpdateFileNumber.txt", "w").write(str(startingSongNumber+numberOfSongsToAdd))