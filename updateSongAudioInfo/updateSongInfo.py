import os, sys, json
sys.path.append(os.path.dirname('additionalLibraries/tinytag-1.10.1/tinytag'))
from tinytag import TinyTag


# Get the parent file directory in order to access the songs folder
currentFileDirectory = os.getcwd()
parentFileDirectory = os.path.dirname(currentFileDirectory)


# Get the next song to be added to the songsInfo json file
startingSongNumber = (int(open(parentFileDirectory+"/songAudioInfo/txt/nextSongUpdateFileNumber.txt", "r").readline()))

# Input for the number of new songs information to be added
print("Please enter how many songs you want to add")
numberOfSongsToAdd = int(input())

# For loop to add the new songs info
for i in range(numberOfSongsToAdd):
	# Load the songsInfo.json file
	# When the songsInfo.json file is empty, create an empty dictionary
	if os.stat(parentFileDirectory+"/songAudioInfo/json/songsInfo.json").st_size == 0:
		songInfo = {}
	# When the songsInfo.json file is not empty, load the values into a dictionary
	elif os.stat(parentFileDirectory+"/songAudioInfo/json/songsInfo.json").st_size != 0:
		songInfo = json.load(open(parentFileDirectory+"/songAudioInfo/json/songsInfo.json"))
	else:
		None
	
	# Load the song metadata
	try:
		song = TinyTag.get(parentFileDirectory+"/songs/"+str(startingSongNumber+i)+".mp3")
	except FileNotFoundError:
		numberOfSongsToAdd = i
		break

	songName = song.title
	songArtist = song.artist
	songAlbum = song.album

	# Add the song information to songInfo dictionary
	songInfo[str(startingSongNumber+i)] = [songName, songArtist, songAlbum]

	# Convert the dictionary to JSON
	songInfoJson = json.dumps(songInfo)
	open(parentFileDirectory+"/songAudioInfo/json/songsInfo.json", "w").write(songInfoJson)


# Update the number of the next song to be added to the songsInfo json file number
open(parentFileDirectory+"/songAudioInfo/txt/nextSongUpdateFileNumber.txt", "w").write(str(startingSongNumber+numberOfSongsToAdd))