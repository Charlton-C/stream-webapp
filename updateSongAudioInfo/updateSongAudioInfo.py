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


	# Update song info


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
	songAlbumArtist = song.albumartist

	# Add the song information to songInfo dictionary
	songInfo[str(startingSongNumber+i)] = [songName, songArtist, songAlbum]

	# Convert the dictionary to JSON
	songInfoJson = json.dumps(songInfo)
	open(parentFileDirectory+"/songAudioInfo/json/songsInfo.json", "w").write(songInfoJson)


	# Update Album info


	# When the albumsInfo.json file is empty, create an empty dictionary
	if os.stat(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json").st_size == 0:
		albumInfo = {}
	# When the albumsInfo.json file is not empty, load the values into a dictionary
	elif os.stat(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json").st_size != 0:
		albumInfo = json.load(open(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json", "r"))
	else:
		None


	if songAlbum not in albumInfo.keys():
		albumInfo[songAlbum] = [songAlbumArtist, [startingSongNumber+i]]
		albumInfoJson = json.dumps(albumInfo)
		open(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json", "w").write(albumInfoJson)
	elif songAlbum in albumInfo.keys():
		albumInfo[songAlbum][1].append(startingSongNumber+i)
		albumInfoJson = json.dumps(albumInfo)
		open(parentFileDirectory+"/songAudioInfo/json/albumsInfo.json", "w").write(albumInfoJson)
	else:
		None


	# # Update Artist info


	# When the artistsInfo.json file is empty, create an empty dictionary
	if os.stat(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json").st_size == 0:
		artistInfo = {}
	# When the artistsInfo.json file is not empty, load the values into a dictionary
	elif os.stat(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json").st_size != 0:
		artistInfo = json.load(open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "r"))
	else:
		None


	if songArtist == songAlbumArtist:
		if songArtist not in artistInfo.keys():
			artistInfo[songArtist] = [[songAlbum], [startingSongNumber+i]]
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "w").write(artistInfoJson)
		elif songArtist in artistInfo.keys():
			if songAlbum not in artistInfo[songArtist][0]:
				artistInfo[songArtist][0].append(songAlbum)
			artistInfo[songArtist][1].append(startingSongNumber+i)
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "w").write(artistInfoJson)
		else:
			None
	elif songArtist != songAlbumArtist:
		if songArtist not in artistInfo.keys():
			artistInfo[songArtist] = [[], [startingSongNumber+i]]
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "w").write(artistInfoJson)
		elif songArtist in artistInfo.keys():
			artistInfo[songArtist][1].append(startingSongNumber+i)
			artistInfoJson = json.dumps(artistInfo)
			open(parentFileDirectory+"/songAudioInfo/json/artistsInfo.json", "w").write(artistInfoJson)
		else:
			None
	else:
		None


# Update the number of the next song to be added to the songsInfo json file number
open(parentFileDirectory+"/songAudioInfo/txt/nextSongUpdateFileNumber.txt", "w").write(str(startingSongNumber+numberOfSongsToAdd))